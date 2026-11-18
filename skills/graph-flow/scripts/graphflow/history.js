// The server uses the regular dashboard projection for every ledger boundary.
function applyPatch(value, patch) {
  if (Array.isArray(patch)) return patch[0];
  const next = Array.isArray(value) ? value.slice() : {...value};
  for (const [key, change] of Object.entries(patch)) {
    if (Array.isArray(change) && !change.length) delete next[key];
    else if (key === ':' && Array.isArray(next)) next.length = change[0];
    else Object.defineProperty(next, key, {value:applyPatch(value[key], change), enumerable:true, configurable:true, writable:true});
  }
  return next;
}

export function historyStep(steps, at) {
  let lower = 0, upper = steps.length;
  while (lower < upper) {
    const mid = Math.floor((lower + upper) / 2);
    if (steps[mid][0] <= at) lower = mid + 1;
    else upper = mid;
  }
  return lower - 1;
}

export function historyView(timeline, step, at, previous) {
  let view = timeline.base, index = 0;
  if (previous && previous.step <= step) {
    view = previous.view;
    index = previous.step + 1;
  }
  for (; index <= step; index++) view = applyPatch(view, timeline.steps[index][2]);
  return {...view, observed_at_ms:at};
}

const IDLE_THRESHOLD = 30 * 60_000;
const MAX_STUB = 90_000;

export function timeScale({start, end, records, busy}, linear = false) {
  const points = records.map(row => [row.at, row.at]);
  const covered = [[start,start], ...points, ...busy, [end,end]]
    .map(([a,b]) => [Math.max(start,a), Math.min(end,b)])
    .filter(([a,b]) => a<=b).sort((a,b) => a[0]-b[0]);
  const gaps = [];
  let last = start;
  for (const [a,b] of covered) {
    if (!linear && a-last > IDLE_THRESHOLD) gaps.push({start:last,end:a,duration:a-last});
    last = Math.max(last,b);
  }
  const longest = gaps.reduce((max, gap) => Math.max(max,gap.duration), 0);
  const rate = Math.min(1/60, MAX_STUB/Math.max(1,longest));
  let skipped = 0;
  for (const gap of gaps) {
    gap.from = gap.start-start-skipped;
    gap.to = gap.from+gap.duration*rate;
    skipped += gap.duration*(1-rate);
    gap.skipped = skipped;
  }

  const mappedGap = (value, key) => {
    let low = 0, high = gaps.length;
    while (low < high) {
      const mid = Math.floor((low+high)/2);
      if (gaps[mid][key] <= value) low = mid+1;
      else high = mid;
    }
    return gaps[low-1];
  };
  const toScale = value => {
    const gap = mappedGap(value,'start');
    if (!gap) return value-start;
    return value<gap.end ? gap.from+(value-gap.start)*rate : value-start-gap.skipped;
  };
  const fromScale = value => {
    const gap = mappedGap(value,'from');
    if (!gap) return start+value;
    return value<gap.to ? gap.start+(value-gap.from)/rate : start+value+gap.skipped;
  };
  return {start,end,total:toScale(end),toScale,fromScale,gaps,rate};
}
