"""Record and presentation assertions for the dashboard graph."""
import unittest

import test_page
from graphflow import plan, server, state


class GraphVisualizationTests(unittest.TestCase):
    run_controller = test_page.PageTests.run_controller
    run_dom = test_page.PageTests.run_dom

    def test_f5_edge_hit_corridor_is_24_css_px_at_every_zoom(self):
        self.run_controller("""
const {pickGraphEdges} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const scene = {strokes:[
  {points:[{x:0,y:0},{x:100,y:0}],members:['a','b']},
  {points:[{x:100,y:0},{x:140,y:0}],members:['a']},
  {points:[{x:100,y:0},{x:100,y:80}],members:['b']},
]};
for(const scale of [.7, 6/7, 1, 1.6]){
  assert.deepEqual(pickGraphEdges(scene,{x:40,y:11.99/scale},scale),['a','b']);
  assert.deepEqual(pickGraphEdges(scene,{x:40,y:-12.01/scale},scale),[]);
  assert.deepEqual(pickGraphEdges(scene,{x:122,y:0},scale),['a']);
  assert.deepEqual(pickGraphEdges(scene,{x:100,y:32},scale),['b']);
}
""")

    def test_f1_activity_strip_preserves_order_timing_and_bounds(self):
        self.run_controller(r"""
const {cardFacts,activityStrip} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const phases=[
 {id:'late',category:'tool',start_ms:1600,end_ms:1800,duration_ms:200},
 {id:'early',category:'skill',start_ms:1000,end_ms:1400,duration_ms:400},
 {id:'gap',category:'thinking',start_ms:1400,end_ms:1600,duration_ms:200},
];
const attempt={attempt:2,status:'observed',started_ms:800,last_ms:1800,phases,
  totals:{tool:{count:1,duration_ms:200},skill:{count:1,duration_ms:400},thinking:{count:0,duration_ms:200}},
  calls:[{id:'a',category:'skill',start_ms:1000,end_ms:1400},{id:'b',category:'tool',start_ms:1600,end_ms:1800},
    {id:'future',category:'tool',start_ms:2500,end_ms:null}]};
const node={id:'a',status:'running',attempts:2,lane:3,activity:[{attempt:1},attempt]};
const before=cardFacts(node,[],1700,'ko');
assert.equal(before.now,'tool');
assert.deepEqual(before.calls.map(c=>c.id),['a','b']);
assert.deepEqual(before.totals.map(t=>[t.category,t.duration]),[['skill',400],['thinking',200],['tool',200]]);
assert.equal(before.attempt,2);
assert.equal(before.lane,3);
const strip=activityStrip(attempt,before,1700);
assert.deepEqual(strip.segments.map(({id,left,width})=>[id,left,Math.round(width*1000)]),
 [['early',0,400],['gap',.4,200],['late',.6,100]]);
assert.deepEqual(strip.dots,[{id:'a',left:0},{id:'b',left:.6}]);
assert.equal(strip.head,.7);
for(const segment of strip.segments)assert(segment.left>=0&&segment.left+segment.width<=1);
const after=cardFacts(node,[],2000);
assert.equal(after.now,null);
assert.equal(activityStrip(attempt,after,2000).head,null);
const boundary={...attempt,status:'unobserved'};
assert.deepEqual(cardFacts({...node,activity:[boundary]},[],1700).calls,[]);
assert.equal(cardFacts({...node,activity:[boundary]},[],1700).unread,'unobserved');
""")

    def test_g6_deterministic_event_clock_and_loop_inventory(self):
        self.run_controller(r"""
const {createGraphMotion} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const motion=createGraphMotion(), clock=1000;
const card=(id,state,overrides={})=>({id,state,recordedAttempt:1,
 facts:{calls:[],...overrides},attemptHistory:[],strip:null});
const edge=(key,to,flow,targetRunning=true)=>({key,to,flow,targetRunning,points:[{x:0,y:0},{x:280,y:0}]});
const snapshot=(cards,edges)=>({cards,edges,positions:Object.fromEntries(cards.map(c=>[c.id,c]))});
const baseline=snapshot([card('work','running'),card('ask','notStarted'),card('pass','running'),
 card('returned','running'),card('settled','awaiting',{ask:43})],
 [edge('f','work',{state:'waiting'},false),edge('r','returned',{state:'delivered',delivery:{seq:7}})]);
motion.observe(baseline,clock,true);
assert.deepEqual(motion.frame(clock+100,true),[],'existing decisions, delivery and activity stay static');
const call={id:'call',category:'session',start_ms:56};
const active={...card('work','running',{calls:[call],activeCall:'call',now:'session'}),
  strip:{head:.5},attemptHistory:[{calls:[call]}]};
const after=snapshot([active,card('ask','awaiting',{ask:99}),card('pass','passed'),card('returned','returned'),
 card('settled','awaiting',{ask:43})],
 [edge('f','work',{state:'delivered',delivery:{seq:8}}),
  edge('r','returned',{state:'returned',record:{seq:9}},false)]);
motion.observe(after,clock+200,true);
const start=clock+200, events=motion.frame(start,true);
const count=kind=>events.filter(e=>e.kind===kind).length;
assert.deepEqual(Object.fromEntries(['dot','strip','glyph','pass','return','flicker','session','handoff','reverse','halo','drift']
 .map(k=>[k,count(k)])),{dot:1,strip:1,glyph:3,pass:1,return:1,flicker:1,session:1,handoff:1,reverse:1,halo:1,drift:1});
assert.deepEqual(events.filter(e=>e.loop).map(e=>e.kind),['halo','drift']);
for(const [kind,d] of Object.entries({dot:180,strip:220,glyph:280,pass:620,return:620,flicker:320,session:700,handoff:700,reverse:700})){
 const at=(time)=>motion.frame(time,true).filter(event=>event.kind===kind);
 assert(at(start+d-1).length,kind+' still active before deadline');
 assert.equal(at(start+d).length,0,kind+' stops at deadline');
 // Use a fresh timeline for checking the next deadline.
 motion.observe(baseline,0,false);motion.observe(after,start,true);
}
motion.observe(after,start+1500,true);
assert.deepEqual(motion.frame(start+1501,true).map(e=>e.kind),['halo','drift'],'unchanged snapshots do not replay');
const halo=ms=>motion.frame(start+ms,true).find(e=>e.kind==='halo').strength;
let peaks=[];
for(let ms=20;ms<36000;ms+=20)if(halo(ms)>halo(ms-20)&&halo(ms)>halo(ms+20))peaks.push(ms);
assert.deepEqual(peaks.map(p=>Math.floor(p/1000)),[0,1,2,12,24]);
assert(peaks.every((p,i)=>!i||p-peaks[i-1]>=980),'at most one peak per second');
assert.deepEqual(motion.frame(start+12100,false),[],'pause or reduced motion stops all marks immediately');
const stalled=snapshot(after.cards.map(c=>c.id==='work'?{...c,state:'stalled'}:c),
  after.edges.map(e=>({...e,targetRunning:false})));
motion.observe(stalled,start+12100,false);
motion.settle();
assert.deepEqual(motion.frame(start+12110,true).map(e=>e.kind),['halo'],'stalled targets stop drift');
""")

    def test_p4_scene_has_no_cards_or_edges_without_records(self):
        self.run_controller(r"""
const raw={nodes:[],edges:[],decisions:[],final_result:'failed'};
const flow=planFlow(raw);
for(const level of ['overview','detail']){
 const scene=createGraphScene(flow.nodes,layeredLayout(flow.nodes,flow.edges,[],true,{level}),[],level);
 assert.deepEqual(scene.cards,[],'empty run '+level+' P4 expected no cards');
 assert.deepEqual(scene.edges,[],'empty run '+level+' P4 expected no relations');
}
const a={id:'a',kind:'work',status:'passed'};
const data=planFlow({...raw,nodes:[a]});
const layout=layeredLayout(data.nodes,[...data.edges,{from:'a',to:'absent',relation:'hands_over'}]);
const scene=createGraphScene(data.nodes,layout,[],'detail');
assert.deepEqual(scene.cards.map(c=>[c.id,c.kind]),[['a','work'],['_run_checks','goal']]);
assert.deepEqual(scene.edges.map(e=>[e.from,e.to,e.relation,e.gate,e.label]),[['a','_run_checks','hands_over','open','']]);
assert.equal(scene.positions._run_checks.state,'failedFinal');
""")

    def test_p3_current_record_and_retry_history(self):
        self.run_dom(r"""
const api=globalThis.surfaceTest;
const node={...live.nodes[0],kind:'work',status:'rejected',attempts:1,laps:['returned'],returned_reasons:[['Missing case']]};
live={...live,decisions:[],final_result:'failed',nodes:[node]};
for(const actor of [undefined,{role:'historical'},{role:'constructor'}]){
  node.returned_by=actor;api.applyView(structuredClone(live));
  const card=api.nodeCard(node);
  assert.equal(card.dataset.state,'returned','returned work P3 current state');
  assert.match(card.textContent,/Did not pass/);
  assert.doesNotMatch(card.textContent,/Sent back by|Leader|Coordinator/,'returned work P3 actor '+JSON.stringify(actor));
}
node.status='running';node.attempts=2;node.laps.push('current');
api.applyView(structuredClone(live));
const current=api.nodeCard(node);
assert.equal(current.dataset.state,'retrying','retry work P3 current state');
assert(!current.classList.contains('returned-card'));
assert.doesNotMatch(current.textContent,/Did not pass/);
assert.match(get('node-list').textContent,/Missing case/,'retry work P3 failure stays in history');
""")

    def test_p3_current_final_uses_latest_valid_verdict(self):
        current, _ = plan.normalize({"schema_version": 1, "goal": "Check the whole result", "nodes": [
            {"id": "a", "kind": "work", "lane": 1, "grade": "daily", "goal": "Write the result",
             "owns": ["result.txt"], "checks": [{"id": "file", "type": "cmd", "run": "test -s result.txt"}]}]})
        failure = {"seq": 1, "type": "gate.final", "data": {"result": "failed", "failed_checks": ["all"]}}
        retry = {"seq": 2, "type": "node.start", "data": {"node": "a", "attempt": 1}}
        rerun = {"seq": 3, "type": "gate.final", "data": {"result": "unverified"}}
        for events, expected in [([failure], "failed"), ([failure, retry], None),
                                 ([failure, retry, rerun], "unverified")]:
            with self.subTest(events=[event["type"] for event in events]):
                view = server._view(current, state.derive(current, events), events, "/project")
                self.assertEqual(view["final_result"], expected)
                self.assertEqual(view["timeline"][0]["result"], "failed")

    def test_psi1_psi4_state_glyphs_and_words_cover_the_vocabulary(self):
        self.run_dom(r"""
const api=globalThis.surfaceTest, base=live.nodes[0];
const words={
 en:{notStarted:'Not started',running:'Running',reviewing:'Reviewing',retrying:'Retrying',submitted:'Awaiting check',
  passed:'Done',awaiting:'Needs your answer',returned:'Returned',stalled:'No activity'},
 ko:{notStarted:'시작 전',running:'진행 중',reviewing:'검토 중',retrying:'다시 진행 중',submitted:'확인 대기',
  passed:'끝남',awaiting:'답이 필요함',returned:'되돌아옴',stalled:'활동 없음'},
};
const cases={
 notStarted:{status:'pending'}, running:{status:'running',attempts:1},
 reviewing:{kind:'review',status:'running'}, retrying:{status:'running',attempts:2},
 submitted:{status:'submitted'}, verificationPending:{status:'unverified'},
 passed:{status:'passed'}, awaiting:{status:'running',kind:'review'},
 returned:{status:'rejected'}, exhausted:{status:'replan'}, held:{status:'held'},
 preapprovalSubmitted:{status:'submitted',preapproval_submission:true},
 planRevisionState:{status:'held',plan_revision_wait:true},
 failedFinal:{status:'failed',runLevel:true,kind:'goal'},
 stalled:{status:'running',activity:[{stalled:true}]},
};
assert.deepEqual(Object.keys(cases).sort(),[...Object.keys(STATE_VOCABULARY),'stalled'].sort());
for(const language of ['en','ko'])for(const level of ['overview','detail']){
 const signatures = new Map();
 for(const [expected,record] of Object.entries(cases)){
   const id=expected, n={...base,kind:'work',id,laps:[],...record};
   live={...live,language,nodes:[n],decisions:expected==='awaiting'?[{...d,node:id}]:[]};
   api.applyView(structuredClone(live));
   const card=api.nodeCard(n,false,level), glyph=card.querySelector('.status-glyph').textContent;
   const header=card.querySelector('.node-header'), name=words[language][expected]||api.stateWords(expected,language).name;
   const context=language+'/'+level+' '+id;
   assert.equal(card.dataset.state,expected,context+' Psi1 presentation state');
   assert(header['aria-label'].includes(name),context+' Psi1 expected accessible '+name+', observed '+header['aria-label']);
   assert.equal(card.querySelector('.state-word').textContent,name,context+' Psi1 visible state word at both levels');
   // A unique glyph alone is sufficient for an injective signature at either level.
   assert(!signatures.has(glyph),context+' Psi1 expected unique glyph, observed '+glyph+' also on '+signatures.get(glyph));
   signatures.set(glyph,id);
   assert.equal(glyph==='◆',expected==='awaiting',context+' Psi4 expected diamond only for a bound open answer, observed '+glyph);
 }
}
""")
