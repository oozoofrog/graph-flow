"""Record and presentation assertions for the dashboard graph."""
import unittest

import test_page
from graphflow import plan, server, state


class GraphVisualizationTests(unittest.TestCase):
    run_controller = test_page.PageTests.run_controller
    run_dom = test_page.PageTests.run_dom

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
