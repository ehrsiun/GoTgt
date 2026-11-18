"use client";
import { memo, useMemo } from "react";
import { WALK, HELD_R, HELD_L } from "@/lib/frames";

/* ------------------------------------------------------------------
   Lil guys walking, drawn frame by frame from the Figma walk cycle
   (32 frames, 2 s loop, 0.0625 s per frame). Nothing is tweened:
   each frame is the hand-drawn pose, shown for exactly one step.

   colors: one guy, or a chain holding hands (left to right).
   In a chain the left guy's back arm and the right guy's front arm
   are replaced by the held-hand arms, exactly like the Figma loops.
   The guys face and walk left; facing="right" mirrors the whole chain.
------------------------------------------------------------------- */
export const PITCH = 260;
const FRAME_S = 0.0625;
const VB_Y = 0, VB_H = 252, PAD_L = 142, PAD_R = 132;

const COL = { yellow: "var(--yellow)", blue: "var(--blue)", pink: "var(--pink)", green: "var(--green)" };

const path = (p) => (p[0] === "f" ? `<path d="${p.slice(1)}" fill="var(--g)" stroke="none"/>` : `<path d="${p.slice(1)}"/>`);

// Which parts of a walk frame each guy keeps, and which held arms he gets.
function role(i, n) {
  if (n === 1) return { skip: [], right: false, left: false };
  const first = i === 0, last = i === n - 1;
  return {
    skip: [...(first ? [] : [1, 2]), ...(last ? [] : [9, 10])],
    right: !last, // holds the next guy's hand with his back arm
    left: !first, // holds the previous guy's hand with his front arm
  };
}

function frameMarkup(f, colors) {
  const n = colors.length;
  let s = "";
  colors.forEach((c, i) => {
    const r = role(i, n);
    const x = i * PITCH;
    s += `<g style="--g:${COL[c] || c}" transform="translate(${x + f.tx} ${f.ty})">`;
    f.p.forEach((p, j) => { if (!r.skip.includes(j)) s += path(p); });
    if (r.right) s += `<g transform="translate(${f.cx - 102} 0)">${HELD_R.map(path).join("")}</g>`;
    if (r.left) s += `<g transform="translate(${f.cx - 140} 0)">${HELD_L.map(path).join("")}</g>`;
    s += "</g>";
  });
  return s;
}

const cache = new Map();
export function markup(colors, walking) {
  const key = colors.join(",") + (walking ? "~" : "");
  if (cache.has(key)) return cache.get(key);
  let s;
  if (!walking) s = frameMarkup(WALK[0], colors);
  else s = WALK.map((f, i) => `<g class="wf" style="animation-delay:calc(${(i * FRAME_S).toFixed(4)}s + var(--wo, 0s))">${frameMarkup(f, colors)}</g>`).join("");
  cache.set(key, s);
  return s;
}

export const Guys = memo(function Guys({ colors = ["yellow"], walking = true, height = 120, facing = "left", offset = 0, style, className = "" }) {
  const n = colors.length;
  const w = PAD_L + PAD_R + PITCH * (n - 1);
  const html = useMemo(() => markup(colors, walking), [colors.join(","), walking]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <svg className={`guys ${className}`} viewBox={`${-PAD_L} ${VB_Y} ${w} ${VB_H}`} height={height} width={(height * w) / VB_H}
      style={{ overflow: "visible", display: "block", transform: facing === "right" ? "scaleX(-1)" : undefined, "--wo": `${offset}s`, ...style }}
      aria-hidden fill="none" stroke="var(--ink)" strokeWidth="7.8" strokeLinecap="round" strokeLinejoin="round"
      dangerouslySetInnerHTML={{ __html: html }} />
  );
});
