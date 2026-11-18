"""Geometric invariants of the DOM-free layered router, including the scratch ro plan."""
import json
import os
import pathlib
import shutil
import subprocess
import unittest

ROOT=pathlib.Path(__file__).resolve().parents[1]

@unittest.skipUnless(shutil.which('node'), 'Node is required to execute the JavaScript layout')
class LayoutTests(unittest.TestCase):
    def check_graph(self, data):
        name = data.get('name') or self._testMethodName.removeprefix('test_')
        data = {**data, 'name': name}
        script=r'''
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {pathToFileURL} from 'node:url';
const source=readFileSync(process.argv[2],'utf8');
const {layeredLayout,roundedRoute,compactOverview,createGraphScene}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const data=JSON.parse(process.argv[3]);
const {routeMetrics,exceedsRatchet}=await import(pathToFileURL(process.argv[4]));
const ratchets=JSON.parse(readFileSync(process.argv[5])).layout;
for(const level of ['detail','overview']) {
const options={level,wrapLongChains:!!data.wrapLongChains};
const layout=layeredLayout(data.nodes,data.edges,[],true,options);
const portGap=level==='overview'?8:14;
const model=createGraphScene(data.nodes,layout,[],level);
const shared=(r,other)=>model.strokes.some(p=>p.members.includes(String(r.index))&&p.members.includes(String(other.index)));
const overlap=(a,b)=>a.x<b.x+b.width&&a.x+a.width>b.x&&a.y<b.y+b.height&&a.y+a.height>b.y;
const segments=r=>r.points.slice(1).map((p,i)=>[r.points[i],p]);
const enters=(a,b,c)=>a.x===b.x?a.x>c.x&&a.x<c.x+c.width&&Math.max(a.y,b.y)>c.y&&Math.min(a.y,b.y)<c.y+c.height:a.y>c.y&&a.y<c.y+c.height&&Math.max(a.x,b.x)>c.x&&Math.min(a.x,b.x)<c.x+c.width;
const rects=[...layout.cardRects,...layout.chips];
rects.forEach((a,i)=>rects.slice(i+1).forEach(b=>assert(!overlap(a,b),'rectangles overlap')));
assert.equal(layout.routes.length,data.edges.length);
for(const r of layout.routes){
 const a=layout.positions[r.from],b=layout.positions[r.to];
 assert.equal(r.start.x,a.x+a.width);assert.equal(r.end.x,b.x);
 assert(r.end.y>b.y&&r.end.y<b.y+b.height,'arrowhead touches the target edge');
 assert.deepEqual(r.points.at(-1),r.end);
 assert(r.points.at(-2).x<r.end.x,'arrowhead approaches in the direction of meaning');
 assert(roundedRoute(r.points).endsWith(`L${r.end.x} ${r.end.y}`));
 for(const [p,q] of segments(r)){
   assert(p.x===q.x||p.y===q.y,'all segments must be orthogonal');
   for(const c of layout.cardRects)assert(!enters(p,q,c),'route enters card '+c.id+' '+JSON.stringify(r));
 }
}
// Separate ports and segments remain mandatory unless the scene owns an intentional shared trunk.
layout.routes.forEach((r,i)=>layout.routes.slice(i+1).forEach(other=>{
 if(shared(r,other))return;
 if(r.from===other.from)assert(Math.abs(r.start.y-other.start.y)>=portGap,'outgoing tracks need separate ports');
 if(r.to===other.to)assert(Math.abs(r.end.y-other.end.y)>=portGap,'incoming tracks need separate ports');
 for(const [a,b] of segments(r))for(const [c,d] of segments(other)){
  if(a.x===b.x&&c.x===d.x&&a.x===c.x)assert(Math.min(Math.max(a.y,b.y),Math.max(c.y,d.y))<=Math.max(Math.min(a.y,b.y),Math.min(c.y,d.y)),'vertical overlap');
  if(a.y===b.y&&c.y===d.y&&a.y===c.y)assert(Math.min(Math.max(a.x,b.x),Math.max(c.x,d.x))<=Math.max(Math.min(a.x,b.x),Math.min(c.x,d.x)),'horizontal overlap');
 }
}));
const intervals=parts=>{
 const runs=new Map();
 for(const part of parts)for(const [a,b] of segments(part)){
   assert((a.x===b.x)!==(a.y===b.y),'one axis changes per physical segment');
   const flat=a.y===b.y,key=flat?'y'+a.y:'x'+a.x,p=flat?a.x:a.y,q=flat?b.x:b.y;
   const run=runs.get(key)||[];
   run.push([Math.min(p,q),Math.max(p,q)]);runs.set(key,run);
 }
 return [...runs].sort(([a],[b])=>a.localeCompare(b)).map(([key,parts])=>{
   const merged=[];
   for(const [start,end] of parts.sort(([a],[b])=>a-b)){
     const next=merged.at(-1);
     assert(!next||start>=next[1],'ink is painted only once per edge at '+key);
     if(next&&start===next[1])next[1]=end;else merged.push([start,end]);
   }
   return [key,merged];
 });
};
intervals(model.strokes);
for(const edge of model.edges){
 const physical=model.strokes.filter(p=>p.members.includes(edge.id));
 assert.deepEqual(intervals(physical),intervals([edge]),'P2 ink covers the individual relation '+edge.id);
 const marks=model.markers.filter(p=>p.members.includes(edge.id));
 assert.equal(marks.filter(p=>p.members.length===1).length,1,'P2 one individual marker per relation');
 assert(marks.every(p=>p.relation===edge.style.relation&&p.points[0].x<p.points[1].x),'P2 marker kind and direction');
}
for(const part of model.strokes.filter(p=>p.members.length>1)){
 const edges=part.members.map(id=>model.edges.find(e=>e.id===id)),first=edges[0];
 const sameFrom=edges.every(e=>e.from===first.from)&&new Set(edges.map(e=>e.to)).size===edges.length;
 const sameTo=edges.every(e=>e.to===first.to)&&new Set(edges.map(e=>e.from)).size===edges.length;
 assert(sameFrom||sameTo,'P2 common endpoint with unique branches');
 assert(edges.every(e=>e.style.gate===part.gate&&e.style.relation===first.style.relation&&e.label===first.label),
   'P2 paint shares one relation, gate and label');
}
if(data.name==='dense_layers')assert(model.strokes.some(part=>part.members.length>1),'dense layers exercise shared ink');
assert.deepEqual(layout,layeredLayout(data.nodes,data.edges,[],true,options),'determinism');
for(const n of data.nodes)assert.deepEqual(layout.cardRects,layeredLayout(data.nodes,data.edges,[{id:'d1',node:n.id}],true,{...options,expanded:n.id,heights:{[n.id]:999},maxHeight:10}).cardRects,'selection, evidence and viewport cannot change geometry');
const changed=data.nodes.map(n=>({...n,status:'running',attempts:3,laps:['returned','returned','current']}));
assert.deepEqual(layout.cardRects,layeredLayout(changed,data.edges.map(e=>({...e,gate:'returned'})),[],true,options).cardRects,'status polling cannot move cards');
for(const layer of layout.layers)assert.equal(new Set(layer.map(id=>layout.positions[id].width)).size,1);
if(level==='overview')assert.equal(layout.chips.length,0);
const sceneFor=width=>{
  const base=layeredLayout(data.nodes,data.edges,[],true,options);
  return createGraphScene(data.nodes,width?compactOverview(base,width):base,[],level);
};
for(const width of level==='overview'&&data.wrapLongChains?[0,1000,319]:[0]){
 const scene=sceneFor(width), context=(data.name || data.nodes.map(n=>n.id).join(','))+'/'+level+'/'+width;
 const metrics=routeMetrics(scene);
 if(process.env.ROUTING_REPORT==='1')console.log(context,JSON.stringify(metrics));
 assert(ratchets[context],context+' missing route ratchet');
 assert(!exceedsRatchet(metrics,ratchets[context]),context+' M2 route ratchet '+metrics+' exceeds '+ratchets[context]);
 assert.deepEqual(scene,sceneFor(width),context+' M4 same records and dimensions give the same scene');
 const ids=scene.cards.map(c=>c.id);
 assert.deepEqual(ids.sort(),data.nodes.map(n=>n.id).sort(),context+' M3 card ids match the input');
 const relations=edges=>edges.map(({from,to,relation,gate,label})=>[from,to,relation,gate||null,label||'']).sort();
 assert.deepEqual(relations(scene.edges),relations(data.edges),context+' P4 relation identities match the input');
 for(const [i,a] of scene.cards.entries())for(const b of scene.cards.slice(i+1)){
   assert(!overlap(a,b),context+' M2 expected disjoint cards, observed '+JSON.stringify([a,b]));
 }
 for(const edge of scene.edges){
   const a=scene.positions[edge.from],b=scene.positions[edge.to];
   const identity=context+' edge '+edge.id+' '+a.id+' → '+b.id;
   assert(a.layer<b.layer&&a.order<b.order,identity+' M1 expected forward layers and order, observed '+JSON.stringify([a,b]));
   for(const [p,q] of segments(edge))for(const c of scene.cards.filter(c=>c.id!==a.id&&c.id!==b.id)){
     assert(!enters(p,q,c),identity+' M2 expected clear interior, observed '+JSON.stringify({segment:[p,q],card:c}));
   }
 }
}
}
'''
        result=subprocess.run([shutil.which('node'),'--input-type=module','-',str(ROOT/'scripts/graphflow/page.js'),json.dumps(data),
                               str(ROOT/'tests/fixtures/routing_metrics.mjs'),str(ROOT/'tests/fixtures/routing_ratchets.json')],
                              input=script,text=True,capture_output=True)
        if os.environ.get('ROUTING_REPORT') == '1':
            print(result.stdout, end='')
        self.assertEqual(result.returncode,0,result.stderr)

    def graph(self, ids, pairs):
        return {'nodes':[{'id':n,'title':n,'kind':'work'} for n in ids], 'edges':[{'from':a,'to':b,'label':'결과','relation':'hands_over'} for a,b in pairs]}

    def test_chain(self):
        self.check_graph(self.graph('abcd',[('a','b'),('b','c'),('c','d')]))

    def test_diamond(self):
        self.check_graph(self.graph('abcd',[('a','b'),('a','c'),('b','d'),('c','d')]))

    def test_fan_out_five(self):
        self.check_graph(self.graph('abcdef',[('a',n) for n in 'bcdef']))

    def test_fan_in_five(self):
        self.check_graph(self.graph('abcdef',[(n,'f') for n in 'abcde']))

    def test_span_three_layers(self):
        self.check_graph(self.graph('abcd',[('a','b'),('b','c'),('c','d'),('a','d')]))

    def test_two_relations_one_pair(self):
        data=self.graph('ab',[('a','b')]);data['nodes'][1].update(kind='review',target='a')
        data['edges'].append({'from':'a','to':'b','relation':'reviews'})
        self.check_graph(data)

    def test_real_ro_plan(self):
        self.check_graph(json.loads((ROOT/'tests/fixtures/real_layout.json').read_text()))

    def test_dense_layers(self):
        self.check_graph(self.graph('abcdefghi',[(a,b) for layer in [('abc','def'),('def','ghi')] for a in layer[0] for b in layer[1]]))

    def test_large_fans_keep_ports_available_at_both_levels(self):
        ids=['n'+str(i) for i in range(30)]
        self.check_graph({**self.graph(ids,[(ids[0],n) for n in ids[1:]]), 'name':'large_fan_out'})
        self.check_graph({**self.graph(ids,[(n,ids[-1]) for n in ids[:-1]]), 'name':'large_fan_in'})

    def test_long_chain_reuses_ports_in_unrelated_channels(self):
        ids=['n'+str(i) for i in range(60)]
        self.check_graph(self.graph(ids,list(zip(ids,ids[1:]))))

    def test_thirty_piece_overview_wraps_without_collisions(self):
        ids=["step"+str(i) for i in range(31)]
        data=self.graph(ids,list(zip(ids,ids[1:])))
        data["wrapLongChains"]=True
        self.check_graph(data)

    def test_mixed_fan_uses_separate_gates_kinds_and_labels(self):
        data=self.graph('abcdefg',[('a',n) for n in 'bcdefg'])
        for edge, attrs in zip(data['edges'], [{}, {}, {'gate':'open'}, {'gate':'returned'},
                                               {'relation':'reviews'}, {'label':'Other result'}]):
            edge.update(attrs)
        self.check_graph(data)
