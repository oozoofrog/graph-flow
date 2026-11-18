#!/usr/bin/env node
// CDP transport and Chrome discovery follow tests/review14_browser.mjs and its wrapper.
import assert from 'node:assert/strict';
import {spawn, spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {existsSync, mkdirSync, mkdtempSync, readFileSync, writeFileSync, copyFileSync, readdirSync, unlinkSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {routeMetrics,exceedsRatchet} from '../../skills/graph-flow/tests/fixtures/routing_metrics.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const skill = path.resolve(here, '../../skills/graph-flow');
const output = path.resolve(process.argv[2] || '');
assert(process.argv[2] && !/^\/(private\/)?tmp\//.test(output), 'supply a durable output directory');
const only = process.argv[3] ? new Set(process.argv[3].split(',').map(Number)) : null;
const forceSVG = process.env.SCREENS_RENDERER === 'svg';
const manifest = JSON.parse(readFileSync(path.join(here, 'screens.json')));
const ratchets = JSON.parse(readFileSync(path.join(skill,'tests/fixtures/routing_ratchets.json'))).screens;
const fixtures = JSON.parse(readFileSync(path.join(output, 'fixtures/index.json')));
const which = name => (process.env.PATH || '').split(path.delimiter).map(p => path.join(p, name)).find(p => existsSync(p));
const chromePath = which('chromium') || which('google-chrome') || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
assert(existsSync(chromePath), 'headless Chrome is required; see test_review14_browser.py');
const ffmpeg = which('ffmpeg');
assert(ffmpeg, 'ffmpeg is required for verification images');
const python = process.env.SCREENS_PYTHON || which('python3');
const final = path.join(output, 'final'), verify = path.join(output, 'verify');
mkdirSync(final, {recursive:true}); mkdirSync(verify, {recursive:true});
const runtime = mkdtempSync(path.join(output, 'capture-'));
const profile = path.join(runtime, 'chrome-profile');
const delay = ms => new Promise(r => setTimeout(r, ms));
const baseEnv = Object.fromEntries(Object.entries(process.env).filter(([key]) => !key.startsWith('GF_')));
const envFor = fixture => ({...baseEnv, GF_HOME:fixture.home, GF_NO_OPEN:'1', GF_ROLE:'leader', GF_SESSION:'screens-r20'});
const evidence = path.join(output, 'screen-status.json');
let records = only && existsSync(evidence) ? JSON.parse(readFileSync(evidence)) : [];
const owned = [], lifecycle = [];
let chrome, ws, sequence = 0;
const pending = new Map(), errors = [], requests = [];
let activeServer;
const persist = () => writeFileSync(evidence, JSON.stringify(records, null, 2) + '\n');
function start(command, args, options={}) {
  const child = spawn(command, args, {...options, stdio:['ignore','pipe','pipe']});
  child.on('error', error => {child.startError = error;});
  owned.push(child);
  lifecycle.push({pid:child.pid, command, args, started:new Date().toISOString()});
  return child;
}
async function stop(child) {
  if (!child || child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise(resolve => child.once('exit', resolve));
  child.kill('SIGTERM');
  await Promise.race([exited, delay(5000)]);
  if (child.exitCode === null && child.signalCode === null) {child.kill('SIGKILL'); await exited;}
}
async function lineMatching(child, stream, expression) {
  return new Promise((resolve, reject) => {
    let buffer = '';
    const timeout = setTimeout(() => finish(Error('startup timeout: ' + buffer)), 15000);
    const onData = chunk => {buffer += chunk; const match = buffer.match(expression); if(match) finish(null, match);};
    const onExit = () => finish(Error('process exited at startup: ' + buffer));
    const onError = error => finish(error);
    function finish(error, result) {
      clearTimeout(timeout); stream.off('data', onData); child.off('exit', onExit); child.off('error', onError);
      error ? reject(error) : resolve(result);
    }
    stream.on('data', onData); child.once('exit', onExit); child.once('error', onError);
  });
}
function send(method, params={}) {
  return new Promise((resolve, reject) => {
    const id = ++sequence;
    const timer = setTimeout(() => {pending.delete(id); reject(Error('CDP timeout: '+method));}, 15000);
    pending.set(id, [value => {clearTimeout(timer); resolve(value);}, error => {clearTimeout(timer); reject(error);}]);
    ws.send(JSON.stringify({id, method, params}));
  });
}
async function evaluate(expression) {
  const result = await send('Runtime.evaluate', {expression, returnByValue:true, awaitPromise:true});
  assert(!result.exceptionDetails, JSON.stringify(result.exceptionDetails));
  return result.result?.value;
}
async function until(expression) {
  for (let i=0;i<100;i++) {if(await evaluate(expression)) return; await delay(100);}
  throw Error('UI did not reach: '+expression);
}
const paint = () => evaluate('new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve(true))))');
function cli(fixture, args, expected=0) {
  const result = spawnSync(python, ['-I','-S','-B',path.join(skill,'scripts/gf'),'--json','--run',path.join(fixture.project,'.graph-flow/runs',fixture.run),...args],
    {env:envFor(fixture), cwd:fixture.project, encoding:'utf8', timeout:20000});
  assert.equal(result.status, expected, result.stdout + result.stderr);
  return JSON.parse(result.stdout);
}
async function interaction(action, fixture) {
  const selector = JSON.stringify(action.selector);
  if (action.action === 'live-plan') {
    cli(fixture, ['plan','set',path.join(path.dirname(fixture.plan),'changed-plan.json')]);
    await evaluate("document.dispatchEvent(new Event('visibilitychange'))");
    await until("!!document.querySelector('.plan-change-list')");
  } else if (action.action === 'change-file') {
    writeFileSync(path.join(fixture.project,'guide.txt'), '질문 이후 안내가 수정되었어요. 새 근거 확인이 필요해요.\n');
    // Click the recorded attachment so the real evidence endpoint detects changed bytes.
    await evaluate("document.querySelector('.file-choices button').click()");
    await until("document.querySelector('#decision').classList.contains('decision-changed')");
  } else if (action.action === 'button') {
    await evaluate(`(()=>{const b=[...document.querySelectorAll('.map-toolbar button')].find(e=>(e.textContent===${JSON.stringify(action.text)}||(${JSON.stringify(action.text)}==='화면에 맞추기'&&e.dataset.action==='fit')));if(!b)throw Error('missing toolbar button');b.click()})()`);
  } else if (action.action === 'lower-rows') {
    const moved=await evaluate("(()=>{const v=document.querySelector('.map-viewport'),before={left:v.scrollLeft,top:v.scrollTop};v.scrollTo(before.left,v.scrollHeight-v.clientHeight);return {before,after:{left:v.scrollLeft,top:v.scrollTop}}})()");
    action.observedScroll=moved;
    assert(moved.after.top>moved.before.top&&moved.after.left===moved.before.left,'lower rows require vertical movement without sideways movement');
  } else if (action.action === 'scroll') {
    await evaluate(action.selector === 'window' ? `window.scrollTo(${action.x},${action.y})` : `document.querySelector(${selector}).scrollTo(${action.x},${action.y})`);
  } else {
    await until(`!!document.querySelector(${selector})`);
    if(action.action === 'click') await evaluate(`document.querySelector(${selector}).click()`);
    else if(action.action === 'open') await evaluate(`document.querySelector(${selector}).open=true`);
    else if(action.action === 'into') await evaluate(`document.querySelector(${selector}).scrollIntoView({block:'start'})`);
    else throw Error('unknown action '+action.action);
  }
  await delay(350);
  if(action.selector === '.key-recovery button')await until("!document.querySelector('.key-recovery') && !!document.querySelector('.plan-actions')");
  if(action.selector === '.file-choices button') await until("!!document.querySelector('.file-choices button[data-opened=true]')");
}
const sorted = list => list.map(entry=>JSON.stringify(entry)).sort();
const relationNames = {
  ko:{hands_over:'넘겨줌',waits_for_decision:'결정을 기다림',reviews:'검토 담당'},
  en:{hands_over:'hands over',waits_for_decision:'waits for a decision',reviews:'reviewed by'},
};
const gateNames = {
  ko:{open:'전달 완료',closed:'전달 전',waiting_for_you:'답변 대기',returned:'반려됨'},
  en:{open:'Delivered',closed:'Pending',waiting_for_you:'Awaiting answer',returned:'Returned'},
};
const dashPatterns = {open:'none',closed:'12px, 6px',waiting_for_you:'3px, 6px',returned:'12px, 5px, 2px, 5px'};
const markerShapes = {hands_over:/Z$/,waits_for_decision:/^M[^MZ]+$/,reviews:/^M[^MZ]+ M[^MZ]+$/};
const kindShapes = {work:/^M5 4H19V20H5Z/,review:/^M10 3A/,decision:/^M12 3L22/,goal:/^M5 21V3/};

function graphRecords(fixture) {
  const dir=path.join(fixture.project,'.graph-flow/runs',fixture.run);
  const events=readFileSync(path.join(dir,'events.jsonl'),'utf8').trim().split('\n').map(line=>JSON.parse(line));
  const state=cli(fixture,['status']).state;
  const revision=events.findLast(e=>e.type==='plan.set')?.data.revision;
  const nodes=(!revision||state.run.plan_error)?[]:JSON.parse(readFileSync(path.join(dir,'plans',String(revision).padStart(4,'0')+'.json'))).nodes;
  const byId=Object.fromEntries(nodes.map(node=>[node.id,node]));
  const gate=id=>{
    const node=state.nodes[id];
    if(node.status==='passed')return 'open';
    if(node.open_decisions.length)return 'waiting_for_you';
    if(node.status==='rejected'||node.status==='replan')return 'returned';
    return 'closed';
  };
  const edges=nodes.flatMap(node=>[
    ...(node.needs||[]).map(need=>[need.from,node.id,byId[need.from].kind==='decision'?'waits_for_decision':'hands_over',gate(need.from),need.label||need.artifact||'']),
    ...(node.kind==='review'?[[node.target,node.id,'reviews',gate(node.id),'']]:[]),
  ]);
  const sources=new Set(edges.map(([from])=>from));
  for(const {id} of nodes)if(!sources.has(id))edges.push([id,'_run_checks','hands_over',state.nodes[id].status==='passed'?'open':'closed','']);
  const cards=nodes.map(({id,kind})=>[id,kind]);
  if(cards.length)cards.push(['_run_checks','goal']);
  return {cards,edges,events,nodes,state:state.nodes};
}

// These observations come from DOM elements, including their actual SVG shape and style.
function graphDOM() {
  const map=document.querySelector('#map');
  const panel=document.querySelector('#panel');
  const identify=e=>[e.dataset.from,e.dataset.to,e.dataset.relation,e.dataset.gate,e.dataset.label];
  const relations=selector=>Array.from(document.querySelectorAll(selector),e=>({key:identify(e),text:e.textContent}));
  const cards=selector=>Array.from(document.querySelectorAll(selector),e=>{
    const cue=e.querySelector('.type-icon'),glyph=e.querySelector('.status-glyph');
    const r=cue?.getBoundingClientRect();
    const shape=cue?.firstElementChild, bounds=shape?.getBBox(), matrix=shape?.getScreenCTM();
    const actualSize=bounds&&matrix?Math.min((bounds.width+1.6)*matrix.a,(bounds.height+1.6)*matrix.d):0;
    const shown=selector=>!!e.querySelector(selector)?.getClientRects().length;
    return {id:e.dataset.node,kind:cue?.dataset.kind,shape:cue?.firstElementChild?.getAttribute('d'),
      state:e.dataset.state,glyph:glyph?.textContent,visible:getComputedStyle(e).visibility==='visible'&&e.getClientRects().length>0,
      path:e.parentElement.classList.contains('graph-path'),context:e.parentElement.classList.contains('graph-context'),
      cueVisible:r?.width>0&&r?.height>0&&getComputedStyle(cue).visibility==='visible'&&Number(getComputedStyle(cue).opacity)>0,
      actualSize, title:shown('.node-title'), glyphShown:shown('.status-glyph'), full:shown('.node-essentials'),
      lane:e.querySelector('.lane-cue')?.childElementCount??null,laneShown:shown('.lane-cue'),
      attempts:Number(e.querySelector('.attempt-caption')?.dataset.attempts||0),
      footer:e.querySelector('.node-footer')?.textContent,
      reference:[...e.querySelectorAll('.node-reference > :not(.attempt-caption)')].map(item=>item.textContent).join(''),
      status:e.querySelector('.node-status')?.textContent};
  });
  const scene=map.graphScene;
  const lines=Array.from(map.querySelectorAll('.edge-marker[data-edge-id]'),branch=>{
    const edge=scene.edges.find(edge=>edge.id===branch.dataset.edgeId);
    const strokes=scene.strokes.filter(part=>part.members.includes(edge.id)).map(part=>{
      const path=map.querySelector(`[data-stroke-id="${part.id}"]`);
      return getComputedStyle(path).strokeDasharray;
    });
    const markers=scene.markers.filter(mark=>mark.members.includes(edge.id)).map(mark=>{
      const path=map.querySelector(`[data-marker-id="${mark.id}"]`);
      const marker=document.querySelector(path.getAttribute('marker-end').slice(4,-1));
      return {shape:marker?.firstElementChild?.getAttribute('d'),direction:marker?.getAttribute('orient')};
    });
    return {key:identify(branch),strokes,markers,
      ends:[edge.points[0],edge.points.at(-1)].map(({x,y})=>[x,y])};
  });
  const count=map.querySelector('.map-visible');
  return {scene,lod:map.dataset.lod,diagram:cards('#map .node-card'),phone:cards('#phone-flow .node-card'),
    ids:Array.from(document.querySelectorAll('#node-list > [data-node]'),e=>e.dataset.node),lines,
    phoneRelations:relations('#phone-flow .phone-handoff'),accessible:relations('#edge-list [data-relation]'),
    incoming:relations('#panel [data-relations="from"] [data-relation]'),outgoing:relations('#panel [data-relations="to"] [data-relation]'),
    selected:panel.hidden?null:panel.dataset.node,counts:{...count.dataset,text:count.textContent}};
}

function assertGraphRecords(name, language, expected, observed, visibleTitles) {
  const tuple=edge=>[edge.from,edge.to,edge.relation,edge.gate,edge.label];
  const {scene}=observed;
  assert(scene,name+' P4 expected a scene model');
  assert.deepEqual(sorted(scene.cards.map(c=>[c.id,c.kind])),sorted(expected.cards),name+' P4 scene card identities');
  assert.deepEqual(sorted(scene.edges.map(tuple)),sorted(expected.edges),name+' P4 scene relations');
  for(const [surface,items] of [['diagram',observed.diagram],['phone',observed.phone]]){
    assert.deepEqual(sorted(items.map(c=>c.id)),sorted(expected.cards.map(([id])=>id)),name+' M3 '+surface+' card ids');
    for(const item of items){
      const kind=expected.cards.find(([id])=>id===item.id)[1];
      const context=name+' P1 '+surface+' '+item.id;
      const lane=expected.state[item.id]?.effective_lane??expected.nodes.find(node=>node.id===item.id)?.lane??null;
      assert.equal(item.lane,lane,name+' R9 '+surface+' '+item.id+' lane inventory');
      assert.equal(item.kind,kind,context+' plan kind');
      assert.match(item.shape||'',kindShapes[kind],context+' expected '+kind+' path, observed '+item.shape);
      if(item.visible){
        assert(item.cueVisible&&item.actualSize>=15.99,context+' expected ≥ 16 CSS px painted kind cue, observed '+item.actualSize);
        const level=surface==='phone'?'near':observed.lod;
        assert(item.glyphShown&&item.title===(level!=='far')&&item.full===(level==='near'),
          context+' R6 '+level+' cues '+JSON.stringify(item));
        assert.equal(item.laneShown,level!=='far'&&lane!==null,name+' R9 '+surface+' '+item.id+' lane visibility');
        if(level==='near')assert.equal(item.attempts,expected.state[item.id]?.attempts??0,name+' P3 planar attempt count '+item.id);
      }
      assert.equal(item.glyph==='◆',item.state==='awaiting',context+' Psi4 glyph '+item.glyph+' for '+item.state);
    }
  }
  assert.deepEqual(sorted(observed.ids),sorted(expected.cards.map(([id])=>id)),name+' M3 accessible card ids');
  const compare=(surface,actual,keys=expected.edges)=>{
    assert.deepEqual(sorted(actual.map(e=>e.key)),sorted(keys),name+' P2 '+surface+' relation multiset');
    if(surface==='SVG')return;
    for(const {key,text} of actual){
      const [from,to,relation,gate,label]=key;
      const expectedName=relationNames[language][relation], expectedGate=gateNames[language][gate];
      assert(text.includes(expectedName)&&text.includes(expectedGate),name+' P2 '+surface+' '+from+' → '+to+' expected '+expectedName+' / '+expectedGate+', observed '+text);
      if(label&&!/[\/\\]|\.[a-z0-9]{1,8}$/.test(label)&&!expected.cards.some(([id])=>id===label)&&!['findings','approval'].includes(label)){
        assert(text.includes(label),name+' P2 '+surface+' '+from+' → '+to+' expected label '+label+', observed '+text);
      }
    }
  };
  compare('SVG',observed.lines);
  compare('accessible list',observed.accessible);
  compare('phone list',observed.phoneRelations);
  if(observed.selected){
    compare('incoming panel',observed.incoming,expected.edges.filter(([,to])=>to===observed.selected));
    compare('outgoing panel',observed.outgoing,expected.edges.filter(([from])=>from===observed.selected));
  }
  for(const {key,strokes,markers,ends} of observed.lines){
    const [from,to,relation,gate]=key;
    const context=name+' P2 SVG '+from+' → '+to+' '+relation;
    assert(strokes.length&&strokes.every(dash=>dash===dashPatterns[gate]),context+' gate pattern on every route portion');
    assert(markers.length,context+' branch marker');
    for(const {direction,shape} of markers){
      assert.equal(direction,'auto',context+' marker follows the routed direction');
      assert.match(shape||'',markerShapes[relation],context+' expected marker for '+relation+', observed '+shape);
    }
    const a=scene.positions[from],b=scene.positions[to];
    assert(Math.abs(ends[0][0]-a.x-a.width)<.02&&Math.abs(ends[1][0]-b.x)<.02,context+' expected right port → left port, observed '+JSON.stringify(ends));
  }
  const goals=expected.cards.filter(([,kind])=>kind==='goal').length, plan=expected.cards.length-goals;
  const {counts}=observed;
  assert.equal(Number(counts.plan),plan,name+' M3 toolbar plan count');
  assert.equal(Number(counts.wholeResult),goals,name+' M3 toolbar whole-result count');
  if(visibleTitles!==undefined){
    const far=observed.lod==='far';
    const phrase=language==='ko'?`계획 카드 ${plan}개${goals?' + 전체 결과 확인 1개':''} · ${far?`카드 ${visibleTitles}개가 보여요`:`${visibleTitles}개 제목이 보여요`}`:
      `${plan} plan cards${goals?' + 1 whole-result card':''} · ${visibleTitles} ${far?'cards':'titles'} visible`;
    assert.equal(counts.text,phrase,name+' M3 visible toolbar count');
  }
  assert.deepEqual(observed.diagram.map(c=>c.id),scene.cards.map(c=>c.id),name+' M1 card DOM order');
  for(const edge of scene.edges){
    const a=scene.positions[edge.from],b=scene.positions[edge.to];
    assert(a.layer<b.layer,name+' M1 '+edge.from+' → '+edge.to+' expected increasing layer, observed '+a.layer+' → '+b.layer);
  }
  return routeMetrics(scene);
}

function assertRendererParity(name, scene, drawing) {
  const {box}=drawing;
  const close=(actual,point,context)=>assert(
    Math.abs(actual.x-point.x*box.scale-box.x)<=.5&&Math.abs(actual.y-point.y*box.scale-box.y)<=.5,
    name+' R1 '+context+' '+JSON.stringify({actual,point,box}));
  for(const kind of ['strokes','markers']){
    const actual=drawing[kind];
    assert.deepEqual(sorted(actual.map(part=>part.id)),sorted(scene[kind].map(part=>part.id)),name+' R1 drawn '+kind);
    for(const model of scene[kind]){
      const part=actual.find(candidate=>candidate.id===model.id),context=kind+'/'+model.id;
      assert(part.visible,name+' R1 visible '+context);
      if(kind==='strokes'){
        assert.equal(part.gate,model.gate,name+' R1 gate '+context);
        assert.equal(part.points.length,model.points.length,name+' R1 point inventory '+context);
        model.points.forEach((point,i)=>close(part.points[i],point,context+'/'+i));
      } else {
        assert.equal(part.relation,model.relation,name+' R1 relation '+context);
        const [a,b]=model.points,[start,tip]=part.points;
        close(tip,b,context+' tip');
        const dx=b.x-a.x,dy=b.y-a.y,px=tip.x-start.x,py=tip.y-start.y;
        assert(dx*px+dy*py>0&&Math.abs(dx*py-dy*px)<.5,name+' R1 marker direction '+context);
      }
    }
  }
}

function graphRegistration() {
  const map=document.querySelector('#map'), viewport=map.querySelector('.map-viewport');
  const r=viewport.getBoundingClientRect(), left=r.left+viewport.clientLeft, top=r.top+viewport.clientTop;
  const drawing=map.graphDrawing;
  return {drawing, cards:Object.fromEntries([...map.querySelectorAll('.node-card')].map(card=>{
    const {x,y,width,height}=card.getBoundingClientRect();
    return [card.dataset.node,{x:x-left,y:y-top,width,height}];
  })), viewport:[viewport.clientWidth,viewport.clientHeight],
  canvas:map.querySelector('canvas').getBoundingClientRect().toJSON(), left, top};
}

function assertRegistration(name, scene, measured) {
  const {drawing, cards, viewport, canvas, left, top}=measured, {box}=drawing;
  const close=(a,b,label)=>assert(Math.abs(a-b)<=.5,name+' R3 '+label+': '+a+' vs '+b);
  close(box.width,viewport[0],'viewport width');
  close(box.height,viewport[1],'viewport height');
  if(drawing.renderer==='webgl') {
    close(canvas.x,left,'canvas left');
    close(canvas.y,top,'canvas top');
    close(canvas.width,box.width,'canvas width');
    close(canvas.height,box.height,'canvas height');
  }
  for(const card of scene.cards) {
    const actual=cards[card.id];
    for(const field of ['x','y','width','height']){
      const offset=field==='x'||field==='y'?box[field]:0;
      close(actual[field],card[field]*box.scale+offset,card.id+' '+field);
    }
  }
  for(const edge of scene.edges) {
    const endpoints=[edge.points[0],edge.points.at(-1)];
    for(const [i,side] of ['right','left'].entries()){
      const original=endpoints[i],card=cards[i===0?edge.from:edge.to];
      const stroke=scene.strokes.find(p=>p.members.includes(edge.id)&&p.points.some(q=>q.x===original.x&&q.y===original.y));
      const point=drawing.strokes.find(p=>p.id===stroke.id).points[stroke.points.findIndex(q=>q.x===original.x&&q.y===original.y)];
      close(point.x,card.x+(side==='right'?card.width:0),edge.id+' '+side+' boundary');
      assert(point.y>=card.y-.5&&point.y<=card.y+card.height+.5,name+' R3 '+edge.id+' endpoint height');
    }
  }
}

function assertDependencyFocus(name, records, graph, drawing) {
  const id=drawing.box.focusId, related=new Set(id?[id]:[]);
  const directions=[];
  const dependencies=records.nodes.flatMap(node=>[
    ...(node.needs||[]).map(need=>[need.from,node.id]),
    ...(node.kind==='review'?[[node.target,node.id]]:[]),
  ]);
  if(id)for(const direction of [0,1]) {
    const closure=new Set([id]);
    for(let count=0;count!==closure.size;){
      count=closure.size;
      for(const pair of dependencies)if(closure.has(pair[direction]))closure.add(pair[1-direction]);
    }
    directions.push(closure);
    for(const node of closure)related.add(node);
  }
  assert.deepEqual(sorted(graph.diagram.filter(c=>c.path).map(c=>c.id)),sorted([...related]),name+' R5 focused record closure');
  assert.deepEqual(sorted(graph.diagram.filter(c=>c.context).map(c=>c.id)),
    sorted(id?graph.diagram.filter(c=>!related.has(c.id)).map(c=>c.id):[]),name+' R5 context inventory');
  const path=new Set(graph.scene.edges.filter(({from,to})=>
    to!=='_run_checks'&&(directions[0]?.has(from)||directions[1]?.has(to))).map(edge=>edge.id));
  const focused=(kind,part)=>graph.scene[kind].find(model=>model.id===part.id).members.some(id=>path.has(id));
  const contextRanks=[...drawing.strokes.filter(p=>!focused('strokes',p)),...drawing.markers.filter(p=>!focused('markers',p))].map(p=>p.order);
  const focusedStrokes=drawing.strokes.filter(p=>focused('strokes',p));
  const topContext=Math.max(-1,...contextRanks);
  const topUnderlay=Math.max(-1,...focusedStrokes.map(p=>p.underlay));
  for(const part of focusedStrokes){
    assert(part.width>2,name+' R5 focused stroke emphasis '+part.id);
    assert(part.underlay>topContext&&part.order>topUnderlay,name+' R5 focus ink clears dimmed crossings '+part.id);
  }
  for(const mark of drawing.markers.filter(p=>focused('markers',p))){
    assert(mark.order>topContext&&mark.order>topUnderlay,name+' R5 focused marker clears dimmed crossings '+mark.id);
  }
  if(drawing.renderer==='webgl')for(const part of drawing.strokes){
    const rgb=hex=>[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
    const luminance=hex=>rgb(hex).map(c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4)
      .reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
    assert((luminance(drawing.box.background)+.05)/(luminance(part.color)+.05)>=3,
      name+' R5 WebGL stroke contrast '+part.id);
  }
}

function minimapDOM() {
  const map=document.querySelector('#map'), mini=map.querySelector('.map-mini');
  const r=mini.getBoundingClientRect(), indicator=mini.querySelector('.mini-window');
  return {hidden:mini.hidden,renderer:mini.dataset.renderer,target:[r.width,r.height],
    focusable:mini.tabIndex===0&&!mini.disabled, label:mini.getAttribute('aria-label'),
    window:['x','y','width','height'].map(key=>Number(indicator.getAttribute(key))),
    marks:[...mini.querySelectorAll('polygon')].map(e=>[e.dataset.node,e.dataset.kind,e.points.numberOfItems,e.getAttribute('fill')])};
}

function assertMinimap(name, graph, drawing, mini) {
  const {width,height}=graph.scene.bounds, box=drawing.box;
  const overflow=width*box.scale>box.width||height*box.scale>box.height;
  assert.equal(mini.hidden,!overflow,name+' R9 minimap visibility');
  if(mini.hidden)return;
  assert(mini.focusable&&mini.label&&Math.min(...mini.target)>=24,name+' R9 minimap target');
  assert.equal(mini.renderer==='webgl',drawing.renderer==='webgl',name+' R9 minimap renderer');
  const kinds={work:[4,'#335cad'],review:[12,'#23654e'],decision:[6,'#9e4d04'],goal:[3,'#6f4f91']};
  assert.deepEqual(sorted(mini.marks),sorted(graph.scene.cards.map(c=>[c.id,c.kind,...kinds[c.kind]])),
    name+' R9 minimap card marks');
  if(drawing.renderer==='webgl')assert.deepEqual(sorted(drawing.minimapMarks),sorted(graph.scene.cards.map(c=>c.id)),
    name+' R9 WebGL minimap mesh inventory');
  const [x,y,w,h]=mini.window;
  assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=142&&y+h<=88,name+' R9 viewport indicator bounds');
}

function graphInk() {
  const map=document.querySelector('#map'), {strokes,box}=map.graphDrawing, scene=map.graphScene;
  const canvas=map.querySelector('canvas'), gl=canvas.getContext('webgl2');
  const {drawingBufferWidth:width,drawingBufferHeight:height}=gl;
  const pixels=new Uint8Array(width*height*4);
  gl.readPixels(0,0,width,height,gl.RGBA,gl.UNSIGNED_BYTE,pixels);
  const ink=(x,y)=>{
    const p=(Math.floor(x)+(height-1-Math.floor(y))*width)*4;
    return pixels[p+3]>100&&pixels[p]<170&&pixels[p+1]<180&&pixels[p+2]<200;
  };
  const dpr=box.dpr, samples=[];
  for(const {id,points} of strokes) {
    let count=0, on=0;
    for(let i=1;i<points.length;i++){
      const a=points[i-1], b=points[i], length=Math.hypot(b.x-a.x,b.y-a.y);
      for(let step=1;step<length;step++){
        const x=(a.x+(b.x-a.x)*step/length)*dpr, y=(a.y+(b.y-a.y)*step/length)*dpr;
        if(x<2||y<2||x>=width-2||y>=height-2)continue;
        count++;
        if(ink(x,y))on++;
      }
    }
    samples.push({id,count,on});
  }
  const interiors=[];
  for(const card of scene.cards) {
    const x=(card.x*box.scale+box.x)*dpr, y=(card.y*box.scale+box.y)*dpr;
    const left=Math.max(0,Math.ceil(x+3*dpr)), right=Math.min(width,Math.floor(x+(card.width*box.scale-3)*dpr));
    const top=Math.max(0,Math.ceil(y+3*dpr)), bottom=Math.min(height,Math.floor(y+(card.height*box.scale-3)*dpr));
    let found=false;
    for(let row=top;row<bottom&&!found;row++)for(let col=left;col<right;col++)if(ink(col,row)){found=true;break;}
    if(found)interiors.push(card.id);
  }
  const byId=new Map(samples.map(sample=>[sample.id,sample]));
  const routes=scene.edges.map(edge=>scene.strokes.filter(p=>p.members.includes(edge.id)).reduce((total,part)=>{
    const sample=byId.get(part.id);
    total.count+=sample.count;total.on+=sample.on;
    return total;
  },{id:edge.id,count:0,on:0}));
  return {samples,routes,interiors,preserved:gl.getContextAttributes().preserveDrawingBuffer,error:gl.getError()};
}

function assertGraphInk(name, ink) {
  assert(ink.preserved&&!ink.error,name+' R2 readable test framebuffer');
  assert.deepEqual(ink.interiors,[],name+' R2 off-route ink inside card interiors');
  for(const {id,count,on} of ink.routes)if(count>=15)assert(on>0,name+' R2 missing ink for edge '+id);
  for(const {id,count,on} of ink.samples)if(count>=15)assert(on>0,name+' R2 missing ink for shaft '+id);
}

async function assertMotion(name) {
  const duration = `[...document.querySelectorAll('#map,#map *')].flatMap(e=>{
    const css=getComputedStyle(e), duration=css.animationDuration.split(',').map(parseFloat);
    const counts=css.animationIterationCount.split(',').map(value=>value==='infinite'?Infinity:Number(value));
    return [...duration.map((time,i)=>time>0?time*counts[i%counts.length]:0),
      ...css.transitionDuration.split(',').map(parseFloat)];
  }).every(time=>time<=LIMIT)`;
  for(const [preference,limit] of [['reduce',0],['no-preference',5]]) {
    await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:preference}]});
    await delay(180);
    await paint();
    assert(await evaluate(duration.replace('LIMIT',limit)),name+' R8 '+preference+' motion duration');
    const frames="document.querySelector('#map').graphDrawing.frames ?? 0";
    const before=await evaluate(frames);
    await delay(225);
    assert.equal(await evaluate(frames),before,name+' R8 settled frame count');
  }
  await send('Emulation.setEmulatedMedia',{features:[{name:'prefers-reduced-motion',value:'reduce'}]});
}

async function exerciseGraph(screen, graph) {
  const name=screen.name;
  const check=async step=>{
    await paint();
    await until(`(()=>{
      const map=document.querySelector('#map'),v=map.querySelector('.map-viewport'),s=map.querySelector('.map-stage');
      const {box}=map.graphDrawing;
      return box.width===v.clientWidth&&box.height===v.clientHeight&&box.scale===Number(map.dataset.scale)&&
        Math.abs(box.x-parseFloat(s.style.left)+v.scrollLeft)<=.5&&Math.abs(box.y-parseFloat(s.style.top)+v.scrollTop)<=.5;
    })()`);
    const scene=await evaluate("document.querySelector('#map').graphScene");
    const measured=await evaluate(`(${graphRegistration})()`);
    assertRendererParity(name+' '+step,scene,measured.drawing);
    assertRegistration(name+' '+step,scene,measured);
    return measured.drawing;
  };
  await send('Emulation.setDeviceMetricsOverride',{
    width:screen.viewport.width-125,height:screen.viewport.height-55,deviceScaleFactor:2,mobile:false,
  });
  const resized=await check('resize');
  assert.equal(resized.box.dpr,2,name+' R3 changed device pixel ratio');
  if(resized.renderer==='webgl'){
    assert(await evaluate(`(()=>{const c=document.querySelector('.graph-webgl canvas'), r=c.getBoundingClientRect();
      return c.width===r.width*devicePixelRatio&&c.height===r.height*devicePixelRatio})()`),name+' R3 backing resolution');
  }
  await evaluate("document.querySelector('.map-viewport').scrollBy(180,90)");
  await check('pan');
  const point=await evaluate(`(()=>{const v=document.querySelector('.map-viewport'),r=v.getBoundingClientRect();
    const left=r.x+v.clientLeft,top=r.y+v.clientTop;
    return {left,top,x:Math.round(left+v.clientWidth/2),y:Math.round(top+v.clientHeight/2)}})()`);
  await evaluate(`(()=>{
    const map=document.querySelector('#map'),v=map.querySelector('.map-viewport'),s=v.querySelector('.map-stage');
    v.addEventListener('wheel',event=>{
      const r=v.getBoundingClientRect(), scale=Number(map.dataset.scale);
      window.routeWheelAnchor={
        x:(event.clientX-r.left-v.clientLeft+v.scrollLeft-parseFloat(s.style.left))/scale,
        y:(event.clientY-r.top-v.clientTop+v.scrollTop-parseFloat(s.style.top))/scale,
      };
    },{once:true,capture:true});
  })()`);
  await send('Input.dispatchMouseEvent',{type:'mouseWheel',x:point.x,y:point.y,deltaX:0,deltaY:-100,modifiers:2});
  const zoomed=await check('cursor zoom');
  assert(zoomed.box.scale>resized.box.scale,name+' R3 wheel zoom changed scale');
  const unclamped=await evaluate(`(()=>{const v=document.querySelector('.map-viewport');
    return [v.scrollLeft>0&&v.scrollLeft<v.scrollWidth-v.clientWidth,v.scrollTop>0&&v.scrollTop<v.scrollHeight-v.clientHeight]})()`);
  assert(unclamped.some(Boolean),name+' R3 cursor zoom has an unclamped axis');
  const after=await evaluate(`(()=>{
    const v=document.querySelector('.map-viewport'),r=v.getBoundingClientRect();
    return {x:r.left+v.clientLeft,y:r.top+v.clientTop};
  })()`);
  const anchor=await evaluate('window.routeWheelAnchor');
  assert(anchor,name+' R3 wheel event reached the graph viewport');
  for(const [i,field] of ['x','y'].entries())if(unclamped[i]){
    assert(Math.abs(anchor[field]*zoomed.box.scale+zoomed.box[field]+after[field]-point[field])<=.5,
      name+' R3 cursor anchor '+field+' '+JSON.stringify({anchor,point,after,zoomed:zoomed.box}));
  }
  await evaluate("document.querySelector('.overview-note button').click()");
  await check('level change');
  await assertMotion(name);

  if(zoomed.renderer==='webgl') {
    const selection="document.querySelector('#panel').dataset.node";
    const before=await evaluate(selection);
    assert(before,name+' R7 explicit card selection');
    assert(await evaluate(`(()=>{const gl=document.querySelector('.graph-webgl canvas').getContext('webgl2');
      const extension=gl.getExtension('WEBGL_lose_context');if(!extension)return false;extension.loseContext();return true})()`),
      name+' R7 context-loss extension');
    await until("document.querySelector('#map').dataset.renderer==='svg'");
    assert.equal((await check('lost context')).renderer,'svg',name+' R7 active SVG fallback');
    assert.equal(await evaluate(selection),before,name+' R7 panel selection preserved');
    assert.equal(await evaluate("document.querySelector('#map .node-card.expanded').dataset.node"),before,name+' R7 card selection preserved');
  }
}

async function panDiagnostics() {
  return evaluate(`(async()=>{
    const map=document.querySelector('#map'),v=map.querySelector('.map-viewport'),start=map.graphDrawing;
    const transfer=performance.getEntriesByType('resource').filter(row=>new URL(row.name).pathname.startsWith('/static/vendor/three/'));
    const timings=[],submissions=[];
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    let before=performance.now();
    for(let i=0;i<12;i++){
      const fraction=(i+1)/13;
      v.scrollTo((v.scrollWidth-v.clientWidth)*fraction,(v.scrollHeight-v.clientHeight)*fraction);
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      const now=performance.now(),drawing=map.graphDrawing;
      timings.push((now-before)/2);before=now;
      if(drawing.frameTime!==undefined)submissions.push(drawing.frameTime);
    }
    const median=values=>{
      const sorted=[...values].sort((a,b)=>a-b);
      return sorted.length?(sorted[Math.floor((sorted.length-1)/2)]+sorted[Math.floor(sorted.length/2)])/2:null;
    };
    return {renderer:start.renderer,firstFrameMs:start.firstFrame??null,panFrameMedianMs:median(timings),
      panFrameMaxMs:Math.max(...timings),submissionMedianMs:median(submissions),
      vendorModuleBytes:transfer.reduce((sum,row)=>sum+row.encodedBodySize,0),
      vendorTransferBytes:transfer.reduce((sum,row)=>sum+row.transferSize,0)};
  })()`);
}

async function verifyFullInk(screen) {
  const tiles=await evaluate(`(()=>{
    const v=document.querySelector('.map-viewport');
    const offsets=(size,extent)=>Array.from({length:Math.max(1,Math.ceil(extent/(size*.8)))},(_,i)=>Math.min(i*size*.8,extent-size));
    return offsets(v.clientWidth,v.scrollWidth).flatMap(x=>offsets(v.clientHeight,v.scrollHeight).map(y=>[x,y]));
  })()`);
  const covered=new Set();
  for(const [x,y] of tiles){
    await evaluate(`document.querySelector('.map-viewport').scrollTo(${x},${y})`);
    await paint();
    const ink=await evaluate(`(${graphInk})()`);
    assertGraphInk(screen.name+' ink tile '+x+','+y,ink);
    for(const sample of ink.routes)if(sample.count>=15&&sample.on>0)covered.add(sample.id);
  }
  const scene=await evaluate("document.querySelector('#map').graphScene");
  assert.deepEqual(sorted([...covered]),sorted(scene.edges.map(edge=>edge.id)),screen.name+' R2 visible ink searched over every edge');
}

async function captureLaneCards(screen, filename) {
  const lod=screen.lane_crops;
  assert.equal(await evaluate("document.querySelector('#map').dataset.lod"),lod,screen.name+' R9 lane crop level');
  for(const [i,node] of ['reader','html','guide'].entries()){
    const selector=`#map .node-card[data-node="${node}"]`;
    await evaluate(`(()=>{
      const card=document.querySelector(${JSON.stringify(selector)}),v=document.querySelector('.map-viewport');
      const r=card.getBoundingClientRect(),b=v.getBoundingClientRect();
      v.scrollBy(r.x+r.width/2-b.x-v.clientWidth/2,r.y+r.height/2-b.y-v.clientHeight/2);
    })()`);
    await paint();
    const geometry=await evaluate(`(()=>{
      const card=document.querySelector(${JSON.stringify(selector)}),r=card.getBoundingClientRect();
      const v=document.querySelector('.map-viewport'),b=v.getBoundingClientRect();
      const cue=card.querySelector('.lane-cue');
      return {count:cue.childElementCount,visible:getComputedStyle(cue).visibility==='visible',
        clear:r.left>=b.left+v.clientLeft-.5&&r.right<=b.left+v.clientLeft+v.clientWidth+.5&&
          r.top>=b.top+v.clientTop-.5&&r.bottom<=b.top+v.clientTop+v.clientHeight+.5,
        rect:{x:Math.floor(r.x+scrollX),y:Math.floor(r.y+scrollY),width:Math.ceil(r.width),height:Math.ceil(r.height),scale:1}};
    })()`);
    assert(geometry.count===i+1&&geometry.clear&&geometry.visible,screen.name+' R9 lane '+(i+1)+' '+JSON.stringify(geometry));
    const {data}=await send('Page.captureScreenshot',{format:'png',clip:geometry.rect});
    writeFileSync(path.join(verify,filename.replace('.png',`-lane-${i+1}.png`)),Buffer.from(data,'base64'));
  }
}

async function assertMinimapClear(name) {
  await evaluate("document.querySelector('.map-key').open=false");
  await paint();
  const obstruction=await evaluate(`(async()=>{
    const v=document.querySelector('.map-viewport'),m=document.querySelector('.map-mini');
    if(m.hidden)return [];
    const initial=[v.scrollLeft,v.scrollTop], failures=[];
    const width=v.scrollWidth-v.clientWidth,height=v.scrollHeight-v.clientHeight;
    const paint=()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    for(const [x,y] of [[0,0],[width,0],[0,height],[width,height]]){
      v.scrollTo(x,y);await paint();
      const area=v.getBoundingClientRect(),mini=m.getBoundingClientRect();
      if(mini.top<area.bottom&&mini.bottom>area.top&&mini.left<area.right&&mini.right>area.left)
        failures.push({x,y,viewport:area.toJSON(),minimap:mini.toJSON()});
    }
    for(const card of v.querySelectorAll('.node-card')){
      const center=()=>{
        const viewport=v.getBoundingClientRect(),r=card.getBoundingClientRect();
        v.scrollBy(r.x+r.width/2-viewport.x-v.clientLeft-v.clientWidth/2,r.y+r.height/2-viewport.y-v.clientTop-v.clientHeight/2);
      };
      center();await paint();
      // Offscreen navigation can reflow after moving to a different part of the graph.
      center();await paint();
      const bounds=card.getBoundingClientRect(),mini=m.getBoundingClientRect(),area=v.getBoundingClientRect();
      const left=area.left+v.clientLeft,top=area.top+v.clientTop;
      if(Math.max(top,bounds.top)<mini.bottom&&Math.min(top+v.clientHeight,bounds.bottom)>mini.top&&
         Math.max(left,bounds.left)<mini.right&&Math.min(left+v.clientWidth,bounds.right)>mini.left)
        failures.push({card:card.dataset.node,bounds:bounds.toJSON(),minimap:mini.toJSON()});
      if((bounds.width<=v.clientWidth&&(bounds.left<left-.5||bounds.right>left+v.clientWidth+.5))||
         (bounds.height<=v.clientHeight&&(bounds.top<top-.5||bounds.bottom>top+v.clientHeight+.5)))
        failures.push({card:card.dataset.node,bounds:bounds.toJSON(),viewport:area.toJSON(),client:[left,top,v.clientWidth,v.clientHeight],scroll:[v.scrollLeft,v.scrollTop,v.scrollWidth,v.scrollHeight]});
    }
    v.scrollTo(...initial);
    await paint();
    return failures;
  })()`);
  assert.deepEqual(obstruction,[],name+' R9 every viewport pixel stays clear of the minimap at the four scroll extremes');
}

async function exerciseMinimap(name) {
  const scroll="document.querySelector('.map-viewport').scrollLeft";
  await evaluate("document.querySelector('.map-viewport').scrollTo(0,0); document.querySelector('.map-mini').focus({preventScroll:true})");
  await send('Input.dispatchKeyEvent',{type:'keyDown',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  await send('Input.dispatchKeyEvent',{type:'keyUp',key:'ArrowRight',code:'ArrowRight',windowsVirtualKeyCode:39});
  assert(await evaluate(scroll)>0,name+' R9 keyboard minimap navigation');
  const {x,y,width,height}=await evaluate("document.querySelector('.map-mini').getBoundingClientRect().toJSON()");
  const right=Math.round(x+width-8), left=Math.round(x+8), middle=Math.round(y+height/2);
  await send('Input.dispatchMouseEvent',{type:'mousePressed',x:right,y:middle,button:'left',buttons:1,clickCount:1});
  const clicked=await evaluate(scroll);
  assert(clicked>0,name+' R9 minimap click');
  await send('Input.dispatchMouseEvent',{type:'mouseMoved',x:left,y:middle,button:'left',buttons:1});
  await send('Input.dispatchMouseEvent',{type:'mouseReleased',x:left,y:middle,button:'left',clickCount:1});
  assert(await evaluate(scroll)<clicked,name+' R9 minimap drag');
}

function graphAppearance() {
  const visible=e=>e.getClientRects().length>0&&getComputedStyle(e).visibility==='visible';
  const graph='#map, #phone-flow, #panel, #accessible, #phone-view-toggle';
  const roots=[...document.querySelectorAll(graph)];
  const probes={text:[],marks:[],targets:[],unaligned:[]};
  const rgb=value=>value.match(/[\d.]+/g).map(Number);
  const blend=(front,back,opacity=1)=>{
    const a=(front[3]??1)*opacity;
    return back.map((channel,i)=>front[i]*a+channel*(1-a));
  };
  const background=e=>{
    const layers=[];
    for(let p=e;p;p=p.parentElement)layers.unshift(rgb(getComputedStyle(p).backgroundColor));
    return layers.reduce((back,front)=>blend(front,back),[255,255,255]);
  };
  const luminance=color=>color.map(v=>{const c=v/255;return c<=.04045?c/12.92:((c+.055)/1.055)**2.4;})
    .reduce((sum,c,i)=>sum+c*[.2126,.7152,.0722][i],0);
  const contrast=(a,b)=>{const x=luminance(a),y=luminance(b);return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
  const opacity=e=>{let alpha=1;for(let p=e;p;p=p.parentElement)alpha*=Number(getComputedStyle(p).opacity);return alpha;};
  const context=e=>[e.closest('[data-node]')?.dataset.node,e.dataset.from&&e.dataset.from+' → '+e.dataset.to,
    e.closest('.node-card')?.dataset.state,e.className?.baseVal||e.className||e.id||e.tagName].filter(Boolean).join(' ');
  const probe=(e,color,bg,threshold)=>({id:context(e),ratio:contrast(blend(rgb(color),bg,opacity(e)),bg),threshold,color,background:bg});
  const stage=document.querySelector('.map-stage');
  const transform=new DOMMatrixReadOnly(getComputedStyle(stage).transform);
  const scale=Math.hypot(transform.c,transform.d);
  probes.scale=scale;
  for(const root of roots)for(const e of [root,...root.querySelectorAll('*')]){
    if(!(e instanceof HTMLElement)||!visible(e))continue;
    if(e.matches('.map-stage,.node-position')||e.closest('.node-card,.edge-chip')) {
      const matrix=new DOMMatrixReadOnly(getComputedStyle(e).transform);
      if(!matrix.is2D||matrix.b!==0||matrix.c!==0||matrix.a<=0||matrix.d<=0)probes.unaligned.push(context(e));
    }
    if(![...e.childNodes].some(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim()))continue;
    const css=getComputedStyle(e),glyph=e.classList.contains('status-glyph');
    const item=probe(e,css.color,background(e),glyph?3:4.5);
    item.apparentSize=parseFloat(css.fontSize)*(stage.contains(e)?scale:1);
    item.text=e.textContent.trim().slice(0,70);
    (glyph?probes.marks:probes.text).push(item);
  }
  for(const e of document.querySelectorAll('.type-icon path,.edge-path,.relation-fill,.relation-stroke,.node-card.expanded,.graph-path .node-card')){
    if(!visible(e)&&!(e.closest('defs')&&visible(e.closest('.edge-layer'))))continue;
    const css=getComputedStyle(e);
    const property=e.matches('.node-card')?'outlineColor':e.classList.contains('relation-fill')?'fill':'stroke';
    if(property==='outlineColor'&&(css.outlineStyle==='none'||parseFloat(css.outlineWidth)===0)){
      throw Error(context(e)+' selected outline absent');
    }
    if(css[property]==='none')continue;
    const bg=background(property==='outlineColor'?e.parentElement:e);
    probes.marks.push(probe(e,css[property],bg,3));
  }
  for(const e of document.querySelectorAll('.lane-cue i'))if(visible(e)){
    const item=probe(e,getComputedStyle(e).backgroundColor,background(e.parentElement),3);
    const rect=e.getBoundingClientRect(),next=e.nextElementSibling?.getBoundingClientRect();
    item.laneMark={height:rect.height,width:rect.width,gap:next?next.left-rect.right:null};
    probes.marks.push(item);
  }
  if(innerWidth===390)for(const e of document.querySelectorAll('#attention :is(button,summary,a[href]),#flow :is(button,summary,a[href]),#accessible :is(button,summary,a[href]),#decision :is(button,summary,a[href],label:has(input[type=checkbox]))')){
    if(!visible(e))continue;
    const {width,height}=e.getBoundingClientRect();
    probes.targets.push({id:context(e)+' '+e.textContent.trim().slice(0,50),width,height,floor:e.matches('.ref')?24:44});
  }
  probes.legend=Array.from(document.querySelectorAll('.map-key[open] .line-sample'),e=>({
    caption:e.lastElementChild.textContent,dash:getComputedStyle(e.querySelector('.edge-path')).strokeDasharray,
    shape:e.querySelector('.relation-fill,.relation-stroke')?.getAttribute('d') ?? null,
  }));
  return probes;
}
function assertLegend(name, language, edges, items) {
  const relations=[...new Set(edges.map(edge=>edge[2]))],gates=[...new Set(edges.map(edge=>edge[3]))];
  assert.equal(items.length,relations.length+gates.length,name+' P2 legend entry count');
  for(const relation of relations){
    const caption=relationNames[language][relation], item=items.find(e=>e.caption===caption&&e.shape);
    assert(item&&markerShapes[relation].test(item.shape),name+' P2 legend expected '+caption+' marker, observed '+JSON.stringify(items));
  }
  for(const gate of gates){
    const caption=gateNames[language][gate], item=items.find(e=>e.caption===caption&&!e.shape);
    assert.equal(item?.dash,dashPatterns[gate],name+' P2 legend '+caption+' gate pattern');
  }
}

function assertAppearance(name, appearance) {
  assert.deepEqual(appearance.unaligned,[],name+' R3 labels stay screen-aligned');
  for(const item of [...appearance.text,...appearance.marks]){
    assert(item.ratio>=item.threshold,name+' Psi2 '+item.id+' '+(item.text||'')+' expected contrast ≥ '+item.threshold+', observed '+item.ratio.toFixed(2)+' ('+item.color+' on '+item.background+')');
    if(item.laneMark){
      const {height,width,gap}=item.laneMark;
      assert(height>=15.99&&width>=3&&!(gap!==null&&gap<3),name+' R9 lane mark size and separation '+JSON.stringify(item));
    }
    if(item.apparentSize!==undefined)assert(item.apparentSize>=11.99,name+' Psi3 '+item.id+' '+item.text+' expected ≥ 12 CSS px, observed '+item.apparentSize);
  }
  for(const {id,width,height,floor} of appearance.targets){
    assert(Math.min(width,height)>=floor-.05,name+' Psi3 '+id+' expected ≥ '+floor+'×'+floor+' CSS px, observed '+width.toFixed(2)+'×'+height.toFixed(2));
  }
  const min=(values,key)=>values.length?Math.min(...values.map(value=>value[key])):null;
  const actions=appearance.targets.filter(action=>action.floor===44);
  return {textContrast:min(appearance.text,'ratio'),markContrast:min(appearance.marks,'ratio'),textSize:min(appearance.text,'apparentSize'),
    actionSize:actions.length?Math.min(min(actions,'width'),min(actions,'height')):null};
}

function compareGrayGlyphs(name, png, boxes) {
  const masks = Object.entries(boxes).map(([id,rect])=>{
    const {x,y,width,height}=rect;
    assert(x>=0&&y>=0&&width>0&&height>0,name+' Psi1 '+id+' expected on-screen cue rectangle, observed '+JSON.stringify(rect));
    const pixels=spawnSync(ffmpeg,['-v','error','-i',png,'-vf',`crop=${width}:${height}:${x}:${y},scale=24:24:flags=neighbor,format=gray`,'-frames:v','1','-f','rawvideo','pipe:1']);
    assert.equal(pixels.status,0,name+' Psi1 '+id+' '+pixels.stderr.toString());
    assert.equal(pixels.stdout.length,576,name+' Psi1 '+id+' normalized crop pixel count');
    return [id,pixels.stdout.map(p=>p<128?1:0)];
  });
  return masks.flatMap(([id,a],i)=>masks.slice(i+1).map(([other,b])=>{
    const difference=a.reduce((sum,p,j)=>sum+Number(p!==b[j]),0)/a.length;
    assert(difference>=.05,name+' Psi1 '+id+' / '+other+' expected ≥ 5% differing mask pixels, observed '+(difference*100).toFixed(2)+'%');
    return {pair:[id,other],difference};
  }));
}
const derivedNumbers = new Set([1,2,3,5,7,10,15,17,18,19,20,21,22,23,24,29,33,34,37,38,41,44,52,53,58,59,61,62,63,64,65,66,67,68,69,...manifest.filter(s=>s.number>=70).map(s=>s.number)]);
try {
  chrome = start(chromePath, ['--headless=new','--use-angle=swiftshader','--enable-unsafe-swiftshader',
    '--remote-debugging-port=0','--user-data-dir='+profile,'--no-first-run','--no-default-browser-check','--lang=ko','about:blank']);
  const endpoint = (await lineMatching(chrome, chrome.stderr, /DevTools listening on (ws:\/\/\S+)/))[1];
  chrome.stderr.on('data', chunk => { /* Drain Chrome logs without exposing unrelated browser state. */ });
  const targets = await (await fetch('http://127.0.0.1:'+new URL(endpoint).port+'/json')).json();
  ws = new WebSocket(targets.find(t=>t.type==='page').webSocketDebuggerUrl);
  await new Promise((resolve,reject) => {ws.onopen=resolve; ws.onerror=reject;});
  ws.onmessage = event => {
    const message = JSON.parse(event.data);
    if(message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
    if(message.method === 'Network.requestWillBeSent') requests.push(message.params.request.url);
    if(pending.has(message.id)) {const [resolve,reject]=pending.get(message.id);pending.delete(message.id);message.error?reject(Error(JSON.stringify(message.error))):resolve(message.result);}
  };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Emulation.setLocaleOverride', {locale:'ko-KR'});
  await send('Emulation.setTimezoneOverride', {timezoneId:'Asia/Seoul'});
  await send('Emulation.setEmulatedMedia', {features:[{name:'prefers-reduced-motion',value:'reduce'}]});
  const webgl2=await evaluate("!!document.createElement('canvas').getContext('webgl2')");
  console.log('Chrome WebGL2 context:',webgl2?'available':'unavailable');
  for (const screen of manifest.filter(row => !only || only.has(row.number))) {
    const fixture = fixtures[screen.scenario];
    const filename = String(screen.number).padStart(2,'0')+'-'+screen.name+'.png';
    const record = {number:screen.number,name:screen.name,scenario:screen.scenario,filename,group:screen.group};
    records = records.filter(row => row.number !== screen.number);
    const file = path.join(fixture.project,'guide.txt');
    const originalFile = screen.scenario === 'file-changed-live' ? readFileSync(file) : null;
    try {
      if(screen.scenario === 'changed-live') cli(fixture, ['plan','set',fixture.plan]);
      if(screen.scenario === 'file-changed-live'){const gate=cli(fixture,['gate','a'],1);fixture.decision=gate.asks[0]||gate.show?.match(/--decision (d\d+)/)?.[1];assert(fixture.decision,'current file decision is required');}
      activeServer = start(python, ['-I','-S','-B',path.join(skill,'scripts/gf'),'serve'], {cwd:fixture.project,env:envFor(fixture)});
      const started = JSON.parse((await lineMatching(activeServer, activeServer.stdout, /(\{"ok": true[^\n]+\})/))[1]);
      const base = new URL(started.url);
      const values = {token:base.searchParams.get('t'),project:fixture.project,run:fixture.run,decision:fixture.decision};
      const relative = screen.url.replace(/\{(\w+)\}/g, (_, key) => encodeURIComponent(values[key]));
      record.deepLink = relative.replace(encodeURIComponent(values.token), '{token}');
      errors.length = 0;
      requests.length = 0;
      await send('Emulation.setDeviceMetricsOverride', {width:screen.viewport.width,height:screen.viewport.height,deviceScaleFactor:1,mobile:false});
      const dashboard=new URL(relative,base.origin);
      dashboard.searchParams.set('graphTest','1');
      if(forceSVG)dashboard.searchParams.set('renderer','svg');
      await send('Page.navigate', {url:dashboard.href});
      const language=screen.language||'ko';
      await until(`!!document.querySelector('#map').graphScene && document.documentElement.lang===${JSON.stringify(language)}`);
      await delay(450);
      for(const action of screen.interactions) await interaction(action, fixture);
      await evaluate('document.fonts.ready');
      const dom = await evaluate(`({title:document.querySelector('#title').textContent,language:document.documentElement.lang,text:document.body.innerText,level:document.querySelector('#map').dataset.level,scale:document.querySelector('#map').dataset.scale,scrollY,buttons:[...document.querySelectorAll('button')].filter(b=>b.getBoundingClientRect().width).map(b=>({text:b.textContent,disabled:b.disabled}))})`);
      assert.equal(dom.language,language);
      assert(dom.text.length > 100 && !/서버에 연결할 수 없|ERR_CONNECTION|사이트에 연결할 수 없/.test(dom.text), 'blank or connection error page');
      assert.equal(errors.length, 0, JSON.stringify(errors));
      assert(!dom.text.includes('[object Object]'), 'raw object in rendered text');
      if(screen.number === 64) assert.equal(dom.text.split('이 답만으로는 아무것도 통과되지 않아요').length-1,1,'free-answer limit is stated once');
      if(screen.number === 69) assert(dom.text.includes('질문에 쓰일 문구가 바뀌었어요'), 'wording-only log line missing');
      if(screen.number === 68) assert(await evaluate("document.querySelector('.plan-actions button.primary').disabled"), 'phone plan must remain locked');
      const audit=await evaluate(`(()=>{
        const map=document.querySelector('#map'),v=document.querySelector('.map-viewport'),vr=v.getBoundingClientRect();
        const shown=map.getBoundingClientRect().width>0&&!map.closest('[hidden]');
        const count=document.querySelector('.map-visible'),toolbar=document.querySelector('.map-toolbar');
        const panel=document.querySelector('#panel'),body=panel.querySelector('.panel-body'),bar=panel.querySelector('.panel-bar');
        const cards=[...document.querySelectorAll('#map .node-card')];
        const selected=cards.find(c=>c.classList.contains('expanded'));const sentence=panel.querySelector('.node-sentence'),sr=sentence?.getBoundingClientRect();
        const leafRects=body?[...body.querySelectorAll('p,li,summary,h3,pre')].filter(e=>e.getClientRects().length&&!e.querySelector('p,li,summary,h3,pre')).map(e=>{const range=document.createRange();range.selectNodeContents(e);return {text:e.textContent,rect:range.getBoundingClientRect().toJSON()}}):[];
        const visibleTitles=cards.filter(c=>{if(getComputedStyle(c).visibility==='hidden')return false;const t=c.querySelector('.node-title'),range=document.createRange();range.selectNodeContents(t);const r=map.dataset.lod==='far'?c.getBoundingClientRect():range.getBoundingClientRect(),left=vr.left+v.clientLeft,top=vr.top+v.clientTop;return r.left>=left-.5&&r.right<=left+v.clientWidth+.5&&r.top>=top-.5&&r.bottom<=top+v.clientHeight+.5}).map(c=>c.querySelector('.node-title').textContent);
        return {shown,firstSentence:panel.hidden||!!sentence&&sentence.parentElement.children[1]===sentence&&sr.top>=0&&sr.bottom<=innerHeight,scroll:{left:v.scrollLeft,top:v.scrollTop},visibleTitles,
          toolbar:!shown||count.scrollWidth<=count.clientWidth+1&&count.getBoundingClientRect().left>=toolbar.getBoundingClientRect().left,
          panel:panel.hidden||bar.getBoundingClientRect().bottom<=body.getBoundingClientRect().top+.5,
          panelTitle:bar?.querySelector('strong')?.textContent,
          panelFirstLines:leafRects.filter(r=>r.rect.bottom>body.getBoundingClientRect().top&&r.rect.top<body.getBoundingClientRect().top),
          contentFits:!shown||cards.every(c=>c.scrollHeight<=c.clientHeight+1&&c.getBoundingClientRect().height<=c.parentElement.getBoundingClientRect().height+1),
          selectedVisible:!selected||(()=>{const r=selected.getBoundingClientRect();return r.left>=vr.left-.5&&r.right<=vr.right+.5&&r.top>=vr.top-.5&&r.bottom<=vr.bottom+.5})(),
          changeTitles:[...document.querySelectorAll('.plan-change-list>details>summary')].map(e=>e.textContent.split(' · ').slice(1).join(' · ')).sort(),
          markedTitles:cards.filter(c=>c.querySelector('.change-mark')).map(c=>c.querySelector('.node-title').textContent).sort()};
      })()`);
      assert(audit.firstSentence,'U1 first explanation is visible below the title');
      assert(audit.toolbar,'E1 count phrases must not be clipped');
      assert(audit.panel,'E2 panel body starts below its pinned title');
      assert.equal(audit.panelFirstLines.length,0,'E2 no text is sliced at the top of the panel scroll area');
      assert(audit.contentFits,'E6 content must fit the measured card');
      const expected=graphRecords(fixture), graph=await evaluate(`(${graphDOM})()`);
      const metrics=assertGraphRecords(screen.name,language,expected,graph,audit.shown?audit.visibleTitles.length:undefined);
      if(graph.scene.edges.length&&ratchets[screen.number])
        assert(!exceedsRatchet(metrics,ratchets[screen.number]),screen.name+' M2 route ratchet '+metrics+' exceeds '+ratchets[screen.number]);
      if(audit.shown&&graph.scene.edges.length) {
        if(!forceSVG&&webgl2)await until("document.querySelector('#map').dataset.renderer==='webgl'");
        const drawing=await evaluate("document.querySelector('#map').graphDrawing");
        graph.drawing=drawing;
        assert.equal(drawing.renderer,forceSVG||!webgl2?'svg':'webgl',screen.name+' active renderer');
        assertRendererParity(screen.name,graph.scene,drawing);
        assertRegistration(screen.name,graph.scene,await evaluate(`(${graphRegistration})()`));
        assertDependencyFocus(screen.name,expected,graph,drawing);
        assertMinimap(screen.name,graph,drawing,await evaluate(`(${minimapDOM})()`));
        if(drawing.renderer==='webgl')assertGraphInk(screen.name,await evaluate(`(${graphInk})()`));
      }
      if(screen.show_card){
        const geometry=await evaluate(`(()=>{
          const e=document.querySelector('#map [data-node='+${JSON.stringify(screen.show_card)}+']'),v=document.querySelector('.map-viewport'),r=e.getBoundingClientRect();
          const cue=e.querySelector('.status-glyph').getBoundingClientRect();
          const viewportTop=v.getBoundingClientRect().top+v.clientTop;
          const hit=document.elementFromPoint(cue.x+cue.width/2,cue.y+cue.height/2);
          return {width:r.width,viewport:v.clientWidth,visibility:getComputedStyle(e).visibility,
            cueOnScreen:cue.top>=Math.max(0,viewportTop)&&cue.bottom<=Math.min(innerHeight,viewportTop+v.clientHeight),
            hit:hit?.closest('.node-card')?.dataset.node};
        })()`);
        assert(geometry.width<=geometry.viewport&&geometry.visibility==='visible'&&geometry.cueOnScreen&&geometry.hit===screen.show_card,screen.name+' B7 expected reachable '+screen.show_card+', observed '+JSON.stringify(geometry));
      }
      if(screen.scenario==='graph-verification'){
        const byId=Object.fromEntries((audit.shown?graph.diagram:graph.phone).map(c=>[c.id,c]));
        const final=expected.events.findLast(e=>e.type==='gate.final');
        const rejection=expected.events.findLast(e=>e.type==='gate.verdict'&&e.data.node==='b');
        const retry=expected.events.filter(e=>e.type==='node.start'&&e.data.node==='d');
        assert.equal(final.data.result,'failed');
        assert.equal(byId._run_checks.state,'failedFinal',screen.name+' P3 _run_checks failed final record');
        assert.equal(rejection.actor.role,'historical');
        assert.equal(byId.b.state,'returned',screen.name+' P3 b returned record');
        assert(!byId.b.reference?.trim(),screen.name+' P3 b expected no invented actor, observed '+byId.b.reference);
        assert.equal(retry.length,2);
        assert.equal(byId.d.state,'retrying',screen.name+' P3 d earlier failure must remain history');
        assert(!byId.d.footer?.trim(),screen.name+' P3 d expected empty failure footer, observed '+byId.d.footer);
      }
      if(screen.tab_chain){
        const cards=graph.scene.cards, index=cards.findIndex((c,i)=>i>0&&c.x<cards[i-1].x);
        const successors=new Map(expected.edges.map(([from,to])=>[from,to]));
        const destinations=new Set(successors.values()), order=[];
        for(let id=[...successors.keys()].find(id=>!destinations.has(id));id&&!order.includes(id);id=successors.get(id))order.push(id);
        assert.deepEqual(cards.map(c=>c.id),order,screen.name+' M1 wrapped order from stored prerequisites');
        assert(index>0,screen.name+' M1 expected wrapped layout');
        const from=cards[index-1].id, to=cards[index].id;
        await evaluate(`document.querySelector('#map [data-node="${from}"] .node-header').focus({preventScroll:true})`);
        await send('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
        await send('Input.dispatchKeyEvent',{type:'keyUp',key:'Tab',code:'Tab',windowsVirtualKeyCode:9});
        assert.equal(await evaluate("document.activeElement.closest('[data-node]')?.dataset.node"),to,screen.name+' M1 Tab from '+from+' across the row break');
        await paint();
        const tabDrawing=await evaluate("document.querySelector('#map').graphDrawing");
        assert.equal(tabDrawing.box.focusId,to,screen.name+' R5 native keyboard focus');
        assertDependencyFocus(screen.name+' Tab',expected,await evaluate(`(${graphDOM})()`),tabDrawing);
        await evaluate('document.activeElement.blur()');
      }
      dom.graphVerification={cards:graph.scene.cards.length,edges:graph.scene.edges.length,crossings:metrics[0],metrics};
      const appearance=await evaluate(`(${graphAppearance})()`);
      if(screen.minimum_zoom){
        assert(Math.abs(appearance.scale-.7)<.0001&&graph.lod==='far',screen.name+' Psi3/R6 expected 70% far scale, observed '+appearance.scale);
        const phone=await evaluate(`(()=>{
          const v=document.querySelector('.map-viewport'),r=v.getBoundingClientRect();
          return {height:v.clientHeight,visible:Math.min(r.bottom,innerHeight)-Math.max(r.top,0)};
        })()`);
        assert(phone.height>=180&&phone.visible>=180,screen.name+' R6 diagram is visible in the phone capture '+JSON.stringify(phone));
      }
      dom.graphVerification.appearance=assertAppearance(screen.name,appearance);
      const grayBoxes=screen.gray_cues&&await evaluate(`Object.fromEntries(Object.entries(${JSON.stringify(screen.gray_cues)}).map(([id,state])=>{
        const card=document.querySelector('#map [data-node="'+id+'"]');
        if(card.dataset.state!==state||getComputedStyle(card).visibility!=='visible')throw Error(id+' expected visible '+state+', observed '+card.dataset.state);
        const r=card.querySelector('.status-glyph').getBoundingClientRect();
        const x=Math.floor(r.x),y=Math.floor(r.y);
        return [id,{x,y,width:Math.ceil(r.right)-x,height:Math.ceil(r.bottom)-y}];
      }))`);
      if(audit.changeTitles.length)assert.deepEqual(audit.changeTitles,audit.markedTitles,'E8 change list names the marked cards');
      if(screen.number===11){assert(audit.scroll.top>0);audit.lowerRows=screen.interactions.find(a=>a.action==='lower-rows').observedScroll;assert.equal(audit.scroll.left,audit.lowerRows.before.left);assert(audit.visibleTitles.includes('접근성 확인'),'E13 lower branch is visible');}
      if(screen.number===27)assert(await evaluate("!document.querySelector('#home').hidden && document.querySelector('#flow').hidden"),'E13 answer record view');
      if(screen.number===36)assert(await evaluate("!document.querySelector('#flow').hidden && document.querySelector('#home').hidden"),'E13 graph banner view');
      if(screen.number===56)assert(dom.text.includes('확인 키를 새로 만들었어요')&&audit.panelTitle==='전체 결과 확인','V8 on-page recovery shows the new final check');
      if(screen.number===66){assert(dom.text.includes('허락하지 않은 결정'));assert(!dom.text.includes('내가 돌려보낸 결정'));}
      if(screen.number===67)assert(audit.selectedVisible,'E3 fit keeps selected card visible');
      if(screen.number===63){assert(/허락하기로 답했어요|받아들이기로 답했어요|받아들이지 않기로 답했어요/.test(dom.text));assert(dom.text.includes('이 안내를 시험 환경에 공개할까요?'));}
      if(screen.number===19)assert(await evaluate("getComputedStyle(document.querySelector('#accessible')).visibility==='hidden' && !!document.querySelector('#panel .planned-command')?.textContent"),'E4 opaque overlay and a real command');
      if(screen.decision_screen) {
        const questionAudit=await evaluate(`(()=>{
          const root=document.querySelector('#decision:not([hidden])')||document.querySelector('#attention');
          const blocks=[...root.querySelectorAll('[data-question-block]')].map(e=>e.dataset.questionBlock);
          const area=root.querySelector('[data-question-block=choices]');
          const groups=[...area.children].filter(e=>e.querySelector('button')&&!e.hidden);
          const inside=e=>{const r=e.getBoundingClientRect();return r.width>0&&r.top>=0&&r.left>=0&&r.bottom<=innerHeight+.5&&r.right<=innerWidth+.5;};
          const options=groups.map(e=>{const b=e.querySelector('button'),p=e.querySelector('.action-effect');return {label:b.textContent,effect:p?.textContent,inside:!!p&&inside(b)&&inside(p)};});
          return {blocks,options,question:root.querySelector('[data-question-block=question]').textContent,why:root.querySelector('[data-question-block=why]').textContent};
        })()`);
        assert.deepEqual(questionAudit.blocks.slice(0,5),['question','why','choices','history','verified'],'Q1–Q5 reading order');
        if(screen.viewport.width>760)assert(await evaluate(`(()=>{
          const root=document.querySelector('#decision:not([hidden])')||document.querySelector('#attention');
          const rect=name=>root.querySelector('[data-question-block='+name+']').getBoundingClientRect();
          return rect('question').bottom<=rect('why').top+1&&rect('why').bottom<=rect('choices').top+1;
        })()`),'question, reason and choices follow the visual reading order');
        assert(questionAudit.options.length>=2,'multiple choices');
        assert(questionAudit.options.every(o=>o.effect&&o.inside),JSON.stringify(questionAudit));
        assert.equal(new Set(questionAudit.options.map(o=>o.effect)).size,questionAudit.options.length,'each consequence differs');
        if(screen.scenario==='trajectory')assert(questionAudit.options.some(o=>o.effect.includes('시도 3번을 다 써서')&&o.effect.includes('다시 승인')),'exhausted attempt cost');
        dom.question=questionAudit;
        const before=await evaluate(`({scrollY,level:document.querySelector('#map').dataset.level,focus:document.activeElement?.id,text:document.querySelector('#decision')?.textContent})`);
        await delay(2200);
        assert.deepEqual(await evaluate(`({scrollY,level:document.querySelector('#map').dataset.level,focus:document.activeElement?.id,text:document.querySelector('#decision')?.textContent})`),before,'polling preserves the open question');
      }
      dom.audit=audit;
      assert(requests.length, screen.name+' expected network observations');
      assert(requests.every(url=>new URL(url).origin===base.origin),screen.name+' off-origin dashboard request');
      if(forceSVG)assert(!requests.some(url=>new URL(url).pathname.startsWith('/static/vendor/')),screen.name+' R7 forced SVG loads no vendor modules');
      const shot = await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false,fromSurface:true});
      const bytes = Buffer.from(shot.data,'base64');
      writeFileSync(path.join(final,filename),bytes);
      copyFileSync(path.join(final,filename),path.join(verify,filename));
      if(derivedNumbers.has(screen.number)||screen.decision_screen) {
        for(const [suffix,filter] of [['glance','scale=iw/4:ih/4,gblur=sigma=1.2,scale=iw*4:ih*4'],['gray','format=gray']]) {
          const result = spawnSync(ffmpeg,['-hide_banner','-loglevel','error','-y','-i',path.join(final,filename),'-vf',filter,'-frames:v','1',path.join(verify,filename.replace('.png','-'+suffix+'.png'))],{encoding:'utf8'});
          assert.equal(result.status,0,result.stderr);
        }
      }
      if(audit.shown){
        await evaluate("document.querySelector('.map-key').open=true");
        const appearance=await evaluate(`(${graphAppearance})()`);
        dom.graphVerification.legend=assertAppearance(screen.name+' legend',appearance);
        assertLegend(screen.name,language,expected.edges,appearance.legend);
      }
      if(grayBoxes)dom.graphVerification.grayDifferences=compareGrayGlyphs(screen.name,path.join(verify,filename.replace('.png','-gray.png')),grayBoxes);
      if(screen.lane_crops)await captureLaneCards(screen,filename);
      if([103,108,111].includes(screen.number))await assertMinimapClear(screen.name);
      if(screen.number===103)await exerciseGraph(screen,graph);
      if(screen.diagnostics){
        dom.diagnostics=await panDiagnostics();
        console.log('Diagnostics '+screen.name+' '+JSON.stringify(dom.diagnostics));
        if(screen.scenario==='graph-dense')await exerciseMinimap(screen.name);
        if(graph.drawing.renderer==='webgl')await verifyFullInk(screen);
      }
      record.status='captured'; record.sha256=createHash('sha256').update(bytes).digest('hex');
      writeFileSync(path.join(runtime,filename.replace('.png','.json')),JSON.stringify(dom,null,2)+'\n');
      record.observation=path.join(runtime,filename.replace('.png','.json'));
      console.log('Captured '+filename);
    } catch(error) {
      record.status='could not reproduce'; record.reason=String(error.stack || error);
      for(const dir of [final,verify]) for(const name of readdirSync(dir).filter(n=>n===filename || n.startsWith(filename.replace('.png','-')))) unlinkSync(path.join(dir,name));
      console.error('FAILED '+filename+': '+error.message);
    } finally {
      await send('Page.navigate',{url:'about:blank'});
      await stop(activeServer); activeServer=null;
      if(originalFile) writeFileSync(file,originalFile);
      if(screen.scenario === 'changed-live') cli(fixture,['plan','set',fixture.plan]);
      records.push(record);records.sort((a,b)=>a.number-b.number);persist();
    }
  }
} finally {
  if(ws?.readyState===1)await send('Browser.close').catch(()=>{});
  ws?.close();
  for(const child of [...owned].reverse()) await stop(child);
  // Check the dedicated profile too: Chrome may have spawned helper processes.
  let remaining=[];
  for(let attempt=0;attempt<100;attempt++) {
    remaining=spawnSync('/bin/ps',['-axo','pid=,command='],{encoding:'utf8'}).stdout.split('\n').filter(line=>line.includes(profile));
    if(!remaining.length)break;
    await delay(100); // Helpers can finish just after the owned browser exits.
  }
  for(const item of lifecycle) {const child=owned.find(c=>c.pid===item.pid);item.stopped=child.exitCode!==null || child.signalCode!==null;item.exitCode=child.exitCode;item.signal=child.signalCode;}
  writeFileSync(path.join(runtime,'processes.json'),JSON.stringify({lifecycle,remaining},null,2)+'\n');
  assert(remaining.length===0,'Chrome profile still running: '+remaining.join('\n'));
  assert(lifecycle.every(item=>item.stopped),'owned process still running');
  console.log('Confirmed: all '+lifecycle.length+' owned server/Chrome processes stopped; no profile helpers remain.');
}
const hashes = new Map();
for(const record of records.filter(r=>r.status==='captured')) {
  const others=hashes.get(record.sha256)||[];others.push(record.number);hashes.set(record.sha256,others);
}
writeFileSync(path.join(output,'duplicate-hashes.json'),JSON.stringify([...hashes.values()].filter(group=>group.length>1),null,2)+'\n');
assert(records.every(row=>row.status==='captured'), 'some screens failed; see screen-status.json');
