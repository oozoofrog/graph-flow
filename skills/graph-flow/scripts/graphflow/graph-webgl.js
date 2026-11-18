import {
  BufferGeometry, DoubleSide, Float32BufferAttribute, Group, Mesh, MeshBasicMaterial,
  OrthographicCamera, PlaneGeometry, Scene, Vector3, WebGLRenderer,
} from 'three';
import {LineMaterial} from './vendor/three/examples/jsm/lines/LineMaterial.js';
import {LineSegments2} from './vendor/three/examples/jsm/lines/LineSegments2.js';
import {LineSegmentsGeometry} from './vendor/three/examples/jsm/lines/LineSegmentsGeometry.js';

function stroke(geometry, material, order) {
  const line = new LineSegments2(geometry, material);
  line.renderOrder = order;
  return line;
}

function routeGeometry(points) {
  const segments = points.slice(1).flatMap((end, i) => {
    const start = points[i];
    return [start.x, -start.y, 0, end.x, -end.y, 0];
  });
  return new LineSegmentsGeometry().setPositions(segments);
}

export function createWebGLGraph(canvas, onLoss, preserveDrawingBuffer, miniCanvas) {
  const context = canvas.getContext('webgl2', {alpha:true, antialias:true, preserveDrawingBuffer});
  if (!context) return null;
  const renderer = new WebGLRenderer({canvas, context, alpha:true, antialias:true, preserveDrawingBuffer});
  const camera = new OrthographicCamera(0, 1, 0, -1, 0, 2000);
  const scene = new Scene();
  const graph = new Group(), plates = new Group();
  scene.add(graph);
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
  const plateFill = new MeshBasicMaterial({color:0xe9eef4,side:DoubleSide});
  const plateStroke = new LineMaterial({color:contextColor,linewidth:1.25});
  let drawnLayout, edges = [], frame, frames = 0, firstFrame, frameTime, minimap;
  let miniFailed = false;

  function markerFor(mark) {
    const marker = new Group();
    const points = mark.paths.map(path => path.map(([x,y]) => ({x:x-10,y:y-5})));
    if (mark.fill) {
      const geometry = new BufferGeometry();
      geometry.setAttribute('position', new Float32BufferAttribute(points[0].flatMap(({x,y}) => [x,-y,0]), 3));
      marker.add(new Mesh(geometry, markerFill));
    } else {
      const segments = points.flatMap(path => path.slice(1).flatMap((end,i) =>
        [path[i].x,-path[i].y,0,end.x,-end.y,0]));
      marker.add(stroke(new LineSegmentsGeometry().setPositions(segments), markerStroke, 0));
    }
    return marker;
  }

  function rebuild(layout, marks) {
    const oldGeometry = new Set();
    graph.traverse(object => { if (object.geometry) oldGeometry.add(object.geometry); });
    for (const geometry of oldGeometry) geometry.dispose();
    graph.clear();
    plates.clear();
    graph.add(plates);
    if(layout.level==='detail')for(const card of layout.cards.filter(card=>card.attempts)){
      const {id,x,y,width,height,attempts}=card;
      const outline = rectangle({x:x+2,y:y+2,width:width-4,height:height-4});
      const fill = new PlaneGeometry(width-4,height-4);
      const stack = new Group();
      stack.name = id;
      for(let index=1;index<=attempts;index++){
        const plate = new Group(), face = new Mesh(fill,plateFill);
        face.position.set(x+width/2,-y-height/2,0);
        plate.position.z = -index*20;
        plate.add(face,stroke(outline,plateStroke,1));
        stack.add(plate);
      }
      plates.add(stack);
    }
    edges = layout.edges.map((edge, index) => {
      const {points, style:{relation,gate}} = edge;
      const guide = routeGeometry(points);
      const group = new Group();
      const line = stroke(guide, gates[gate], index*3+1).computeLineDistances();
      const marker = markerFor(marks[relation]);
      const b = points.at(-1), a = points.at(-2);
      marker.position.set(b.x,-b.y,0);
      marker.rotation.z = Math.atan2(a.y-b.y,b.x-a.x);
      marker.children[0].renderOrder = index*3+2;
      group.add(stroke(guide, underlay, index*3), line, marker);
      graph.add(group);
      return {id:edge.id,gate,relation,group,line,marker};
    });
    drawnLayout = layout;
  }

  function draw(layout, box, marks, focus) {
    const start = performance.now();
    if (drawnLayout !== layout) rebuild(layout, marks);
    const {width,height,scale,x,y,dpr,background} = box;
    if (!frame || frame.dpr !== dpr) renderer.setPixelRatio(dpr);
    if (!frame || frame.dpr !== dpr || frame.width !== width || frame.height !== height) renderer.setSize(width,height);
    const angle = box.tilt ? Math.PI/10 : 0;
    const cos = Math.cos(angle), sin = Math.sin(angle);
    // Keep the z=0 plane registered with the DOM while revealing depth along y.
    graph.scale.y = 1/cos;
    camera.rotation.x = angle;
    camera.position.set(-x/scale,y/(scale*cos)-1000*sin,1000*cos);
    camera.right = width/scale;
    camera.bottom = -height/scale;
    camera.updateProjectionMatrix();
    underlay.color.set(background);
    for (const family of [gates,contextGates,pathGates])for(const material of Object.values(family))material.dashScale=scale;
    for (const {id, gate, group, line, marker} of edges) {
      const emphasized = focus?.edges.has(id);
      const dimmed = box.focusId && !emphasized;
      line.material = (emphasized?pathGates:dimmed?contextGates:gates)[gate];
      group.renderOrder = marker.renderOrder = emphasized ? 1 : 0;
      group.position.z = emphasized ? 12 : 0;
      const mark=marker.children[0];
      mark.material = mark.isLineSegments2 ? (dimmed?contextStroke:markerStroke) : (dimmed?contextFill:markerFill);
      marker.scale.setScalar((emphasized?1.7:1.4)/scale);
    }
    plates.visible = box.tilt;
    renderer.render(scene,camera);
    frame = box;
    frames++;
    frameTime = performance.now()-start;
    firstFrame ??= performance.now();
  }

  function describe() {
    if (!frame) return [];
    const {width,height} = frame;
    const project = point => {
      point.project(camera);
      return {x:(point.x+1)*width/2,y:(1-point.y)*height/2};
    };
    return edges.map(({id, gate, relation, line, group}) => {
      const {instanceStart, instanceEnd} = line.geometry.attributes;
      const world = (attribute,i) => line.localToWorld(new Vector3().fromBufferAttribute(attribute,i));
      const points = [project(world(instanceStart,0))];
      for(let i=0;i<instanceEnd.count;i++) points.push(project(world(instanceEnd,i)));
      return {id, relation, gate, points, visible:line.visible,z:group.position.z,
        width:line.material.linewidth, color:'#'+line.material.color.getHexString()};
    });
  }

  canvas.addEventListener('webglcontextlost', () => {
    onLoss();
    renderer.dispose();
    minimap?.dispose();
  }, {once:true});
  return {draw, describe, describePlates:()=>plates.children.map(stack=>({
    id:stack.name,z:stack.children.map(plate=>plate.position.z),visible:plates.visible,
  })), describeMinimap:()=>minimap?.describe()??[], diagnostics:() => ({frames,firstFrame,frameTime}),
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
