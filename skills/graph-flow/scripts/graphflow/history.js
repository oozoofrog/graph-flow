// The server uses the regular dashboard projection for every ledger boundary.
function applyPatch(value, patch) {
  if (Array.isArray(patch)) return patch[0];
  const next = Array.isArray(value) ? value.slice() : {...value};
  for (const [key, change] of Object.entries(patch)) {
    if (Array.isArray(change) && !change.length) delete next[key];
    else if (key === ':' && Array.isArray(next)) next.length = change[0];
    else Object.defineProperty(next, key, {value:applyPatch(value[key], change), enumerable:true, configurable:true, writable:true});
  }
  return next;
}

export function historyStep(steps, at) {
  let lower = 0, upper = steps.length;
  while (lower < upper) {
    const mid = Math.floor((lower + upper) / 2);
    if (steps[mid][0] <= at) lower = mid + 1;
    else upper = mid;
  }
  return lower - 1;
}

export function historyView(timeline, step, at, previous) {
  let view = timeline.base, index = 0;
  if (previous && previous.step <= step) {
    view = previous.view;
    index = previous.step + 1;
  }
  for (; index <= step; index++) view = applyPatch(view, timeline.steps[index][2]);
  return {...view, observed_at_ms:at};
}

const IDLE_THRESHOLD = 30 * 60_000;
const MAX_STUB = 90_000;

export function timeScale({start, end, records, busy}, linear = false) {
  const points = records.map(row => [row.at, row.at]);
  const covered = [[start,start], ...points, ...busy, [end,end]]
    .map(([a,b]) => [Math.max(start,a), Math.min(end,b)])
    .filter(([a,b]) => a<=b).sort((a,b) => a[0]-b[0]);
  const gaps = [];
  let last = start;
  for (const [a,b] of covered) {
    if (!linear && a-last > IDLE_THRESHOLD) gaps.push({start:last,end:a,duration:a-last});
    last = Math.max(last,b);
  }
  const longest = gaps.reduce((max, gap) => Math.max(max,gap.duration), 0);
  const rate = Math.min(1/60, MAX_STUB/Math.max(1,longest));
  let skipped = 0;
  for (const gap of gaps) {
    gap.from = gap.start-start-skipped;
    gap.to = gap.from+gap.duration*rate;
    skipped += gap.duration*(1-rate);
    gap.skipped = skipped;
  }

  const mappedGap = (value, key) => {
    let low = 0, high = gaps.length;
    while (low < high) {
      const mid = Math.floor((low+high)/2);
      if (gaps[mid][key] <= value) low = mid+1;
      else high = mid;
    }
    return gaps[low-1];
  };
  const toScale = value => {
    const gap = mappedGap(value,'start');
    if (!gap) return value-start;
    return value<gap.end ? gap.from+(value-gap.start)*rate : value-start-gap.skipped;
  };
  const fromScale = value => {
    const gap = mappedGap(value,'from');
    if (!gap) return start+value;
    return value<gap.to ? gap.start+(value-gap.from)/rate : start+value+gap.skipped;
  };
  return {start,end,total:toScale(end),toScale,fromScale,gaps,rate};
}

export function timeMarks(index, axis, ends = {}) {
  const waits = new Map(), marks = [];
  for (const row of index.records) {
    if (row.kind==='decision.ask') waits.set(row.id ?? 'd'+row.seq,{kind:'human',start:row.at,node:row.node});
    if (row.kind==='decision.answer' || row.kind==='decision.superseded') {
      const wait=waits.get(row.id);
      if (wait && wait.end==null) wait.end=row.at;
    }
    if (row.kind==='gate.verdict' && ['reject','replan'].includes(row.verdict) ||
        row.kind==='decision.answer' && ['rejected','revision_requested'].includes(row.outcome))
      marks.push({kind:'return',start:row.at,node:row.node});
    if (row.kind==='plan.set' && row.revision>1) marks.push({kind:'revision',start:row.at,revision:row.revision});
  }
  for(const [id,wait] of waits)if(ends[id]!=null)wait.end??=ends[id];
  marks.push(...[...waits.values()].filter(wait=>wait.start!==wait.end), ...axis.gaps.map(gap=>({...gap,kind:'break'})));
  return marks.sort((a,b)=>a.start-b.start);
}

export function createTimeBar({root,t,duration,stamp,load,display,live,cut,clock,deterministic}) {
  const node = (tag, id, className) => {
    const item=document.createElement(tag);
    if (id) item.id=id;
    if (className) item.className=className;
    return item;
  };
  const controls=node('div',null,'history-controls'), track=node('div',null,'history-track');
  const play=node('button','time-play'), speed=node('select','time-speed'), now=node('button','time-live');
  const trueScale=node('button','time-scale'), readout=node('time','time-readout');
  const pastLabel=node('strong','time-past'), status=node('span','time-status');
  pastLabel.setAttribute('role','status');status.setAttribute('role','status');
  const slider=node('input','time-slider'), lines=node('div',null,'history-marks'), words=node('div',null,'history-mark-list');
  slider.type='range';slider.min=0;slider.step='any';
  lines.setAttribute('aria-hidden','true');
  for (const value of [1,4,16,64]) {
    const option=node('option');option.value=value;option.textContent=value+'×';speed.append(option);
  }
  speed.value='4';
  controls.append(play,speed,now,trueScale,pastLabel,readout,status);track.append(lines,slider);
  root.append(controls,track,words);

  let index, axis, timeline, pending, current, cursor, at=0, past=false, playing=false, linear=false;
  let raf=0, lastFrame, lastPaint, request=0, error=false;
  const version = data => JSON.stringify(data?.version);
  const percent = time => (axis.total ? axis.toScale(time)/axis.total*100 : 0)+'%';
  function labels() {
    play.textContent=t(playing?'timePause':'timePlay');
    speed.setAttribute('aria-label',t('timeSpeed'));
    now.textContent=t('timeLive');now.disabled=!past;now.setAttribute('aria-pressed',String(!past));
    trueScale.textContent=t('timeLinear');trueScale.setAttribute('aria-pressed',String(linear));
    trueScale.hidden=!linear&&!axis?.gaps.length;
    slider.setAttribute('aria-label',t('timeScrub'));
    pastLabel.hidden=!past;pastLabel.textContent=past?t('timePast'):'';
    root.dataset.mode=past?'past':'live';
    root.setAttribute("aria-busy", String(!!pending && past));
    status.textContent=error?t('timeFailed'):pending&&past?t('loading'):'';
    play.disabled=slider.disabled=!index?.records.length;
  }

  function rebuildMarks() {
    const nodes=[], captions=[];
    for (const mark of timeMarks(index,axis,version(index)===version(timeline)?timeline.wait_ends:undefined)) {
      const end=mark.end ?? (mark.kind==='human'?index.end:mark.start);
      const line=node('i',null,'history-mark');
      line.dataset.kind=mark.kind;
      line.style.left=percent(mark.start);
      if(end>mark.start)line.style.width=(100*(axis.toScale(end)-axis.toScale(mark.start))/Math.max(1,axis.total))+'%';
      const name=mark.kind==='return'?t('timeReturned'):mark.kind==='revision'?t('timeRevision',{n:mark.revision}):
        mark.kind==='break'?t('timeBreak',{duration:duration(mark.duration)}):
          t('timeHuman',{duration:duration(end-mark.start)});
      const marker=node('button',null,'history-mark-label');
      marker.type='button';marker.dataset.kind=mark.kind;
      marker.dataset.start=mark.start;marker.dataset.end=end;
      marker.textContent=name;marker.title=stamp(mark.start);
      marker.addEventListener('click',()=>seek(mark.start));
      nodes.push(line);captions.push(marker);
    }
    lines.replaceChildren(...nodes);words.replaceChildren(...captions);
  }

  function read() {
    if (!axis) return;
    slider.max=Math.max(1,axis.total);slider.value=axis.toScale(at);
    readout.dateTime=new Date(at).toISOString();
    readout.textContent=stamp(at)+' · '+duration(at-index.start);
    slider.setAttribute('aria-valuetext',readout.textContent);
    cut({at,axis,index,past});
  }

  async function ensureHistory() {
    const key=version(index);
    if (version(timeline)===key) return timeline;
    if (pending?.key===key) return pending.promise;
    const entry={key,promise:null};
    entry.promise=load().then(data=>{
      if(pending===entry){timeline=data;rebuildMarks();}
      return data;
    }).finally(()=>{if(pending===entry){pending=null;labels();}});
    pending=entry;
    return entry.promise;
  }

  function pause() {
    playing=false;lastFrame=null;
    if(raf) cancelAnimationFrame(raf);
    raf=0;labels();
  }

  function paint(target, crossed=null, reset=false) {
    at=target;
    const step=historyStep(current.steps,at);
    if(crossed) {
      for(let i=(cursor?.step??-1)+1;i<=step;i++){
        const stamp=current.steps[i][0];
        const view=historyView(current,i,stamp,cursor);
        cursor={step:i,view};
        if(current.steps[i][1]!==null)crossed(view);
      }
    }
    const elapsed=Math.floor(at/1000);
    if(reset || lastPaint?.step!==step || lastPaint.second!==elapsed) {
      const view=historyView(current,step,at,cursor);
      cursor={step,view};
      display(view,reset);
      lastPaint={step,second:elapsed};
    }
    read();
  }

  async function seek(target, startPlaying=false) {
    if(!index?.records.length)return;
    pause();
    const token=++request;
    past=true;at=target;error=false;
    const loading=ensureHistory();labels();
    root.closest('#flow')?.classList.add('time-loading');
    try {
      const loaded=await loading;
      if(token!==request)return;
      root.closest('#flow')?.classList.remove('time-loading');
      if(current!==loaded)cursor=null;
      current=loaded;lastPaint=null;
      paint(Math.max(index.start,Math.min(index.end,target)),null,true);
      if(startPlaying){playing=true;lastFrame=clock();labels();schedule();}
    } catch {
      if(token===request){returnLive();error=true;labels();}
    }
  }

  function schedule() {
    if(playing && !deterministic() && !raf)raf=requestAnimationFrame(time=>{raf=0;tick(time);schedule();});
  }

  let motion;
  function tick(time) {
    if(!playing)return;
    const elapsed=Math.max(0,time-lastFrame)*Number(speed.value);
    lastFrame=time;
    const end=Math.min(index.end,current.end);
    const target=axis.fromScale(Math.min(axis.toScale(end),axis.toScale(at)+elapsed));
    paint(Math.min(end,target),motion);
    if(target>=end-.01)pause();
  }

  function returnLive() {
    request++;pause();root.closest('#flow')?.classList.remove('time-loading');past=false;current=null;cursor=null;lastPaint=null;error=false;
    if(index)at=index.end;
    live();labels();read();
  }

  slider.addEventListener('input',()=>seek(axis.fromScale(Number(slider.value))));
  play.type=now.type=trueScale.type='button';
  play.addEventListener('click',()=>{
    if(playing)pause();
    else seek(!past||at>=index.end-.01?index.start:at,true);
  });
  now.addEventListener('click',returnLive);
  trueScale.addEventListener('click',()=>{
    linear=!linear;axis=timeScale(index,linear);rebuildMarks();labels();read();
  });
  document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});

  return {
    tick, returnLive, seek, history:ensureHistory,
    setMotion(callback){motion=callback;},
    update(next) {
      const changed=version(index)!==version(next);
      const extended=changed||axis?.end!==next.end;
      index=next;axis=extended?timeScale(index,linear):axis;
      root.hidden=!index.records.length;
      if(!past)at=index.end;
      if(extended)rebuildMarks();
      labels();read();
    },
    reset() {
      request++;pause();root.closest('#flow')?.classList.remove('time-loading');past=false;linear=false;index=axis=timeline=current=cursor=pending=null;
      root.hidden=true;
    },
    describe:()=>({at,past,playing,step:cursor?.step,version:index?.version}),
  };
}
