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

    def test_f1_activity_band_matches_phases_and_stays_inside_card(self):
        self.run_controller("""
const {activityBand, ACTIVITY_SHAPES} = await import('data:text/javascript;base64,' + Buffer.from(source).toString('base64'));
const categories = Object.keys(ACTIVITY_SHAPES).slice(0,7);
const card = {x:32,y:25,width:156,height:110,state:'running'};
const phases = [0,1,2,3,4,50,100,0,0,30,0,200].map((duration_ms,i)=>({
  id:String(i+1),category:categories[i%7],duration_ms,errors:i===6?1:0
}));
const attempt = {phases,latest:phases.at(-1).category};
const input = {status:'running',activity:[attempt]};
const {x,width,segments} = activityBand(input,card);
assert.deepEqual(segments.map(({id,category,errors})=>({id,category,errors})),
  phases.map(({id,category,errors})=>({id,category,errors})));
// Solve for a common duration scale independently of the layout's sort-and-clamp algorithm.
let lo=0,hi=width;
for(let i=0;i<64;i++){
  const mid=(lo+hi)/2;
  if(phases.reduce((sum,p)=>sum+Math.max(7,p.duration_ms*mid),0)>width)hi=mid;else lo=mid;
}
for(const [i,segment] of segments.entries()){
  assert(Math.abs(segment.width-Math.max(7,phases[i].duration_ms*lo))<1);
  for(const point of segment.paths.flat()){
    assert(point.x>=segment.x&&point.x<=segment.x+segment.width);
    assert(point.y>=card.y+card.height-30&&point.y<card.y+card.height);
  }
}
assert(Math.abs(segments.at(-1).x+segments.at(-1).width-x-width)<1);
assert.deepEqual(segments.filter(s=>s.animate).map(s=>s.id),['12']);
for(const overrides of [{stalled:true},{repeating:true}]){
  assert(!activityBand({...input,activity:[{...attempt,...overrides}]},card).segments.some(s=>s.animate));
}
assert(!activityBand(input,{...card,state:'awaiting'}).segments.some(s=>s.animate));
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
const cases={
 notStarted:{status:'pending'}, running:{status:'running',attempts:1},
 reviewing:{kind:'review',status:'running'}, retrying:{status:'running',attempts:2},
 submitted:{status:'submitted'}, verificationPending:{status:'unverified'},
 passed:{status:'passed'}, awaiting:{status:'running',kind:'review'},
 returned:{status:'rejected'}, exhausted:{status:'replan'}, held:{status:'held'},
 preapprovalSubmitted:{status:'submitted',preapproval_submission:true},
 planRevisionState:{status:'held',plan_revision_wait:true},
 failedFinal:{status:'failed',runLevel:true,kind:'goal'},
};
assert.deepEqual(Object.keys(cases).sort(),Object.keys(STATE_VOCABULARY).sort());
for(const language of ['en','ko'])for(const level of ['overview','detail']){
 const signatures = new Map();
 for(const [expected,record] of Object.entries(cases)){
   const id=expected, n={...base,kind:'work',id,laps:[],...record};
   live={...live,language,nodes:[n],decisions:expected==='awaiting'?[{...d,node:id}]:[]};
   api.applyView(structuredClone(live));
   const card=api.nodeCard(n,false,level), glyph=card.querySelector('.status-glyph').textContent;
   const header=card.querySelector('.node-header'), name=api.stateWords(expected,language).name;
   const context=language+'/'+level+' '+id;
   assert.equal(card.dataset.state,expected,context+' Psi1 presentation state');
   assert(header['aria-label'].includes(name),context+' Psi1 expected accessible '+name+', observed '+header['aria-label']);
   if(level==='detail')assert(card.querySelector('.node-status').textContent.includes(name),context+' Psi1 expected visible '+name);
   // A unique glyph alone is sufficient for an injective signature at either level.
   assert(!signatures.has(glyph),context+' Psi1 expected unique glyph, observed '+glyph+' also on '+signatures.get(glyph));
   signatures.set(glyph,id);
   assert.equal(glyph==='◆',expected==='awaiting',context+' Psi4 expected diamond only for a bound open answer, observed '+glyph);
 }
}
""")
