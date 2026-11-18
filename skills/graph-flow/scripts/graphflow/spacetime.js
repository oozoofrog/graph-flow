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
  const cx=mix(box.x+xCenter*box.scale,box.width/2,lean)-sideScroll*lanes;
  const cy=mix(box.y+yCenter*box.scale,box.height/2+3,lean);
  const timeZ=time=>axis.toScale(time)/Math.max(1,axis.total)*timeHeight;
  const timeCenter=timeHeight/2;
  function project(x,y,z) {
    const dx=x-xCenter, dy=y-yCenter;
    return {x:cx+zoom*(cosine*dx-sine*dy),
      y:cy+zoom*(pitchY*(sine*dx+cosine*dy)-pitchTime*(z-timeCenter)*lean)};
  }
  const cards=new Map(order.map((card,i)=>{
    const laneX=xCenter+(42+(i+.5)*laneWidth-box.width/2)/sideScale;
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

const segmentKinds={tool:'tool',skill:'skill',mcp:'mcp',session:'session',gf:'gf',other:'other'};
const terminalVerdicts=new Set(['pass','reject','replan','unverified']);

export function spaceHistory(layout,{at,index,axis},transfers,waitEnds={}) {
  const pillars=new Map(layout.cards.map(card=>[card.id,{id:card.id,attempts:[],segments:[],starts:[],calls:new Map()}]));
  const asks=new Map(), edgeKeys=new Set(layout.edges.map(edge=>edge.key));
  const min=index.start, max=at;
  const add=(pillar,kind,from,to,seq=null)=>{
    if(!Number.isFinite(from)||!Number.isFinite(to)||from>max||to<min||from>to)return;
    const start=clamp(from,min,max), end=clamp(to,min,max);
    pillar.segments.push({kind,start,end,seq,low:axis.toScale(start),high:axis.toScale(end)});
  };
  for(const row of index.records) {
    if(row.at>at)break;
    const pillar=pillars.get(row.node), time=row.time??row.at, kind=row.kind;
    if(kind==='decision.answer'||kind==='decision.superseded'){
      const ask=asks.get(row.id);
      if(ask && ask.end==null)ask.end=Math.max(ask.start,time);
    }
    if(!pillar)continue;
    const active=pillar.attempts.at(-1);
    if(kind==='node.start'){
      if(active && active.end==null)active.end=Math.max(active.start,time);
      pillar.attempts.push({start:time,seq:row.seq,number:row.attempt});
      pillar.starts.push({time,seq:row.seq});
    } else if(kind==='node.reopen' && active && active.end==null) {
      active.end=Math.max(active.start,time);
    } else if(kind==='node.submit'||kind==='review.submit'){
      if(active)active.end=active.submit=Math.max(active.start,time);
      add(pillar,'submit',time,time,row.seq);
    } else if(kind==='gate.verdict'){
      if(active && terminalVerdicts.has(row.verdict)){
        active.verdict=Math.max(active.submit??active.start,time);
        active.end ??= active.verdict;
      }
      add(pillar,['reject','replan'].includes(row.verdict)?'return':'verdict',time,time,row.seq);
    } else if(kind==='decision.ask'){
      asks.set(row.id??'d'+row.seq,{pillar,start:time,seq:row.seq});
    } else if(kind==='decision.answer'||kind==='decision.superseded'){
      add(pillar,'verdict',time,time,row.seq);
    } else if(kind==='check.result'||kind==='check.red'){
      const start=time-(Number.isFinite(row.duration_ms)?row.duration_ms:0);
      add(pillar,'check',Math.max(active?.start??min,start),time,row.seq);
      if(!active && !pillar.starts.length)pillar.starts.push({time:Math.max(min,start),seq:row.seq});
    } else if(kind==='gate.final'){
      add(pillar,'verdict',time,time,row.seq);
    } else if(row.activity!=null) {
      const call=pillar.calls.get(row.call)??{category:segmentKinds[row.category]||'other',number:row.attempt};
      call[row.phase]=time;
      pillar.calls.set(row.call,call);
    }
  }
  for(const [id,ask] of asks){
    ask.end ??= waitEnds[id];
    add(ask.pillar,'human',ask.start,ask.end??at,ask.seq);
    ask.pillar.starts.push({time:ask.start,seq:ask.seq});
  }
  for(const pillar of pillars.values()){
    for(const attempt of pillar.attempts){
      const next=pillar.attempts.find(other=>other.seq>attempt.seq);
      const workEnd=attempt.end??at;
      add(pillar,'start',attempt.start,attempt.start,attempt.seq);
      if(attempt.submit!=null)add(pillar,'verify',attempt.submit,attempt.verdict??next?.start??at);
      const calls=[...pillar.calls.values()].filter(call=>{
        const anchor=call.start??call.end;
        return anchor>=attempt.start && (!next || anchor<next.start) && call.number===attempt.number;
      }).sort((a,b)=>(a.start??a.end)-(b.start??b.end));
      let covered=null, open=false;
      for(const call of calls){
        if(covered!=null && !open && call.start-covered>=1000)add(pillar,'thinking',covered,call.start);
        if(call.start==null)add(pillar,call.category,call.end,call.end);
        else add(pillar,call.category,call.start,call.end??workEnd);
        if(call.end==null)open=true;
        else covered=Math.max(covered??call.end,call.end);
      }
      if(!calls.length && workEnd>=attempt.start)add(pillar,'unobserved',attempt.start,workEnd);
    }
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
    if(!a.segments.some(segment=>segment.end===start))add(a,transfer.reverse?'return':'handoff',start,start,transfer.seq);
    if(receiver && !b.segments.some(segment=>segment.start===end))add(b,'start',end,end,receiver.seq);
    lines.push({key,from,to,start,end,low:axis.toScale(start),high:axis.toScale(end),receiver:receiver?.time??null,
      reverse:transfer.reverse,seq:transfer.seq});
  }

  for(const pillar of pillars.values()){
    pillar.top=pillar.segments.reduce((top,segment)=>Math.max(top??segment.end,segment.end),null);
    pillar.drop=pillar.top!=null&&pillar.top<at?{start:pillar.top,end:at}:null;
    delete pillar.calls;
  }
  return {pillars:[...pillars.values()],lines};
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
  thinking:'activityThinking',tool:'activityNameTool',skill:'activityNameSkill',mcp:'activityNameMcp',
  session:'activityNameSession',gf:'cardChecks',other:'activityNameOther',
};

function ink(projection, scene, cut, focus, tools) {
  const {svg,t,duration,stamp,width,height}=tools;
  const {frame,timePoint,nodeAt,lanes,lean,cards}=projection;
  const {at,axis}=cut;
  const layers={grid:[],frame:[],body:[],links:[]}, labels=[];
  const path=(layer,knots,kind,attributes={},closed=false)=>{
    const item=svg('path',{class:kind,d:pathOf(knots,closed),...attributes});
    layers[layer].push(item);return item;
  };
  const dot=(layer,point,kind,attributes={})=>{
    layers[layer].push(svg('circle',{class:kind,cx:point.x,cy:point.y,r:3,...attributes}));
  };
  const label=(point,text,kind,options={})=>labels.push({point,text,kind,...options});
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
    label({x:Math.max(52,points[3].x-6),y:points[3].y},duration(time-axis.start),'axis',{align:'right',time});
    label({x:Math.min(width-6,points[1].x+6),y:points[1].y},duration(time-axis.start),'axis',
      {time,align:points[1].x>width-80?'right':'left'});
  }
  for(const gap of axis.gaps){
    if(gap.end>at)break;
    for(const time of [gap.start,gap.end])path('frame',projectFrame(time),'space-break',{'data-time':time},true);
    const p=timePoint(frame[1][0],frame[1][1],(gap.start+gap.end)/2);
    label({x:Math.min(width-5,p.x+6),y:p.y},t('timeBreak',{duration:duration(gap.duration)}),'break',
      {align:p.x>width-190?'right':'left'});
  }
  for(const [x,y] of frame)
    path('frame',[timePoint(x,y,axis.start),timePoint(x,y,at)],'space-corner');
  const now=projectFrame(at);
  path('frame',now,'space-plane',{'data-time':at},true);
  label({x:Math.max(now[1].x,now[2].x)-4,y:Math.min(now[1].y,now[2].y)-19},
    (cut.past?t('spaceViewed'):t('timeLive'))+' · '+stamp(at),'now',{align:'right',time:at});

  for(const pillar of scene.pillars){
    if(pillar.top==null)continue;
    const {id}=pillar, end=nodeAt(id,pillar.top), start=nodeAt(id,axis.start);
    const dim=focus.active&&!focus.cards.has(id), emphasis=dim?'context':'path';
    const picked=focus.active&&!dim;
    const attrs={'data-node':id,'data-emphasis':emphasis};
    path('body',[start,end],'space-pole',attrs);
    if(pillar.drop)path('body',[end,nodeAt(id,at)],'space-drop',{'data-start':pillar.top,'data-end':at,...attrs});
    const center=cards.get(id);
    const ordered=[...pillar.segments].sort((a,b)=>a.start-b.start||b.end-a.end);
    let overlap=[];
    for(const segment of ordered){
      const a=nodeAt(id,segment.start), b=nodeAt(id,segment.end);
      const span=segment.end-segment.start, key=segmentLabels[segment.kind];
      const title=t(key)+' · '+duration(span);
      const lineAttrs={...attrs,'data-kind':segment.kind,'data-start':segment.start,'data-end':segment.end};
      overlap=overlap.filter(end=>end>segment.start);
      const offset=(overlap.length%3)*8;
      if(span)overlap.push(segment.end);
      const atOffset=p=>({x:p.x+offset,y:p.y});
      const hollow=['thinking','unobserved','verify','human'].includes(segment.kind);
      if(!span) {
        path('body',[{x:a.x-5,y:a.y},{x:a.x+5,y:a.y}],'space-tick',lineAttrs);
      } else {
        const radius=mix(segment.kind==='unobserved'?2:12,segment.kind==='unobserved'?2:11,lanes);
        const halfDepth=radius*mix(.55,0,lanes);
        const extent=radius/projection.zoom;
        const face=(x,y)=>[timePoint(x,y,segment.start),timePoint(x,y,segment.end)].map(atOffset);
        const [frontA,frontB]=face(center.x-extent,center.y+halfDepth/projection.zoom);
        const [rightA,rightB]=face(center.x+extent,center.y+halfDepth/projection.zoom);
        const [backA,backB]=face(center.x+extent,center.y-halfDepth/projection.zoom);
        if(lanes<.999)path('body',[rightA,rightB,backB,backA],'space-segment space-face',lineAttrs,true);
        const facePath=path('body',[frontA,frontB,rightB,rightA],'space-segment'+(hollow?' hollow':''),lineAttrs,true);
        facePath.append(svg('title'));facePath.lastChild.textContent=title;
      }
      if (lanes>.68||picked||span>=480_000||segment.kind==='human'&&span>=60_000){
        const mid={x:(a.x+b.x)/2+15+offset,y:(a.y+b.y)/2};
        label(mid,title,'interval',{id,segment,dim,leader:{x:mid.x-5,y:mid.y}});
      }
    }
  }

  const hits=[];
  for(const line of scene.lines){
    const a=nodeAt(line.from,line.start), b=nodeAt(line.to,line.end);
    const dim=focus.active&&!focus.relations.has(line.key);
    const attrs={'data-relation':line.key,'data-seq':line.seq,'data-start':line.start,'data-end':line.end,
      'data-reverse':String(line.reverse),'data-emphasis':dim?'context':focus.active?'selected':'normal'};
    path('links',[a,b],'space-transfer',attrs);
    dot('links',a,'space-endpoint',attrs);
    dot('links',b,'space-endpoint',attrs);
    hits.push({key:line.key,a,b});
    if(line.end-line.start>=60_000)label({x:(a.x+b.x)/2,y:(a.y+b.y)/2-10},
      t('spaceTransferWait',{duration:duration(line.end-line.start)}),'transfer',{dim,align:'center'});
  }

  if(lanes>.68){
    const byLane=new Map();
    for(const item of labels.filter(label=>label.kind==='interval')){
      if(!byLane.has(item.id))byLane.set(item.id,[]);
      byLane.get(item.id).push(item);
    }
    for(const group of byLane.values()){
      group.sort((a,b)=>a.point.y-b.point.y);
      const spacing=Math.min(15,Math.max(2,(height-28)/group.length));
      const min=15,max=height-12;
      let y=min-spacing;
      for(const item of group)y=item.point.y=Math.max(y+spacing,item.point.y);
      y=max+spacing;
      for(const item of group.slice().reverse()){
        y=item.point.y=Math.min(y-spacing,item.point.y);
        if(Math.abs(item.point.y-item.leader.y)>3)
          path('body',[item.leader,item.point],'space-leader',{'data-emphasis':item.dim?'context':'path'});
      }
    }
  }
  const labelElements=labels.flatMap(item=>{
    const {point,kind,align,text,id,segment,dim,time}=item;
    if(point.x<-150||point.x>width+150||point.y<-10||point.y>height+10)return [];
    const element=document.createElement('span');
    element.className='space-label space-label-'+kind;
    element.dataset.align=align||'left';
    if(id)element.dataset.node=id;
    if(segment)Object.assign(element.dataset,{kind:segment.kind,start:segment.start,end:segment.end});
    if(time!=null)element.dataset.time=time;
    if(dim)element.dataset.emphasis='context';
    element.style.left=clamp(point.x,4,width-4)+'px';
    element.style.top=point.y+'px';
    element.textContent=text;
    return [element];
  });
  return {paths:[...layers.grid,...layers.frame,...layers.body,...layers.links],labels:labelElements,hits,opacity:ease((lean-.03)/.55)};
}

export function createSpaceView({area,viewport,toolbar,svg,t,duration,stamp,read,apply,load,clock,deterministic,
  canAnimate,canOrbit,isPhone,select,choose}) {
  const controls=document.createElement('div');controls.className='space-views';
  controls.setAttribute('role','group');toolbar.append(controls);
  const buttons=new Map(Object.keys(VIEW_POSES).map((key,i)=>{
    const button=document.createElement('button');
    button.type='button';button.dataset.view=key;button.setAttribute('aria-keyshortcuts',String(i+1));
    button.addEventListener('click',()=>view(key));
    controls.append(button);return [key,button];
  }));
  const layer=svg('svg',{class:'space-ink','aria-hidden':'true'});
  const labels=document.createElement('div');labels.className='space-labels';
  const motion=svg('g',{class:'space-effects'});
  area.prepend(layer);area.append(labels);
  let target='flat', pose=VIEW_POSES.flat, transition=null, raf=0, drag=null, projection, scene, hits=[], cutVersion;
  let transfers=[], waitEnds={}, request=0, attemptedVersion;
  const defaultPlane=()=>{layer.style.display=labels.style.display='none';layer.replaceChildren();labels.replaceChildren();};
  defaultPlane();

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
      transfers=next.transfers;waitEnds=next.wait_ends;
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
    const {cut,layout,box,focus,sideScroll}=data;
    updateTransfers(cut);
    projection=spaceProjection(layout,box,pose,cut.axis,cut.at,sideScroll);
    scene=spaceHistory(layout,cut,transfers,waitEnds);
    const result=ink(projection,scene,cut,focus,{svg,t,duration,stamp,width:box.width,height:box.height});
    hits=result.hits;
    layer.style.display=labels.style.display='';
    for(const element of [layer,labels])Object.assign(element.style,{opacity:result.opacity,
      width:box.width+'px',height:box.height+'px',left:viewport.clientLeft+'px',top:viewport.clientTop+'px'});
    layer.replaceChildren(...result.paths,motion);labels.replaceChildren(...result.labels);
    apply({projection,pose,cut,box});
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
      const dx=b.x-a.x,dy=b.y-a.y;
      const along=clamp(((point.x-a.x)*dx+(point.y-a.y)*dy)/(dx*dx+dy*dy||1));
      const distance=Math.hypot(point.x-a.x-dx*along,point.y-a.y-dy*along);
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
    reset(){request++;cutVersion=attemptedVersion=null;transfers=[];waitEnds={};pose=VIEW_POSES.flat;target='flat';transition=null;refresh();},
    describe:()=>({pose:[...pose],target,animating:!!transition,scene,plane:projection?.plane,sideWidth:projection?.sideWidth,
      lanes:projection?[...projection.cards].map(([id,{lane}])=>({id,lane,point:projection.nodeAt(id,read().cut.at)})):[],
      transferVersion:cutVersion}),
  };
}
