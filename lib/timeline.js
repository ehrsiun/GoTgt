// Evaluates Figma-style keyframe tracks: [[time, value, easing]], where easing belongs
// to the segment that ARRIVES at that keyframe (null = linear, "hold" = jump at the end,
// [x1,y1,x2,y2] = cubic-bezier).

function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-5) break;
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    if (t < 0 || t > 1 || Math.abs(sx(t) - x) > 1e-3) {
      let lo = 0, hi = 1; t = x;
      for (let i = 0; i < 30; i++) { const v = sx(t); if (Math.abs(v - x) < 1e-5) break; if (v < x) lo = t; else hi = t; t = (lo + hi) / 2; }
    }
    return sy(t);
  };
}

const fns = new Map();
function ease(e) {
  if (!e || e === "hold") return null;
  const k = e.join(",");
  if (!fns.has(k)) fns.set(k, bezier(...e));
  return fns.get(k);
}

export function valueAt(track, t, base) {
  if (!track || !track.length) return base;
  if (t <= track[0][0]) return track[0][1];
  for (let i = 1; i < track.length; i++) {
    const [t1, v1, e] = track[i];
    if (t < t1) {
      const [t0, v0] = track[i - 1];
      if (e === "hold") return v0;
      const p = (t - t0) / (t1 - t0);
      const f = ease(e);
      return v0 + (v1 - v0) * (f ? f(p) : p);
    }
  }
  return track[track.length - 1][1];
}
