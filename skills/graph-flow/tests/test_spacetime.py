"""Pure timeline and orthographic pose invariants, with no browser clock."""
import pathlib
import shutil
import subprocess
import unittest


MODULES = pathlib.Path(__file__).resolve().parents[1] / "scripts" / "graphflow"


@unittest.skipUnless(shutil.which("node"), "requires Node.js")
class SpacetimeTests(unittest.TestCase):
    def test_t2_t3_real_intervals_and_shared_gap_scale(self):
        self.run_js("""
const {timeScale,timeMarks}=history;
const {spaceHistory,spaceTicks}=spacetime;
const minute=60_000, day=1440*minute;
const records=[
 {kind:'node.start',seq:1,node:'a',attempt:1,at:minute,time:minute},
 {activity:0,call:'one',phase:'start',category:'tool',node:'a',attempt:1,at:2*minute},
 {activity:1,call:'one',phase:'end',category:'tool',node:'a',attempt:1,at:3*minute},
 {activity:2,call:'two',phase:'start',category:'skill',node:'a',attempt:1,at:4*minute},
 {activity:3,call:'two',phase:'end',category:'skill',node:'a',attempt:1,at:5*minute},
 {kind:'node.submit',seq:2,node:'a',attempt:1,at:5*minute,time:5*minute},
 {kind:'gate.verdict',verdict:'pass',seq:3,node:'a',attempt:1,at:7*minute,time:7*minute},
 {kind:'node.start',seq:4,node:'b',attempt:1,at:day,time:day},
 {kind:'decision.ask',id:'d5',seq:5,node:'b',at:day+minute,time:day+minute},
 {kind:'decision.answer',id:'d5',seq:6,node:'b',at:3*day,time:3*day},
];
const index={start:0,end:3*day,records,busy:[[2*minute,3*minute],[4*minute,5*minute]]};
const axis=timeScale(index);
assert.deepEqual(axis.gaps.map(g=>[g.start,g.end,g.duration]),
  [[7*minute,day,day-7*minute],[day+minute,3*day,2*day-minute]]);
assert(axis.gaps.every(g=>Math.abs((g.to-g.from)/g.duration-axis.rate)<1e-9));
assert.deepEqual(timeMarks(index,axis).filter(m=>m.kind==='break').map(m=>m.duration),axis.gaps.map(g=>g.duration));
for(const at of [0,minute,5*minute,12*minute,day,2*day,3*day])
  assert(Math.abs(axis.fromScale(axis.toScale(at))-at)<.001);
assert.equal(timeScale(index,true).toScale(2*day),2*day);
assert.equal(timeScale({...index,busy:[...index.busy,[7*minute,day]]}).gaps.length,1);
assert(spaceTicks(axis,day).every(t=>t<=day&&!axis.gaps.some(g=>g.start<t&&t<g.end)));

const layout={cards:[{id:'a'},{id:'b'}],edges:[{key:'["a","b","hands_over",""]'}]};
const transfers=[{relation:['a','b','hands_over',''],seq:2,time:new Date(5*minute).toISOString(),visible:7*minute}];
let model=spaceHistory(layout,{at:6*minute,index,axis},transfers);
assert.equal(model.lines.length,0,'T2 a transfer appears only once its record-derived state delivers');
assert.deepEqual(model.pillars[0].segments.filter(s=>['tool','thinking','skill','verify'].includes(s.kind)).map(
  ({kind,start,end})=>[kind,start,end]),[
    ['verify',5*minute,6*minute],['tool',2*minute,3*minute],['thinking',3*minute,4*minute],['skill',4*minute,5*minute]]);
model=spaceHistory(layout,{at:day-5000,index,axis},transfers);
assert.equal(model.lines[0].end,day-5000);
assert.equal(model.lines[0].receiver,null);
assert.deepEqual(model.pillars[0].drop,{start:7*minute,end:day-5000});
assert.equal(model.pillars[1].segments.length,0,'T2 neither a future start nor decision leaks onto the pillar');
model=spaceHistory(layout,{at:3*day,index,axis},transfers);
assert.deepEqual([model.lines[0].start,model.lines[0].end],[5*minute,day]);
assert(model.pillars[0].segments.some(s=>s.end===model.lines[0].start));
assert(model.pillars[1].segments.some(s=>s.start===model.lines[0].end));
for(const pillar of model.pillars)for(const s of pillar.segments)
  assert.deepEqual([s.low,s.high],[axis.toScale(s.start),axis.toScale(s.end)]);
assert(model.pillars[1].segments.some(s=>s.kind==='human'&&s.start===day+minute&&s.end===3*day));
""")

    def test_t4_t5_t6_one_orthographic_scene(self):
        self.run_js("""
const {spaceProjection,transitionPose,VIEW_POSES}=spacetime;
const axis=history.timeScale({start:0,end:60000,records:[],busy:[]});
const box={x:12,y:22,width:900,height:600,scale:.9};
const layout={bounds:{width:680,height:590},cards:[
 {id:'c',x:450,y:40,width:100,height:80,layer:1,order:0},
 {id:'b',x:70,y:340,width:100,height:80,layer:0,order:1},
 {id:'a',x:70,y:20,width:100,height:80,layer:0,order:2}]};
const flat=spaceProjection(layout,box,VIEW_POSES.flat,axis,30000);
for(const card of layout.cards){
  const point=flat.nodeAt(card.id,30000);
  assert(Math.abs(point.x-(box.x+(card.x+card.width/2)*box.scale))<.0001);
  assert(Math.abs(point.y-(box.y+(card.y+card.height/2)*box.scale))<.0001);
}
const side=spaceProjection(layout,box,VIEW_POSES.side,axis,30000);
assert.deepEqual([...side.cards.keys()],['a','b','c']);
assert.equal(side.plane.opacity,0);
assert.equal(new Set(layout.cards.map(c=>side.nodeAt(c.id,30000).y)).size,1);
assert(side.nodeAt('a',30000).y<side.nodeAt('a',20000).y);
assert(side.nodeAt('a',20000).y>side.nodeAt('a',30000).y);
const endpoints=[VIEW_POSES.flat,VIEW_POSES.space,VIEW_POSES.side];
for(let i=0;i<2;i++){
  let prior;
  for(let t=0;t<=900;t+=15){
    const pose=transitionPose(endpoints[i],endpoints[i+1],t,900);
    const projection=spaceProjection(layout,box,pose,axis,30000);
    if(prior)for(const id of projection.cards.keys()){
      const a=prior.nodeAt(id,30000),b=projection.nodeAt(id,30000);
      assert(Math.hypot(a.x-b.x,a.y-b.y)<18);
    }
    if(t===900)assert.deepEqual(pose,endpoints[i+1]);
    prior=projection;
  }
}
""")

    def run_js(self, script):
        result = subprocess.run(["node", "--input-type=module", "-e", """
            import assert from 'node:assert/strict';
            import {readFileSync} from 'node:fs';
            const load=name=>import('data:text/javascript;base64,'+readFileSync(process.argv[1]+'/'+name+'.js').toString('base64'));
            const [history,spacetime]=await Promise.all(['history','spacetime'].map(load));
            """ + script, str(MODULES)], text=True, capture_output=True)
        self.assertEqual(result.returncode, 0, result.stderr)
