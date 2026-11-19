// Pinned routing metrics are comparable with the baseline, whose strokes were individual routes.
export function routeMetrics({edges,strokes=edges}) {
  const horizontal=[],vertical=[];
  let bends=0,length=0;
  for(const {points} of edges)for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i];
    length+=Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
    if(i>1&&(points[i-2].x===a.x)!==(a.x===b.x))bends++;
  }
  for(const {points} of strokes)for(let i=1;i<points.length;i++){
    const a=points[i-1],b=points[i];
    if(a.y===b.y&&a.x!==b.x)horizontal.push([a.y,Math.min(a.x,b.x),Math.max(a.x,b.x)]);
    if(a.x===b.x&&a.y!==b.y)vertical.push([a.x,Math.min(a.y,b.y),Math.max(a.y,b.y)]);
  }
  let crossings=0;
  for(const [y,left,right] of horizontal)for(const [x,top,bottom] of vertical){
    if(x>left&&x<right&&y>top&&y<bottom)crossings++;
  }
  return [crossings,bends,Math.round(length*100)/100,horizontal.length+vertical.length];
}

export function exceedsRatchet(actual, limit) {
  return actual[0]>limit[0]||actual[1]>limit[1];
}
