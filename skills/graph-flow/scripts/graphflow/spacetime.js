// Scene coordinates are the flat plan's x and y, plus elapsed record time.
const mix=(a,b,p)=>a+(b-a)*p;
const clamp=(value,min=0,max=1)=>Math.max(min,Math.min(max,value));
const ease=p=>clamp(p)**2*(3-2*clamp(p));
export const VIEW_POSES={flat:[0,0,-.19],space:[1,0,-.19],side:[1,1,0]};

export function transitionPose(from,to,elapsed,duration) {
  if(elapsed>=duration)return to;
  return from.map((value,i)=>mix(value,to[i],ease(elapsed/duration)));
}

export function spaceProjection(layout, box, pose, axis, at, sideScroll=0) {
  const [tilt,side,yaw]=pose;
  const lean=ease(tilt), lanes=ease(side);
  const angle=mix(1.08*tilt,Math.PI/2,lanes);
  const azimuth=yaw*lean*(1-lanes), cosine=Math.cos(azimuth), sine=Math.sin(azimuth);
  const pitchY=lanes===1?0:Math.cos(angle), pitchTime=Math.sin(angle);
  const {width,height}=layout.bounds;
  const timeHeight=Math.max(170,Math.min(width*.45,Math.max(260,height*.82)));
  const xCenter=width/2, yCenter=height/2;
  const spatialScale=Math.max(.025,Math.min((box.width-92)/(width*Math.abs(cosine)+height*Math.abs(sine)),
    (box.height-155)/((height*Math.abs(cosine)+width*Math.abs(sine))*Math.cos(1.08)+timeHeight*Math.sin(1.08))));
  const sideScale=Math.max(.025,(box.height-178)/timeHeight);
  const zoom=mix(mix(box.scale,spatialScale,lean),sideScale,lanes);
  const order=[...layout.cards].sort((a,b)=>a.layer-b.layer||a.y-b.y||a.order-b.order);
  const sideWidth=Math.max(box.width,order.length*158+84);
  const laneWidth=(sideWidth-84)/Math.max(order.length,1);
  const surfaceHeight=axis.toScale(at)/Math.max(1,axis.total)*timeHeight;
  const cx=mix(box.x+xCenter*box.scale,box.width/2,lean)-clamp(sideScroll,0,sideWidth-box.width)*lanes;
  const cy=mix(box.y+yCenter*box.scale,box.height/2+3,lean);
  const timeZ=time=>axis.toScale(time)/Math.max(1,axis.total)*timeHeight;
  const timeCenter=timeHeight/2;
  function project(x,y,z) {
    const dx=x-xCenter, dy=y-yCenter;
    return {x:cx+zoom*(cosine*dx-sine*dy),
      y:cy+zoom*(pitchY*(sine*dx+cosine*dy)-pitchTime*(z-timeCenter)*lean)};
  }
  const cards=new Map(order.map((card,i)=>{
    const laneX=xCenter+(42+(i+.36)*laneWidth-box.width/2)/sideScale;
    return [card.id,{x:mix(card.x+card.width/2,laneX,lanes),y:mix(card.y+card.height/2,yCenter,lanes),lane:i}];
  }));
  const worldWidth=mix(width,(sideWidth-64)/sideScale,lanes);
  const worldCenter=mix(xCenter,xCenter+(sideWidth-box.width)/2/sideScale,lanes);
  const left=worldCenter-worldWidth/2, right=worldCenter+worldWidth/2;
  const frame=[[left,0],[right,0],[right,height],[left,height]];
  const timePoint=(x,y,time)=>project(x,y,timeZ(time));
  const origin=project(0,0,surfaceHeight);
  const u=project(1,0,surfaceHeight), v=project(0,1,surfaceHeight);
  const plane={a:u.x-origin.x,b:u.y-origin.y,c:v.x-origin.x,d:v.y-origin.y,e:origin.x,f:origin.y,
    opacity:1-lanes,zoom};
  return {cards,frame,project,timePoint,timeZ,plane,lean,lanes,zoom,sideWidth,laneWidth,
    nodeAt:(id,time)=>{const position=cards.get(id);return timePoint(position.x,position.y,time);}};
}

const observedKinds=new Set(['tool','skill','mcp','session','gf','other']);
const terminalVerdicts=new Set(['pass','reject','replan','unverified']);
const eventId=seq=>'execution:'+seq;
const observationId=index=>'activity:'+index;
const unique=values=>[...new Set(values)];

export function spaceHistory(layout,{at,index,axis},transfers,waitEnds={},resets={}) {
  const pillars=new Map(layout.cards.map(card=>[card.id,{id:card.id,attempts:[],segments:[],marks:[],starts:[],calls:new Map()}]));
  const attempts=new Map(layout.cards.map(card=>[card.id,new Map((card.attemptHistory||[]).map(attempt=>
    [attempt.attempt,new Map(attempt.calls.map(call=>[call.id,call]))]))]));
  const asks=new Map(), edgeKeys=new Set(layout.edges.map(edge=>edge.key));
  const min=index.start, max=at;
  const add=(pillar,kind,from,to,records,options={})=>{
    if(!Number.isFinite(from)||!Number.isFinite(to)||from>max||to<min||from>to)return;
    const start=clamp(from,min,max), end=clamp(to,min,max);
    const timing={kind,start,end,ids:unique(records),low:axis.toScale(start),high:axis.toScale(end),...options};
    if(start===end){
      if(options.point) pillar.marks.push(timing);
      return;
    }
    pillar.segments.push({...timing,duration:options.duration??end-start});
  };
  for(const row of index.records) {
    if(row.at>at)break;
    const pillar=pillars.get(row.node), time=row.activity==null?row.time:row.at, kind=row.kind;
    if(!Number.isFinite(time))continue;
    const record=eventId(row.seq);
    const mark=(kind,failed=false)=>add(pillar,kind,time,time,[record],{point:true,failed});
    for(const node of resets[row.seq]||[]){
      const ended=pillars.get(node)?.attempts.at(-1);
      if(ended && ended.stop==null){
        ended.stop=Math.max(ended.start,time);
        ended.stopId=record;
        ended.end ??= ended.stop;
      }
    }
    if(kind==='decision.answer'||kind==='decision.superseded'){
      const ask=asks.get(row.id);
      if(ask && ask.end==null){ask.end=Math.max(ask.start,time);ask.closeId=record;}
    }
    if(!pillar)continue;
    const active=pillar.attempts.at(-1);
    if(kind==='node.start'){
      if(active && active.end==null)active.end=Math.max(active.start,time);
      pillar.attempts.push({start:time,seq:row.seq,number:row.attempt});
      pillar.starts.push({time,seq:row.seq});
      mark('start');
    } else if(kind==='node.reopen') {
      if(active && active.end==null)active.end=Math.max(active.start,time);
      mark('return',true);
    } else if(kind==='node.submit'||kind==='review.submit'){
      if(active){active.end=active.submit=Math.max(active.start,time);active.submitId=record;}
      mark('submit');
    } else if(kind==='gate.verdict'){
      const failed=['reject','replan','unverified'].includes(row.verdict);
      if(active && terminalVerdicts.has(row.verdict)){
        active.verdict=Math.max(active.submit??active.start,time);
        active.verdictId=record;active.failed=failed;
        active.end ??= active.verdict;
      }
      mark(['reject','replan'].includes(row.verdict)?'return':'verdict',failed);
    } else if(kind==='decision.ask'){
      asks.set(row.id??'d'+row.seq,{pillar,start:time,seq:row.seq});
      mark('asked');
    } else if(kind==='decision.answer'||kind==='decision.superseded'){
      mark(kind==='decision.answer'?'answered':'superseded');
    } else if(kind==='check.result'||kind==='check.red'){
      const duration=Number.isFinite(row.duration_ms)?row.duration_ms:0, start=time-duration;
      const failed=row.result==='failed';
      add(pillar,'check',Math.max(active?.start??min,start),time,[record],{duration,failed,observed:true});
      mark('check',failed);
      if(!active && !pillar.starts.length)pillar.starts.push({time:Math.max(min,start),seq:row.seq});
    } else if(kind==='gate.final'){
      mark('verdict',row.result==='failed');
    } else if(row.activity!=null) {
      const key=JSON.stringify([row.attempt,row.call]);
      const call=pillar.calls.get(key)??{id:row.call,category:observedKinds.has(row.category)?row.category:'other',
        number:row.attempt,ids:[]};
      call[row.phase]=time;
      call.ids.push(observationId(row.activity));
      pillar.calls.set(key,call);
    }
  }
  for(const [id,ask] of asks){
    ask.end ??= waitEnds[id];
    add(ask.pillar,'human',ask.start,ask.end??at,[eventId(ask.seq),ask.closeId].filter(Boolean));
    ask.pillar.starts.push({time:ask.start,seq:ask.seq});
  }
  for(const pillar of pillars.values()){
    const callsByAttempt=attempts.get(pillar.id);
    for(const [i,attempt] of pillar.attempts.entries()){
      const next=pillar.attempts[i+1];
      const workEnd=attempt.end??at;
      const startId=eventId(attempt.seq), nextId=next&&eventId(next.seq);
      if(attempt.submit!=null)add(pillar,'verify',attempt.submit,attempt.verdict??attempt.stop??next?.start??at,
        [attempt.submitId,attempt.verdictId??attempt.stopId??nextId].filter(Boolean),{failed:attempt.failed});
      const calls=[...pillar.calls.values()].filter(call=>call.number===attempt.number &&
        (call.start??call.end)>=attempt.start && (!next || (call.start??call.end)<next.start))
        .sort((a,b)=>(a.start??a.end)-(b.start??b.end));
      let covered=null, open=false;
      for(const call of calls){
        const measured=callsByAttempt.get(attempt.number)?.get(call.id);
        const options={point:true,observed:true,count:1,attempt:attempt.seq,closed:call.end!=null,
          duration:call.end!=null?measured?.duration_ms:undefined,failed:call.end!=null&&measured?.failed};
        if(covered && !open && call.start-covered.end>=1000)
          add(pillar,'thinking',covered.end,call.start,[...covered.ids,...call.ids]);
        if(call.start==null)add(pillar,call.category,call.end,call.end,call.ids,options);
        else add(pillar,call.category,call.start,Math.max(call.start,call.end??workEnd),call.ids,options);
        if(call.end==null)open=true;
        else if(!covered || call.end>covered.end)covered=call;
        pillar.calls.delete(JSON.stringify([call.number,call.id]));
      }
      if(!calls.length)add(pillar,'unobserved',attempt.start,workEnd,
        [startId,attempt.submitId??attempt.verdictId??attempt.stopId??nextId].filter(Boolean));
    }
    // An observation with no matching visible attempt still has its own recorded timestamp.
    for(const call of pillar.calls.values()){
      const time=call.start??call.end;
      add(pillar,call.category,time,time,call.ids,{point:true,observed:true,count:1});
    }
    delete pillar.calls;
  }

  const lines=[];
  for(const transfer of transfers){
    const key=JSON.stringify(transfer.relation);
    if(!edgeKeys.has(key)||transfer.visible>at)continue;
    const [source,target,relation]=transfer.relation;
    const from=transfer.reverse&&relation==='reviews'?target:source, to=transfer.reverse?source:target;
    const a=pillars.get(from), b=pillars.get(to);
    const started=Date.parse(transfer.time);
    if(!Number.isFinite(started)||started>at)continue;
    const receiver=b.starts.filter(row=>row.seq>transfer.seq&&row.time>=started)
      .sort((a,b)=>a.seq-b.seq)[0];
    const start=clamp(started,min,max), end=clamp(receiver?.time??at,min,max);
    const ids=[eventId(transfer.seq)];
    if(receiver)ids.push(eventId(receiver.seq));
    if(![...a.marks,...a.segments].some(item=>item.end===start))
      add(a,transfer.reverse?'return':'handoff',start,start,[ids[0]],{point:true,failed:transfer.reverse});
    if(receiver && ![...b.marks,...b.segments].some(item=>item.start===end))
      add(b,'start',end,end,[ids[1]],{point:true});
    lines.push({key,from,to,start,end,duration:end-start,ids,low:axis.toScale(start),high:axis.toScale(end),
      receiver:receiver?.time??null,receiverSeq:receiver?.seq,reverse:transfer.reverse,seq:transfer.seq});
  }

  for(const pillar of pillars.values()){
    pillar.top=[...pillar.segments,...pillar.marks].reduce((top,item)=>Math.max(top??item.end,item.end),null);
    pillar.drop=pillar.top!=null&&pillar.top<at?{start:pillar.top,end:at}:null;
  }
  return {pillars:[...pillars.values()],lines};
}

// Geometry can cover overlapping calls. The words add the same per-call
// contributions as activity condensation, including concurrent measured time.
export function aggregateSegments(segments,scaledHeight,lineHeight) {
  const ordered=[...segments].sort((a,b)=>a.start-b.start||b.end-a.end);
  const work=[], standing=[];
  for(const segment of ordered)(segment.count?work:standing).push(segment);
  const groups=[];
  let coveredUntil;
  for(const segment of work){
    const prior=groups.at(-1), last=prior?.at(-1);
    if(last?.closed && segment.closed && last.kind===segment.kind && last.attempt===segment.attempt &&
        segment.start-coveredUntil<1000 && scaledHeight(last)<lineHeight && scaledHeight(segment)<lineHeight){
      prior.push(segment);coveredUntil=Math.max(coveredUntil,segment.end);
    }else{
      groups.push([segment]);coveredUntil=segment.end;
    }
  }
  return [...standing,...groups.map(members=>{
    if(members.length===1)return members[0];
    const first=members[0],last=members.reduce((a,b)=>a.end>=b.end?a:b);
    return {...first,end:last.end,high:last.high,ids:unique(members.flatMap(member=>member.ids)),
      count:members.reduce((n,member)=>n+member.count,0),duration:members.reduce((n,member)=>n+member.duration,0),
      failed:members.some(member=>member.failed),members};
  })].sort((a,b)=>a.start-b.start||b.end-a.end);
}

export function spaceTicks(axis, at) {
  const intervals=[1000,5000,15000,30000,60000,300000,900000,1800000,3600000,10800000,21600000,43200000,
    86400000,259200000,604800000,2592000000,31536000000];
  const step=intervals.find(value=>value>=axis.total/6)??intervals.at(-1);
  const ticks=[axis.start];
  const kept=[[axis.start,at]];
  for(const gap of axis.gaps){
    const tail=kept.at(-1);
    if(gap.start>=tail[1])break;
    tail[1]=gap.start;kept.push([gap.end,at]);
  }
  for(const [start,end] of kept)for(let time=axis.start+Math.ceil((start-axis.start)/step)*step;time<=end;time+=step)
    if(time!==axis.start)ticks.push(time);
  return ticks;
}

const pathOf=(points,closed=false)=>'M'+points.map(p=>p.x+' '+p.y).join(' L')+(closed?'Z':'');
const segmentLabels={
  start:'activityStart',check:'spaceCheck',submit:'activitySubmit',verify:'spaceVerify',human:'spaceHuman',
  unobserved:'spaceUnobserved',handoff:'spaceHandoff',return:'timeReturned',verdict:'spaceVerdict',
  asked:'spaceAsked',answered:'spaceAnswered',superseded:'evSuperseded',
  thinking:'activityThinking',tool:'activityNameTool',skill:'activityNameSkill',mcp:'activityNameMcp',
  session:'activityNameSession',gf:'cardChecks',other:'activityNameOther',
};

const LABEL_LINE=15, MIN_WORK_HEIGHT=5, TRANSFER_SHARE=.10;
const activeTags=new Set(['frontier','waiting','blocked','returned']);
const priority=(kind,failed,selected)=>['human','asked','blocked'].includes(kind)?0:
  failed||kind==='returned'?1:selected?2:3;

const markerShapes={
  start:'M-4 3L0 -3L4 3Z', check:'M-4 -3H4V3H-4Z', verdict:'M-4 0L0 -4L4 0L0 4Z',
  submit:'M-4 -3H4L0 3Z', return:'M3 -4L-3 0L3 4', asked:'M-3 -3H3L0 0L3 3H-3L0 0Z',
  answered:'M-4 -1L-1 3L4 -3', superseded:'M-3 -3L3 3M-3 3L3 -3', handoff:'M-4 0H4M0 -4V4',
};
const markerSlots={start:-9,check:7,verdict:18,submit:-19,return:28,asked:-9,answered:9,superseded:18,handoff:-29};

const recordWords=(item,t,duration)=>[
  item.count>1?t('spaceActivityCount',{name:t(segmentLabels[item.kind]),n:item.count}):t(segmentLabels[item.kind]),
  item.start!==item.end&&item.duration>0?duration(item.duration):'',
].filter(Boolean).join(' · ');
const waitWords=(line,t,duration)=>line.duration>0?t('spaceTransferWait',{duration:duration(line.duration)}):
  t(line.reverse?'timeReturned':'spaceHandoff');

function ink(projection, scene, cut, focus, tools) {
  const {svg,t,duration,stamp,width,tags}=tools;
  const {frame,timePoint,nodeAt,lanes,lean,cards}=projection;
  const {at,axis,index}=cut;
  const layers={grid:[],frame:[],body:[],links:[]}, labels=[], inspections=[];
  const path=(layer,knots,kind,attributes={},closed=false)=>{
    const item=svg('path',{class:kind,d:pathOf(knots,closed),...attributes});
    layers[layer].push(item);return item;
  };
  const dot=(layer,point,kind,attributes={})=>{
    layers[layer].push(svg('circle',{class:kind,cx:point.x,cy:point.y,r:3,...attributes}));
  };
  const label=(id,point,text,kind,options={})=>labels.push({id,point,text,kind,rank:-2,...options});
  const projectedSide=lanes>.98;
  const projectFrame=time=>frame.map(([x,y])=>timePoint(x,y,time));
  const ticks=spaceTicks(axis,at);
  const [[x0,y0],[x1],[,y1]]=frame;
  if(lanes<.998){
    for(let i=0;i<=21;i++){
      const x=mix(x0,x1,i/21),y=mix(y0,y1,i/21);
      path('grid',[timePoint(x,y0,axis.start),timePoint(x,y1,axis.start)],'space-grid');
      path('grid',[timePoint(x0,y,axis.start),timePoint(x1,y,axis.start)],'space-grid');
    }
  }
  for(const time of ticks){
    const points=projectFrame(time);
    path('frame',points,'space-frame',{'data-time':time},true);
    label('left:'+time,{x:projectedSide?6:Math.max(6,points[3].x-55),y:points[3].y},
      duration(time-axis.start),'axis',{time,duration:time-axis.start});
    label('right:'+time,{x:projectedSide?width-6:Math.min(width-6,points[1].x+25),y:points[1].y},
      duration(time-axis.start),'axis',{align:'right',time,duration:time-axis.start});
  }
  for(const gap of axis.gaps){
    if(gap.end>at)break;
    for(const time of [gap.start,gap.end])path('frame',projectFrame(time),'space-break',{'data-time':time},true);
    const p=timePoint(frame[1][0],frame[1][1],(gap.start+gap.end)/2);
    label('break:'+gap.start,{x:projectedSide?width-6:Math.min(width-6,p.x+120),y:p.y},
      t('timeBreak',{duration:duration(gap.duration)}),'break',
      {align:'right',duration:gap.duration,offsets:[[0,0],[0,-17],[0,17]]});
  }
  for(const [x,y] of frame)
    path('frame',[timePoint(x,y,axis.start),timePoint(x,y,at)],'space-corner');
  const now=projectFrame(at);
  path('frame',now,'space-plane',{'data-time':at},true);
  label('cut',{x:projectedSide?width-6:Math.max(now[1].x,now[2].x)-4,y:Math.min(now[1].y,now[2].y)-26},
    (cut.past?t('spaceViewed'):t('timeLive'))+' · '+stamp(at),'now',
    {align:'right',time:at,offsets:[[0,0],[0,-17],[0,17]]});

  for(const pillar of scene.pillars){
    if(pillar.top==null)continue;
    const {id}=pillar, end=nodeAt(id,pillar.top), start=nodeAt(id,axis.start);
    const dim=focus.active&&!focus.cards.has(id), emphasis=dim?'context':'path';
    const picked=focus.active&&!dim;
    const attrs={'data-node':id,'data-emphasis':emphasis};
    path('body',[start,end],'space-pole',attrs);
    if(pillar.drop)path('body',[end,nodeAt(id,at)],'space-drop',{'data-start':pillar.top,'data-end':at,...attrs});
    const center=cards.get(id);
    const scaledHeight=segment=>nodeAt(id,segment.start).y-nodeAt(id,segment.end).y;
    const segments=aggregateSegments(pillar.segments,scaledHeight,LABEL_LINE);
    let overlap=[];
    for(const segment of segments){
      const a=nodeAt(id,segment.start), b=nodeAt(id,segment.end);
      const scaled=scaledHeight(segment);
      const extension=segment.observed?Math.max(0,MIN_WORK_HEIGHT-scaled):0;
      const title=recordWords(segment,t,duration);
      const key='span:'+id+':'+segment.kind+':'+segment.ids.join(',');
      const lineAttrs={...attrs,'data-kind':segment.kind,'data-start':segment.start,'data-end':segment.end,
        'data-duration':segment.duration,'data-records':segment.ids.join(' '),'data-inspect':key,
        'data-count':segment.count??0,'data-extended':extension>0};
      overlap=overlap.filter(end=>end>segment.start);
      const offset=(overlap.length%3)*6;
      overlap.push(segment.end);
      const hollow=['thinking','unobserved','verify','human'].includes(segment.kind);
      const radius=segment.kind==='unobserved'?3:11;
      const halfDepth=radius*mix(.55,0,lanes);
      const extent=radius/projection.zoom;
      const face=(x,y)=>{
        const foot=timePoint(x,y,segment.start),top=timePoint(x,y,segment.end);
        return [{x:foot.x+offset,y:foot.y},{x:top.x+offset,y:top.y-extension}];
      };
      const [frontA,frontB]=face(center.x-extent,center.y+halfDepth/projection.zoom);
      const [rightA,rightB]=face(center.x+extent,center.y+halfDepth/projection.zoom);
      const [backA,backB]=face(center.x+extent,center.y-halfDepth/projection.zoom);
      if(lanes<.999)path('body',[rightA,rightB,backB,backA],'space-segment space-face',
        {'data-kind':segment.kind,'data-emphasis':emphasis},true);
      const drawn=path('body',[frontA,frontB,rightB,rightA],'space-segment'+(hollow?' hollow':''),lineAttrs,true);
      if(extension>0)layers.body.push(svg('path',{class:'space-extension','data-for':key,...attrs,
        d:[-5,1].map(dx=>pathOf([{x:rightA.x+dx-3,y:rightA.y-1},{x:rightA.x+dx,y:rightA.y-MIN_WORK_HEIGHT+1}])).join(' ')}));
      const point={x:rightA.x+5,y:(a.y+b.y-extension)/2};
      const bounds=projectedSide?{left:a.x-projection.laneWidth*.36+3,right:a.x+projection.laneWidth*.64-4}:undefined;
      const item={node:id,record:segment,dim,selected:picked,rank:priority(segment.kind,segment.failed,picked),duration:segment.duration};
      label(key,point,title,'interval',{...item,scaled,bounds,
        offsets:segment.kind==='human'?[[0,0],[0,18],[0,36]]:undefined});
      inspections.push({key,drawn,point,text:extension>0?title+' · '+t('spaceNotToScale'):title,node:id,time:segment.start,
        box:{left:frontA.x-3,top:Math.min(frontB.y,rightB.y)-3,right:rightA.x+3,bottom:Math.max(frontA.y,rightA.y)+3}});
    }
    for(const mark of pillar.marks){
      const a=nodeAt(id,mark.start), key='mark:'+id+':'+mark.kind+':'+mark.ids.join(','), text=recordWords(mark,t,duration);
      const x=a.x+(markerSlots[mark.kind]??0);
      const drawn=svg('path',{...attrs,class:'space-tick',d:markerShapes[mark.kind]??'M0 -3L3 0L0 3L-3 0Z',
        transform:'translate('+x+' '+a.y+')','data-kind':mark.kind,'data-start':mark.start,'data-end':mark.end,
        'data-records':mark.ids.join(' '),'data-inspect':key});
      if(Math.abs(x-a.x)>8)path('body',[a,{x:x+Math.sign(a.x-x)*5,y:a.y}],'space-tick-stem',attrs);
      layers.body.push(drawn);
      const point={x:a.x+32,y:a.y};
      const bounds=projectedSide?{left:a.x-projection.laneWidth*.36+3,right:a.x+projection.laneWidth*.64-4}:undefined;
      label(key,point,text,'mark',{node:id,record:mark,dim,bounds,selected:picked,eligible:picked,rank:priority(mark.kind,mark.failed,picked)});
      inspections.push({key,drawn,point,text,node:id,time:mark.start,box:{left:x-5,top:a.y-6,right:x+5,bottom:a.y+6}});
    }
  }

  const hits=[], convergence=new Map();
  const threshold=(index.end-index.start)*TRANSFER_SHARE;
  const transferLabels=[];
  for(const line of scene.lines){
    const a=nodeAt(line.from,line.start), b=nodeAt(line.to,line.end);
    const picked=focus.active&&focus.relations.has(line.key), dim=focus.active&&!picked;
    const key='transfer:'+line.key+':'+line.seq+':'+line.reverse;
    const attrs={'data-relation':line.key,'data-seq':line.seq,'data-start':line.start,'data-end':line.end,
      'data-reverse':String(line.reverse),'data-emphasis':dim?'context':picked?'selected':'normal'};
    const drawn=path('links',[a,b],'space-transfer',{...attrs,'data-records':line.ids.join(' '),'data-inspect':key});
    dot('links',a,'space-endpoint',attrs);
    dot('links',b,'space-endpoint',attrs);
    hits.push({key:line.key,a,b});
    const point={x:mix(a.x,b.x,.52),y:mix(a.y,b.y,.52)-10}, text=waitWords(line,t,duration);
    const item={labelId:key,point,text,dim,line,selected:picked,rank:priority('',line.reverse,picked),duration:line.duration};
    transferLabels.push(item);
    inspections.push({key,drawn,point,text,time:line.start,relation:line.key,from:line.from,to:line.to,a,b});
    if(!picked){
      const receiver=line.to+':'+(line.receiverSeq??'cut');
      const group=convergence.get(receiver)||[];
      group.push(item);convergence.set(receiver,group);
    }
  }
  const grouped=new Set(), transferOptions={align:'center',offsets:[[0,0],[0,-18],[0,18]]};
  for(const [id,group] of convergence){
    if(group.length<2)continue;
    group.forEach(item=>grouped.add(item.labelId));
    const longest=group.reduce((a,b)=>a.duration>=b.duration?a:b);
    if(longest.duration>0&&longest.duration>=threshold)
      label('convergence:'+id,longest.point,t('spaceTransferGroup',{n:group.length,duration:duration(longest.duration)}),
        'convergence',{...transferOptions,dim:longest.dim,rank:Math.min(...group.map(item=>item.rank)),
          duration:longest.duration,lines:group.map(item=>item.labelId),
          relations:unique(group.map(item=>item.line.key))});
  }
  for(const item of transferLabels){
    const eligible=item.selected || (!grouped.has(item.labelId)&&item.duration>0&&item.duration>=threshold);
    label(item.labelId,item.point,item.text,'transfer',{...item,...transferOptions,eligible});
  }
  if(lanes<.97){
    for(const tag of tags){
      const picked=focus.active&&focus.relations.has(tag.key);
      label('tag:'+tag.key,timePoint(tag.anchor.x,tag.anchor.y,at),tag.text,'tag',{
        align:'center',tone:tag.tone,cue:tag.cue,dim:focus.active&&!picked,selected:picked,
        rank:picked||activeTags.has(tag.cue)?priority(tag.cue,false,picked):4,
        offsets:[[0,0],[0,-16],[0,16]],
      });
    }
  }
  return {paths:[...layers.grid,...layers.frame,...layers.body,...layers.links],labels,hits,inspections,opacity:ease((lean-.03)/.55)};
}

const intersects=(a,b)=>a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
const visibleIn=(rect,box)=>rect.left>=box.left&&rect.right<=box.right&&rect.top>=box.top&&rect.bottom<=box.bottom;
const lineDistance=(p,a,b)=>{
  const dx=b.x-a.x,dy=b.y-a.y;
  const fraction=clamp(((p.x-a.x)*dx+(p.y-a.y)*dy)/(dx*dx+dy*dy||1));
  return Math.hypot(p.x-a.x-dx*fraction,p.y-a.y-dy*fraction);
};

function placeLabels(host,candidates,cards,inspected,width,height,openGroup) {
  const origin=host.getBoundingClientRect();
  const bounds={left:4,top:2,right:width-4,bottom:height-3};
  const rectOf=element=>{
    const r=element.getBoundingClientRect();
    return {left:r.left-origin.left,right:r.right-origin.left,top:r.top-origin.top,bottom:r.bottom-origin.top};
  };
  const occupied=cards.map(element=>({rect:rectOf(element)}));
  const tooltip=inspected && {
    id:'inspection',kind:'inspection',point:inspected.point,text:inspected.text,rank:-1,clamp:true,
    offsets:[[0,0],[0,-18],[0,18],[0,-36],[0,36],[0,-54],[0,54],
      [12-inspected.point.x,24-inspected.point.y]],
  };
  const ordered=[...candidates.filter(item=>item.id!==inspected?.key),...(tooltip?[tooltip]:[])].sort((a,b)=>a.rank-b.rank||(b.duration??0)-(a.duration??0));
  const existing=new Map([...host.children].map(element=>[element.dataset.label,element]));
  const pending=ordered.map(item=>{
    const element=existing.get(item.id)??document.createElement(item.relations?'button':'span');
    if(item.relations){
      element.type='button';
      element.onclick=()=>openGroup(item.relations);
    }
    element.className='space-label space-label-'+item.kind;
    element.dataset.align=item.align||'left';
    element.dataset.label=item.id;
    if(item.node)element.dataset.node=item.node;
    if(item.record)Object.assign(element.dataset,{kind:item.record.kind,start:item.record.start,end:item.record.end});
    if(item.time!=null)element.dataset.time=item.time;
    if(item.duration!=null)element.dataset.duration=item.duration;
    if(item.tone)Object.assign(element.dataset,{role:item.tone,flow:item.cue});
    if(item.dim)element.dataset.emphasis='context';
    else delete element.dataset.emphasis;
    if(element.textContent!==item.text)element.textContent=item.text;
    return {item,element};
  });
  for(const {element} of pending)if(!element.parentNode)host.append(element);
  // Read each text box once before writing any positions.
  const sizes=pending.map(({element})=>rectOf(element));
  const results={}, counts={shown:0,withheld:0};
  const keep=new Set();
  for(const [i,{item,element}] of pending.entries()){
    const {id,point,rank,align,duration=0}=item;
    const size=sizes[i], w=size.right-size.left, h=size.bottom-size.top;
    let status='outside', rect, blocker, nearest, collisionRect;
    if(item.eligible===false)status='policy';
    else if(item.scaled!=null&&item.scaled+.01<h)status='height';
    else for(const [dx,dy] of item.offsets||[[0,0]]){
      const x=point.x+dx-(align==='right'?w:align==='center'?w/2:0), y=point.y+dy-h/2;
      const left=item.clamp?clamp(x,bounds.left,bounds.right-w):x;
      const top=item.clamp?clamp(y,bounds.top,bounds.bottom-h):y;
      const candidate={left,top,right:left+w,bottom:top+h};
      nearest??=candidate;
      if(!visibleIn(candidate,bounds) || item.bounds&&!visibleIn(candidate,{...bounds,...item.bounds}))continue;
      const collision=occupied.find(other=>intersects(candidate,other.rect));
      if(collision){blocker=collision;collisionRect=candidate;continue;}
      rect=candidate;break;
    }
    if(rect){
      status='shown';counts.shown++;
      occupied.push({rect,id,rank});
      element.dataset.align='left';
      element.style.left=rect.left+'px';element.style.top=rect.top+h/2+'px';
      keep.add(element);
    }else{
      counts.withheld++;
      if(blocker)status='collision';
    }
    results[id]={kind:item.kind,rank,duration,status,rect:rect??collisionRect??nearest,blocker:blocker?.id,
      lines:item.lines,text:item.text,cue:item.cue,selected:!!item.selected,
      recordKind:item.record?.kind,failed:!!(item.record?.failed||item.line?.reverse)};
  }
  for(const element of [...host.children])if(!keep.has(element))element.remove();
  return {...counts,results};
}

export function createSpaceView({area,viewport,toolbar,svg,t,duration,stamp,read,apply,load,clock,deterministic,
  canAnimate,canOrbit,isPhone,select,choose,selectNode,notes,nodeTitle}) {
  const controls=document.createElement('div');controls.className='space-views';
  controls.setAttribute('role','group');toolbar.append(controls);
  const buttons=new Map(Object.keys(VIEW_POSES).map((key,i)=>{
    const button=document.createElement('button');
    button.type='button';button.dataset.view=key;button.setAttribute('aria-keyshortcuts',String(i+1));
    button.addEventListener('click',()=>view(key));
    controls.append(button);return [key,button];
  }));
  const layer=svg('svg',{class:'space-ink'});
  const drawing=svg('g',{'aria-hidden':'true'}), targets=svg('g');
  const labels=document.createElement('div');labels.className='space-labels';labels.style.lineHeight=LABEL_LINE+'px';
  const motion=svg('g',{class:'space-effects','aria-hidden':'true'});
  layer.append(drawing,motion,targets);
  area.prepend(layer);area.append(labels);
  let target='flat', pose=VIEW_POSES.flat, transition=null, raf=0, drag=null, projection, scene, hits=[], cutVersion;
  let transfers=[], waitEnds={}, resets={}, request=0, attemptedVersion;
  let candidates=[], inspections=[], obstacles=[], budget, hovered, focused;
  const focusTargets=new Map();
  const defaultPlane=()=>{
    layer.style.display=labels.style.display='none';drawing.replaceChildren();motion.replaceChildren();
    targets.replaceChildren();focusTargets.clear();labels.replaceChildren();candidates=[];inspections=[];
    focused=hovered=null;budget=null;notes([]);
  };
  defaultPlane();

  const inStage=item=>{
    const width=layer.clientWidth,height=layer.clientHeight;
    if(item.a)return Math.min(item.a.x,item.b.x)<width&&Math.max(item.a.x,item.b.x)>0&&
      Math.min(item.a.y,item.b.y)<height&&Math.max(item.a.y,item.b.y)>0;
    return item.box.right>0&&item.box.left<width&&item.box.bottom>0&&item.box.top<height;
  };
  function budgetLabels(){
    const item=inspections.find(item=>item.key===(focused??hovered));
    budget=placeLabels(labels,candidates,obstacles,item,labels.clientWidth,labels.clientHeight,keys=>{
      if(keys.length===1)select(keys[0],viewport);
      else choose(keys,viewport);
    });
  }
  function updateTargets(){
    const active=new Set(inspections.filter(inStage).map(item=>item.key));
    for(const [key,element] of focusTargets)if(!active.has(key)){
      element.remove();focusTargets.delete(key);
      if(focused===key)focused=null;
      if(hovered===key)hovered=null;
    }
    for(const item of inspections){
      if(!active.has(item.key))continue;
      let element=focusTargets.get(item.key);
      if(!element){
        element=svg('path',{class:'space-inspect',tabindex:0,role:'button','data-inspection':item.key});
        focusTargets.set(item.key,element);targets.append(element);
      }
      element.setAttribute('aria-label',item.text);
      element.setAttribute('aria-description',(item.node?nodeTitle(item.node):transferDirection(item))+
        ' · '+stamp(item.time));
      element.setAttribute('d',item.drawn.getAttribute('d'));
      const transform=item.drawn.getAttribute('transform');
      if(transform)element.setAttribute('transform',transform);
      else element.removeAttribute('transform');
    }
  }
  layer.addEventListener('focusin',event=>{
    focused=event.target.dataset.inspection;
    budgetLabels();
  });
  layer.addEventListener('focusout',()=>{
    focused=null;
    if(layer.style.display!=='none')budgetLabels();
  });
  layer.addEventListener('keydown',event=>{
    if(!['Enter',' '].includes(event.key))return;
    const item=inspections.find(item=>item.key===focused);
    if(!item)return;
    event.preventDefault();
    if(item.relation)select(item.relation,event.target);
    else selectNode(item.node);
  });
  area.addEventListener('pointermove',event=>{
    if(!projection||event.buttons)return;
    const r=layer.getBoundingClientRect(), point={x:event.clientX-r.left,y:event.clientY-r.top};
    let nearest=null,distance=Infinity;
    if(!event.target.closest('.node-position')){
      for(const item of inspections){
        const box=item.box;
        const d=box?(visibleIn({left:point.x,right:point.x,top:point.y,bottom:point.y},box)?
          Math.abs(point.x-(box.left+box.right)/2):Infinity):lineDistance(point,item.a,item.b)+3;
        if(d<distance&&d<=17){nearest=item.key;distance=d;}
      }
    }
    if(nearest!==hovered){hovered=nearest;budgetLabels();}
  });
  area.addEventListener('pointerleave',()=>{
    if(hovered){hovered=null;budgetLabels();}
  });

  function transferDirection(line) {
    return line.from===line.to?nodeTitle(line.from):nodeTitle(line.from)+' → '+nodeTitle(line.to);
  }

  function drawerRows(){
    const data=read();
    if(!scene||!data)return [];
    const {node,relation}=data.selection;
    const pillar=scene.pillars.find(p=>p.id===node);
    const rows=pillar?[...pillar.segments,...pillar.marks].map(item=>({...item,text:recordWords(item,t,duration)})):[];
    for(const line of scene.lines)if(line.key===relation||node&&(line.from===node||line.to===node)){
      const direction=transferDirection(line);
      const text=(line.reverse?t('timeReturned'):t('spaceHandoff'))+' · '+direction+
        (line.duration>0?' · '+waitWords(line,t,duration):'');
      rows.push({...line,text});
    }
    return rows.sort((a,b)=>a.start-b.start||a.end-b.end).map(row=>({...row,text:stamp(row.start)+' · '+row.text}));
  }

  function controlsState(){
    controls.hidden=isPhone();
    controls.setAttribute('aria-label',t('spaceViews'));
    const available=canOrbit();
    for(const [id,button] of buttons){
      button.textContent=t({flat:'graph',space:'spaceView',side:'spaceSide'}[id]);
      button.disabled=id==='space'&&!available;
      button.title=button.disabled?t('spaceWebGL'):'';
      button.setAttribute('aria-pressed',String(target===id));
    }
  }

  function updateTransfers(cut) {
    const version=JSON.stringify(cut.index.version);
    if(attemptedVersion===version)return;
    attemptedVersion=version;
    const token=++request;
    load().then(next=>{
      if(token!==request)return;
      transfers=next.transfers;waitEnds=next.wait_ends;resets=next.resets;
      cutVersion=version;
      refresh();
    }).catch(()=>{if(token===request)attemptedVersion=null;});
  }

  function refresh(){
    const data=read();
    controlsState();
    if(!data?.cut||!data.layout.cards.length||!pose[0]||isPhone()){
      projection=scene=null;hits=[];defaultPlane();apply(null);return;
    }
    const {cut,layout,box,focus,sideScroll,tags}=data;
    updateTransfers(cut);
    projection=spaceProjection(layout,box,pose,cut.axis,cut.at,sideScroll);
    scene=spaceHistory(layout,cut,transfers,waitEnds,resets);
    const result=ink(projection,scene,cut,focus,{svg,t,duration,stamp,tags,width:box.width});
    ({hits,labels:candidates,inspections}=result);
    layer.style.display=labels.style.display='';
    for(const element of [layer,labels])Object.assign(element.style,{opacity:result.opacity,
      width:box.width+'px',height:box.height+'px',left:viewport.clientLeft+'px',top:viewport.clientTop+'px'});
    drawing.replaceChildren(...result.paths);
    obstacles=apply({projection,pose,cut,box});
    updateTargets();
    budgetLabels();
    notes(drawerRows());
  }

  function schedule(){
    if(!raf&&transition&&!deterministic())raf=requestAnimationFrame(time=>{raf=0;tick(time);schedule();});
  }

  function tick(now) {
    if(!transition)return;
    const {from,to,started,duration}=transition;
    pose=transitionPose(from,to,now-started,duration);
    if(pose===to)transition=null;
    refresh();
  }

  function view(next) {
    if(isPhone())next='flat';
    if(next==='space'&&!canOrbit())next='side';
    if(next===target&&!transition&&pose.every((v,i)=>v===VIEW_POSES[next][i]))return;
    tick(clock());
    target=next;
    const to=VIEW_POSES[target];
    if(!canAnimate()||!canOrbit()){
      pose=to;transition=null;refresh();
    } else {
      transition={from:pose,to,started:clock(),duration:650+250*Math.max(Math.abs(to[0]-pose[0]),Math.abs(to[1]-pose[1]))};
      refresh();schedule();
    }
  }

  function startDrag(event,fit){
    if(!canOrbit()||!canAnimate()||isPhone()||event.pointerType==='touch'||
       !(fit||pose[0]||event.altKey)||pose[1]>.7)return false;
    drag={x:event.clientX,y:event.clientY,initial:pose,moved:false};
    return true;
  }

  function moveDrag(event){
    if(!drag)return;
    const dx=event.clientX-drag.x,dy=event.clientY-drag.y;
    if(!drag.moved&&Math.hypot(dx,dy)<5)return;
    transition=null;drag.moved=true;
    pose=[clamp(drag.initial[0]+dy/240),0,clamp(drag.initial[2]+dx/420,-.58,.58)];
    target=pose[0]<.5?'flat':'space';
    refresh();
  }

  function releaseDrag(){
    const moved=drag?.moved;drag=null;
    return !!moved;
  }

  function key(event) {
    if(isPhone())return false;
    const modes=Object.keys(VIEW_POSES);
    const id=modes[Number(event.key)-1];
    if(id){view(id);return true;}
    if(!event.shiftKey||!event.key.startsWith('Arrow')||!canOrbit())return false;
    if(!canAnimate()){view(event.key==='ArrowUp'?'flat':'space');return true;}
    tick(clock());transition=null;
    const [tilt,,yaw]=pose;
    const vertical={ArrowUp:-.12,ArrowDown:.12}[event.key]||0;
    const horizontal={ArrowLeft:-.09,ArrowRight:.09}[event.key]||0;
    pose=[clamp(tilt+vertical),0,clamp(yaw+horizontal,-.58,.58)];
    target=pose[0]<.5?'flat':'space';refresh();return true;
  }

  function pick(point,origin) {
    let nearest=null;
    for(const {key,a,b} of hits){
      const distance=lineDistance(point,a,b);
      if(distance<=12&&(!nearest||distance<nearest.distance))nearest={key,distance};
    }
    if(nearest&&projection?.plane.opacity!==1&&projection?.lanes>=.68){select(nearest.key,origin);return true;}
    const data=read();
    const members=new Set();
    let shortest=Infinity;
    if(projection?.plane.opacity>.2){
      for(const stroke of data.layout.strokes){
        const points=stroke.points.map(({x,y})=>projection.timePoint(x,y,data.cut.at));
        for(let i=1;i<points.length;i++){
          const a=points[i-1],b=points[i],dx=b.x-a.x,dy=b.y-a.y;
          const along=clamp(((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy||1));
          const distance=Math.hypot(point.x-a.x-dx*along,point.y-a.y-dy*along);
          if(distance>12||distance>shortest+.45)continue;
          if(distance<shortest-.45)members.clear();
          shortest=Math.min(shortest,distance);
          for(const member of stroke.members)members.add(member);
        }
      }
    }
    if(nearest&&nearest.distance<shortest){select(nearest.key,origin);return true;}
    const keys=data?.layout.edges.filter(edge=>members.has(edge.id)).map(edge=>edge.key)||[];
    if(keys.length===1)select(keys[0],origin);
    if(keys.length>1)choose(keys,origin);
    return keys.length>0;
  }

  function effects(frame) {
    const marks=[];
    if(projection?.lanes>.5){
      for(const event of frame){
        if(event.kind!=='handoff'&&event.kind!=='reverse')continue;
        const line=scene.lines.find(line=>line.key===event.id&&line.seq===event.record);
        if(!line)continue;
        const a=projection.nodeAt(line.from,line.start), b=projection.nodeAt(line.to,line.end);
        const p=ease(event.progress), end={x:mix(a.x,b.x,p),y:mix(a.y,b.y,p)};
        if(!line.reverse)marks.push(svg('path',{d:pathOf([a,end]),class:'space-transfer effect'}));
        marks.push(svg('circle',{cx:end.x,cy:end.y,r:5,class:'space-endpoint effect','data-reverse':line.reverse}));
      }
    }
    motion.replaceChildren(...marks);
  }

  return {refresh,tick,startDrag,moveDrag,releaseDrag,key,pick,view,effects,
    backendChanged(){if(!canOrbit()&&target==='space')view('side');else if(!canAnimate()&&transition){pose=transition.to;transition=null;refresh();}else refresh();},
    reset(){request++;cutVersion=attemptedVersion=null;transfers=[];waitEnds={};resets={};pose=VIEW_POSES.flat;target='flat';transition=null;refresh();},
    describe:()=>({pose:[...pose],target,animating:!!transition,scene,plane:projection?.plane,sideWidth:projection?.sideWidth,
      lanes:projection?[...projection.cards].map(([id,{lane}])=>({id,lane,point:projection.nodeAt(id,read().cut.at),
        floor:projection.nodeAt(id,read().cut.axis.start)})):[],
      transferVersion:cutVersion,budget,laneWidth:projection?.laneWidth,
      workDepth:projection?11*mix(.55,0,projection.lanes)/projection.zoom:0}),
  };
}
