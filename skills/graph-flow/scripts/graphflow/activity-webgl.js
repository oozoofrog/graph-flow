import {
  AmbientLight, BoxGeometry, Color, DirectionalLight, EdgesGeometry, ExtrudeGeometry, Group, LineBasicMaterial, LineSegments,
  Mesh, MeshBasicMaterial, MeshLambertMaterial, OrthographicCamera, Path, Scene,
  Shape, Vector3, WebGLRenderer, WebGLRenderTarget,
} from 'three';

const PLAY_MS = 3600;
const DEPTH = 18;
const radial = (radii, rotation = Math.PI / 2) => radii.map((radius, index) => {
  const angle = rotation + 2 * Math.PI * index / radii.length;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
});
const SHAPES = Object.freeze({
  tool: ['rectangle', [[-.76,-.5],[.76,-.5],[.76,.5],[-.76,.5]]],
  skill: ['star', radial([.87,.29,.87,.29,.87,.29,.87,.29,.87,.29])],
  mcp: ['hexagon', radial(Array(6).fill(.74))],
  session: ['hourglass', [[-.79,-.72],[.79,-.72],[.25,0],[.79,.72],[-.79,.72],[-.25,0]]],
  gf: ['triangle', radial(Array(3).fill(.93))],
  other: ['cross', [[-.26,-.83],[.26,-.83],[.26,-.26],[.83,-.26],[.83,.26],[.26,.26],[.26,.83],
    [-.26,.83],[-.26,.26],[-.83,.26],[-.83,-.26],[-.26,-.26]]],
  thinking: ['ring', radial(Array(32).fill(.75)), radial(Array(32).fill(.50)).reverse()],
});

export function describeActivity(attempts) {
  const phases = attempts.flatMap(attempt => attempt.phases.map(phase => ({phase, attempt:attempt.attempt})));
  if (!phases.length) return Object.freeze([]);
  const gaps = phases.map(({attempt}, i) => !i ? 0 : phases[i-1].attempt === attempt ? .96 : 1.62);
  const totalGap = gaps.reduce((sum, gap) => sum + gap, 0);
  const gapScale = Math.min(1, DEPTH * .45 / (totalGap || 1));
  const available = DEPTH - totalGap * gapScale;
  const minimum = Math.min(.52, available / (2 * phases.length));
  const duration = phases.reduce((sum, {phase}) => sum + phase.duration_ms, 0);
  const unit = Math.min(.001, (available - minimum * phases.length) / (duration || 1));
  const lengths = phases.map(({phase}) => Math.max(minimum, phase.duration_ms * unit));
  const used = lengths.reduce((sum, length) => sum + length, 0) + totalGap * gapScale;
  let start = (DEPTH - used) / 2;
  return Object.freeze(phases.map(({phase, attempt}, i) => {
    start += gaps[i] * gapScale;
    const length = lengths[i];
    const model = Object.freeze({id:attempt + ':' + phase.id, attempt, category:phase.category,
      shape:SHAPES[phase.category][0], start, length, startMs:phase.start_ms,
      flags:Object.freeze({errors:phase.errors, stalled:!!phase.stalled, repeating:!!phase.repeating,
        inferred:phase.inferred, includesInferred:!!phase.includes_inferred})});
    start += length;
    return model;
  }));
}

function outline(kind) {
  const [, points, hole] = SHAPES[kind];
  const path = type => polygon => {
    const result = new type();
    result.moveTo(...polygon[0]);
    for(const point of polygon.slice(1)) result.lineTo(...point);
    result.closePath();
    return result;
  };
  const shape = path(Shape)(points);
  if(hole) shape.holes.push(path(Path)(hole));
  return new ExtrudeGeometry(shape, {depth:1, bevelEnabled:false});
}

function projected(object, camera, width, height) {
  const {min, max} = object.geometry.boundingBox;
  const points = [min.x,max.x].flatMap(x => [min.y,max.y].flatMap(y => [min.z,max.z].map(z =>
    new Vector3(x,y,z).applyMatrix4(object.matrixWorld).project(camera))));
  const xs = points.map(p => (p.x + 1) * width / 2), ys = points.map(p => (1 - p.y) * height / 2);
  return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)];
}

export function createActivityScene(canvas, {attempts, reduced, autoplay, capture, onState, onLoss}) {
  const context = canvas.getContext('webgl2', {antialias:true, preserveDrawingBuffer:capture});
  if(!context) return null;
  const renderer = new WebGLRenderer({canvas,context,antialias:true,preserveDrawingBuffer:capture});
  const scene = new Scene();
  scene.background = new Color(0xf3f5f8);
  const camera = new OrthographicCamera(-1,1,1,-1,.1,70);
  const solids = new Group();
  const light = new DirectionalLight(0xffffff, 2.1);
  light.position.set(5,8,5);
  scene.add(solids,new AmbientLight(0xffffff,1.7),light);
  const materials = {
    body:new MeshLambertMaterial({color:0x425b76}),
    inferred:new MeshLambertMaterial({color:0x7c93aa,transparent:true,opacity:.53}),
    edge:new LineBasicMaterial({color:0x24354a,transparent:true,opacity:.40}),
    mark:new MeshBasicMaterial({color:0x233142}),
  };
  const marker = new BoxGeometry(1,1,1);
  const geometry = Object.fromEntries(Object.keys(SHAPES).map(kind => [kind,outline(kind)]));
  Object.values(geometry).forEach(mesh => mesh.computeBoundingBox());
  const outlines = Object.fromEntries(Object.entries(geometry).map(([kind,g])=>[kind,new EdgesGeometry(g)]));
  let models, bodies, raf = 0, frames = 0, width = 0, height = 0;
  let playing = false, elapsed = PLAY_MS, epoch = 0, drawnAt = null, startedAt = null, stoppedAt = null;
  let head = DEPTH / 2, tail = head;
  camera.position.set(9,2.6,5.6);
  camera.lookAt(0,0,0);
  const facing = camera.quaternion.clone();

  function addMarks(parent, flags) {
    const mark = new Group();
    parent.add(mark);
    mark.position.y = 1.11;
    // Face the screen at both camera scales.
    mark.quaternion.copy(facing);
    let x = 0;
    function bar(dx, dy, w, h, angle = 0) {
      const piece = new Mesh(marker,materials.mark);
      piece.position.set(x + dx,dy,0);
      piece.scale.set(w,h,.06);
      piece.rotation.z = angle;
      mark.add(piece);
    }
    if(flags.errors){
      bar(0,0,.40,.07,Math.PI/4); bar(0,0,.40,.07,-Math.PI/4);
      x += .5;
    }
    if(flags.repeating){
      for(const dy of [-.12,0,.12]) bar(0,dy,.30,.06);
      x += .5;
    }
    if(flags.stalled){
      bar(-.1,0,.06,.38); bar(.03,-.15,.28,.06); bar(.03,.15,.28,.06);
      x += .5;
    }
    if(flags.includesInferred&&!flags.inferred){
      for(const dy of [-.13,.13]) bar(0,dy,.32,.06);
      for(const dx of [-.13,.13]) bar(dx,0,.06,.26);
      x += .5;
    }
    mark.position.x = 1.05;
    for(const piece of mark.children) piece.position.x -= Math.max(0,x-.5)/2;
  }

  function rebuild(data) {
    models = describeActivity(data);
    solids.clear();
    bodies = models.map(model => {
      const holder = new Group();
      const body = new Mesh(geometry[model.category], model.flags.inferred?materials.inferred:materials.body);
      body.scale.set(.83,1,model.length);
      body.add(new LineSegments(outlines[model.category],materials.edge));
      body.position.z = -model.length / 2;
      holder.position.z = -model.start - model.length / 2;
      holder.add(body);
      addMarks(holder,model.flags);
      solids.add(holder);
      return body;
    });
  }

  function viewport(progress) {
    const overview = progress >= 1;
    const journey = Math.min(1, progress / .78);
    const blend = Math.max(0, (progress - .78) / .22);
    const cursor = head + (tail - head) * journey;
    const center = overview ? DEPTH / 2 : cursor * (1-blend) + DEPTH / 2 * blend;
    const span = overview ? DEPTH - 1 : 5 + (DEPTH - 6) * blend;
    camera.position.set(9,2.6,5.6-center);
    camera.lookAt(0,0,-center);
    const ratio = width / height;
    const halfHeight = Math.max(1.45, span / (2*ratio));
    camera.left = -halfHeight*ratio; camera.right = -camera.left;
    camera.top = halfHeight; camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
  }

  function draw(now) {
    raf = 0;
    if(!width || !height) return;
    if(playing){
      elapsed = Math.min(now - epoch, PLAY_MS);
      if(elapsed >= PLAY_MS){
        playing = false;
        stoppedAt = now;
        onState(false,false);
      }
    }
    viewport(elapsed / PLAY_MS);
    renderer.render(scene,camera);
    frames += 1;
    drawnAt = now;
    if(playing) request();
  }

  function request() {
    if(!raf && width && height) raf = requestAnimationFrame(draw);
  }

  function resize() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if(!w || !h || width === w && height === h) return;
    width = w; height = h;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    renderer.setSize(width,height,false);
    request();
  }

  function play(replay = true) {
    if(reduced || !models.length) return;
    if(replay || elapsed >= PLAY_MS){
      elapsed = 0;
      const first = models[0], last = models.at(-1);
      head = first.start + first.length / 2;
      tail = last.start + last.length / 2;
      startedAt = performance.now();
      stoppedAt = null;
    }
    epoch = performance.now() - elapsed;
    playing = true;
    onState(true,true);
    request();
  }

  function pause() {
    if(!playing) return;
    playing = false;
    cancelAnimationFrame(raf);
    raf = 0;
    onState(false,true);
  }

  function loss(event) {
    event.preventDefault();
    dispose();
    onLoss();
  }

  const observer = new ResizeObserver(resize);
  function dispose() {
    observer.disconnect();
    cancelAnimationFrame(raf);
    raf = 0;
    playing = false;
    canvas.removeEventListener('webglcontextlost',loss);
    Object.values(geometry).forEach(g => g.dispose());
    Object.values(outlines).forEach(g => g.dispose());
    Object.values(materials).forEach(m => m.dispose());
    marker.dispose();
    renderer.dispose();
    if(!context.isContextLost()) renderer.forceContextLoss();
  }

  function silhouettes() {
    const size = 64, target = new WebGLRenderTarget(size,size);
    const lens = new OrthographicCamera(-1,1,1,-1,.1,8);
    lens.position.z = 4;
    const stage = new Scene();
    stage.background = new Color(0xffffff);
    const material = new MeshBasicMaterial({color:0x000000});
    const pixels = new Uint8Array(size*size*4);
    const masks = {};
    try {
      renderer.setRenderTarget(target);
      for(const [kind, g] of Object.entries(geometry)){
        stage.clear();
        const mesh = new Mesh(g,material);
        mesh.scale.x = .83;
        stage.add(mesh);
        renderer.render(stage,lens);
        renderer.readRenderTargetPixels(target,0,0,size,size,pixels);
        masks[kind] = Array.from({length:size*size},(_,i)=>pixels[i*4] < 128 ? '1' : '0').join('');
      }
    } finally {
      renderer.setRenderTarget(null);
      material.dispose();
      target.dispose();
    }
    return masks;
  }

  rebuild(attempts);
  canvas.addEventListener('webglcontextlost',loss);
  observer.observe(canvas);
  resize();
  if(autoplay) play();
  return {
    update(data){rebuild(data);request();},
    mode(value){
      reduced = value;
      if(reduced && elapsed < PLAY_MS){pause();elapsed=PLAY_MS;onState(false,false);request();}
    },
    play,pause,dispose,
    describe:()=>Object.freeze({solids:models,playing,elapsed,frames,pending:!!raf,drawnAt,startedAt,stoppedAt,
      ...(capture && frames ? {position:camera.position.toArray(),
        bounds:bodies.map(body => projected(body,camera,width,height))} : {})}),
    ...(capture ? {silhouettes} : {}),
  };
}
