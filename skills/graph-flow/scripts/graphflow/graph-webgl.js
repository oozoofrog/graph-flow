import {
  BufferGeometry, CircleGeometry, DoubleSide, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial,
  OrthographicCamera, Scene, Vector3, WebGLRenderer,
} from 'three';
import {LineMaterial} from './vendor/three/examples/jsm/lines/LineMaterial.js';
import {LineSegments2} from './vendor/three/examples/jsm/lines/LineSegments2.js';
import {LineSegmentsGeometry} from './vendor/three/examples/jsm/lines/LineSegmentsGeometry.js';

function stroke(geometry, material, order) {
  const line = new LineSegments2(geometry, material);
  line.renderOrder = order;
  return line;
}

function pathGeometry(paths) {
  const segments = paths.flatMap(points => points.slice(1).flatMap((end, i) => {
    const start = points[i];
    return [start.x, -start.y, 0, end.x, -end.y, 0];
  }));
  return new LineSegmentsGeometry().setPositions(segments);
}
const routeGeometry = points => pathGeometry([points]);

export function createWebGLGraph(canvas, onLoss, preserveDrawingBuffer, miniCanvas) {
  const context = canvas.getContext('webgl2', {alpha:true, antialias:true, preserveDrawingBuffer});
  if (!context) return null;
  const renderer = new WebGLRenderer({canvas, context, alpha:true, antialias:true, preserveDrawingBuffer});
  const camera = new OrthographicCamera(0, 1, 0, -1, 0, 2000);
  const scene = new Scene();
  const graph = new Group();
  const bands = new Group();
  const handoffs = new Group();
  scene.add(graph);
  scene.add(bands);
  scene.add(handoffs);
  const bandMaterial = new LineMaterial({color:0x31465e,linewidth:1.3,depthTest:false});
  const currentMaterial = bandMaterial.clone();
  const flowMaterials = {
    ordinary:new LineMaterial({color:0x405972,linewidth:1.7,depthTest:false}),
    emphasis:new LineMaterial({color:0x233f60,linewidth:2.6,depthTest:false}),
  };
  const pulseGeometry = new CircleGeometry(4,16);
  const pulseMaterial = new MeshBasicMaterial({color:0x294da9,depthTest:false});
  const color = 0x607287;
  const contextColor = 0x748090;
  const underlay = new LineMaterial({linewidth:6});
  const markerStroke = new LineMaterial({color, linewidth:1.7});
  const markerFill = new MeshBasicMaterial({color, side:DoubleSide});
  const gates = Object.fromEntries(Object.entries({
    open: [], closed: [12, 6], waiting_for_you: [3, 6], returned: [12, 5, 2, 5],
  }).map(([gate, pattern]) => {
    const material = new LineMaterial({color, linewidth:2, dashed:pattern.length > 0});
    if (pattern.length) {
      const [dash, gap, short = 0, tail = 0] = pattern;
      material.dashSize = dash;
      material.gapSize = gap;
      if (short) {
        material.fragmentShader = material.fragmentShader.replace(
          'if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard;',
          `float phase = mod( vLineDistance + dashOffset, ${dash + gap + short + tail}.0 );
           if ((phase > ${dash}.0 && phase < ${dash + gap}.0) || phase > ${dash + gap + short}.0) discard;`,
        );
      }
    }
    return [gate, material];
  }));
  const contextGates = Object.fromEntries(Object.entries(gates).map(([gate,material])=>{
    const dim = material.clone();
    dim.color.set(contextColor);
    return [gate,dim];
  }));
  const pathGates = Object.fromEntries(Object.entries(gates).map(([gate,material])=>{
    const emphasis = material.clone();
    emphasis.linewidth = 3;
    return [gate,emphasis];
  }));
  const contextStroke = markerStroke.clone();
  contextStroke.color.set(contextColor);
  const contextFill = markerFill.clone();
  contextFill.color.set(contextColor);
  let drawnLayout, strokes = [], markers = [], currentBand, frame, frames = 0, firstFrame, frameTime, minimap;
  let activePulses = [];
  let miniFailed = false;

  function markerFor(mark) {
    const points = mark.paths.map(path => path.map(([x,y]) => ({x:x-10,y:y-5})));
    if (mark.fill) {
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(points[0].flatMap(({x,y}) => [x,-y,0]), 3));
      return new Mesh(geometry, markerFill);
    } else {
      const segments = points.flatMap(path => path.slice(1).flatMap((end,i) =>
        [path[i].x,-path[i].y,0,end.x,-end.y,0]));
      return stroke(new LineSegmentsGeometry().setPositions(segments), markerStroke, 0);
    }
    return marker;
  }

  function rebuild(layout, marks) {
    const oldGeometry = new Set();
    graph.traverse(object => { if (object.geometry) oldGeometry.add(object.geometry); });
    bands.traverse(object => { if (object.geometry) oldGeometry.add(object.geometry); });
    for (const geometry of oldGeometry) geometry.dispose();
    graph.clear();
    bands.clear();
    strokes = layout.strokes.map(model => {
      const geometry = routeGeometry(model.points);
      const line = stroke(geometry, gates[model.gate], 0).computeLineDistances();
      const distances = geometry.attributes.instanceDistanceStart.data.array;
      for (let i=0;i<distances.length;i++) distances[i]+=model.distance;
      const backdrop = stroke(geometry, underlay, 0);
      graph.add(backdrop,line);
      return {model,line,backdrop};
    });
    markers = layout.markers.map(model => {
      const marker = markerFor(marks[model.relation]);
      const [a,b] = model.points;
      marker.position.set(b.x,-b.y,0);
      marker.rotation.z = Math.atan2(a.y-b.y,b.x-a.x);
      graph.add(marker);
      return {model,marker};
    });
    for(const {cue,paths} of layout.flowMarks){
      const material=cue==='delivered'||cue==='frontier'?flowMaterials.emphasis:flowMaterials.ordinary;
      graph.add(stroke(pathGeometry(paths),material,layout.strokes.length*2+4));
    }
    const segments = layout.cards.flatMap(card => card.band?.segments ?? []);
    const paths = segments.flatMap(segment => segment.animate ? segment.paths.slice(1) : segment.paths);
    const current = segments.filter(segment=>segment.animate).map(segment=>segment.paths[0]);
    if(paths.length)bands.add(stroke(pathGeometry(paths),bandMaterial,1));
    currentBand = current.length ? stroke(pathGeometry(current),currentMaterial,2) : null;
    if(currentBand)bands.add(currentBand);
    drawnLayout = layout;
  }

  function draw(layout, box, marks, order, pulses) {
    const start = performance.now();
    if (drawnLayout !== layout) rebuild(layout, marks);
    const {width,height,scale,x,y,dpr,background,bandVisible,bandMotion} = box;
    bands.visible = bandVisible;
    currentMaterial.linewidth = bandMaterial.linewidth + bandMotion;
    if (!frame || frame.dpr !== dpr) renderer.setPixelRatio(dpr);
    if (!frame || frame.dpr !== dpr || frame.width !== width || frame.height !== height) renderer.setSize(width,height);
    camera.position.set(-x/scale,y/scale,1000);
    camera.right = width/scale;
    camera.bottom = -height/scale;
    camera.updateProjectionMatrix();
    underlay.color.set(background);
    for (const family of [gates,contextGates,pathGates])for(const material of Object.values(family))material.dashScale=scale;
    for (const {model,line,backdrop} of strokes) {
      const {weight,base,ink}=order.strokes.get(model.id);
      line.material = (weight==='path'?pathGates:weight==='context'?contextGates:gates)[model.gate];
      backdrop.renderOrder=base;
      line.renderOrder=ink;
    }
    for (const {model,marker} of markers) {
      const {weight,ink}=order.markers.get(model.id);
      const dimmed=weight==='context';
      marker.renderOrder=ink;
      marker.material = marker.isLineSegments2 ? (dimmed?contextStroke:markerStroke) : (dimmed?contextFill:markerFill);
      marker.scale.setScalar((weight==='path'?1.7:1.4)/scale);
    }
    while(handoffs.children.length<pulses.length){
      const pulse=new Mesh(pulseGeometry,pulseMaterial);
      pulse.renderOrder=layout.strokes.length*2+5;
      handoffs.add(pulse);
    }
    for(const [i,mesh] of handoffs.children.entries()){
      const point=pulses[i];
      mesh.visible=!!point;
      if(point){
        mesh.position.set(point.x,-point.y,0);
        mesh.scale.setScalar(1/scale);
      }
    }
    activePulses=pulses;
    renderer.render(scene,camera);
    frame = box;
    frames++;
    frameTime = performance.now()-start;
    firstFrame ??= performance.now();
  }

  function describe() {
    if (!frame) return {strokes:[],markers:[]};
    const {width,height} = frame;
    const project = point => {
      point.project(camera);
      return {x:(point.x+1)*width/2,y:(1-point.y)*height/2};
    };
    const shafts = strokes.map(({model,line,backdrop}) => {
      const {instanceStart, instanceEnd} = line.geometry.attributes;
      const world = (attribute,i) => line.localToWorld(new Vector3().fromBufferAttribute(attribute,i));
      const points = [project(world(instanceStart,0))];
      for(let i=0;i<instanceEnd.count;i++) points.push(project(world(instanceEnd,i)));
      return {id:model.id,gate:model.gate,points,visible:line.visible,
        order:line.renderOrder,underlay:backdrop.renderOrder,
        width:line.material.linewidth,color:'#'+line.material.color.getHexString()};
    });
    const heads = markers.map(({model,marker})=>({
      id:model.id,relation:model.relation,visible:marker.visible,order:marker.renderOrder,
      points:[-1,0].map(x=>project(marker.localToWorld(new Vector3(x,0,0)))),
    }));
    return {strokes:shafts,markers:heads,
      flowMarks:drawnLayout.flowMarks.map(({id,cue})=>({id,cue})),activePulses};
  }

  canvas.addEventListener('webglcontextlost', () => {
    onLoss();
    renderer.dispose();
    minimap?.dispose();
  }, {once:true});
  return {draw, describe, describeMinimap:()=>minimap?.describe()??[], diagnostics:() => ({frames,firstFrame,frameTime}),
    drawMinimap(next) {
      if (!next || miniFailed) return false;
      try {
        minimap ||= createWebGLMinimap(miniCanvas);
        if (!minimap) { miniFailed = true; return false; }
        return minimap.draw(next);
      } catch {
        minimap?.dispose();
        miniFailed = true;
        return false;
      }
    }};
}

function rectangle({x,y,width,height}) {
  return routeGeometry([
    {x,y},{x:x+width,y},{x:x+width,y:y+height},{x,y:y+height},{x,y},
  ]);
}

function createWebGLMinimap(canvas) {
  const context = canvas.getContext('webgl2',{alpha:true,antialias:true});
  if (!context) return null;
  const renderer = new WebGLRenderer({canvas,context,alpha:true,antialias:true});
  const camera = new OrthographicCamera(0,1,0,-1,0,20);
  camera.position.z = 10;
  const scene = new Scene(), marks = new Group();
  const outlineMaterial = new LineMaterial({color:0x345bc1,linewidth:1.5});
  let outline, previous;
  let lost = false;
  canvas.addEventListener('webglcontextlost',()=>{lost=true;renderer.dispose();},{once:true});
  scene.add(marks);
  function draw(frame) {
    if (lost) return false;
    const {width,height,dpr} = frame;
    if (!previous || previous.dpr !== dpr) {
      renderer.setPixelRatio(dpr);
      renderer.setSize(width,height,false);
      camera.right = width;
      camera.bottom = -height;
      camera.updateProjectionMatrix();
    }
    if (previous?.marks !== frame.marks) {
      for (const mesh of marks.children) {
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      marks.clear();
      for (const {id,points,color} of frame.marks) {
        const triangles = points.slice(2).flatMap((end,i)=>
          [points[0],points[i+1],end].flatMap(([x,y])=>[x,-y,0]));
        const geometry = new BufferGeometry();
        geometry.setAttribute('position',new Float32BufferAttribute(triangles,3));
        const mark = new Mesh(geometry,new MeshBasicMaterial({color,side:DoubleSide}));
        mark.name = id;
        marks.add(mark);
      }
    }
    if (outline) {
      scene.remove(outline);
      outline.geometry.dispose();
    }
    outline = stroke(rectangle(frame.window),outlineMaterial,1);
    outline.position.z = 1;
    scene.add(outline);
    renderer.render(scene,camera);
    previous = frame;
    return true;
  }
  return {draw,describe:()=>marks.children.map(mark=>mark.name),dispose:()=>renderer.dispose()};
}
