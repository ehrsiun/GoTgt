"use client";
import { useEffect, useState } from "react";
import { WORDMARK } from "@/lib/art";

export const COLORS = { yellow: "var(--yellow)", blue: "var(--blue)", pink: "var(--pink)", green: "var(--green)" };

/* ---------------- Lil guy face ----------------
   Eyes are 5x8 on a 100 box. The gap between the eyes never changes; only the pair moves. */
const LOOK = {
  left: [20.15, 68], right: [79.85, 58], up: [50, 24], down: [50, 78],
  leftUp: [23, 40], leftDown: [25, 74], rightUp: [77, 40], rightDown: [75, 74], center: [50, 56],
};
export function Face({ color = "yellow", look = "right", size = 48, open = false, blink = false, style, className = "" }) {
  const [cx, cy] = LOOK[look] || LOOK.right;
  return (
    <svg className={`face ${blink ? "blink" : ""} ${className}`} width={size} height={size} viewBox="0 0 100 100" style={style} aria-hidden>
      {open ? (
        <circle cx="50" cy="50" r="48.5" fill="none" stroke="var(--muted)" strokeWidth={100 / size * 1.5} strokeDasharray={`${400 / size} ${400 / size}`} />
      ) : (
        <>
          <circle cx="50" cy="50" r="50" fill={COLORS[color] || color} />
          <g className="eyes" style={{ transform: `translate(${cx - 50}px, ${cy - 50}px)` }}>
            <rect x={50 - 6.85} y={46} width="5" height="8" rx="2.5" fill="var(--ink)" />
            <rect x={50 + 1.85} y={46} width="5" height="8" rx="2.5" fill="var(--ink)" />
          </g>
        </>
      )}
    </svg>
  );
}

/* Walking lil guys: frame-by-frame from the Figma walk cycle (components/walk.jsx). */
export { Guys } from "./walk";

export function Wordmark({ width = 153, className = "", style }) {
  return <span className={className} style={{ display: "inline-block", width, ...style }} dangerouslySetInnerHTML={{ __html: WORDMARK.replace('width="153" height="59"', `width="${width}" height="${(width * 59) / 153}"`) }} />;
}

/* ---------------- Icons ---------------- */
const S = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
export const Icon = {
  arrow: (p) => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M5 12h14M13 6l6 6-6 6" {...S} /></svg>,
  back: (p) => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M19 12H5M11 6l-6 6 6 6" {...S} /></svg>,
  down: (p) => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M12 5v14M6 13l6 6 6-6" {...S} /></svg>,
  up: (p) => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><path d="M12 19V5M6 11l6-6 6 6" {...S} /></svg>,
  plus: (p) => <svg width="14" height="14" viewBox="0 0 16 16" {...p}><path d="M8 2.5v11M2.5 8h11" {...S} /></svg>,
  check: (p) => <svg width="16" height="16" viewBox="0 0 16 16" {...p}><path d="M3 8.5l3.2 3.2L13 5" {...S} /></svg>,
  search: (p) => <svg width="18" height="18" viewBox="0 0 24 24" {...p}><circle cx="11" cy="11" r="7" {...S} /><path d="M20 20l-4-4" {...S} /></svg>,
  pin: (p) => <svg width="18" height="18" viewBox="0 0 24 24" {...p}><path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" {...S} /><circle cx="12" cy="9.5" r="2.5" {...S} /></svg>,
  chevron: (p) => <svg width="18" height="18" viewBox="0 0 24 24" {...p}><path d="M9 6l6 6-6 6" {...S} /></svg>,
  close: (p) => <svg width="16" height="16" viewBox="0 0 24 24" {...p}><path d="M6 6l12 12M18 6L6 18" {...S} /></svg>,
  bell: (p) => <svg width="18" height="18" viewBox="0 0 24 24" {...p}><path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15L6 16zM10 20a2 2 0 0 0 4 0" {...S} /></svg>,
  mute: (p) => <svg width="18" height="18" viewBox="0 0 24 24" {...p}><path d="M6 16V11a6 6 0 0 1 9.5-4.9M18 11v5l1.5 2H8M10 20a2 2 0 0 0 4 0M4 4l16 16" {...S} /></svg>,
  flag: (p) => <svg width="18" height="18" viewBox="0 0 24 24" {...p}><path d="M6 21V4M6 4h11l-2 4 2 4H6" {...S} /></svg>,
  more: (p) => <svg width="20" height="20" viewBox="0 0 24 24" {...p}><circle cx="5" cy="12" r="1.6" fill="currentColor" /><circle cx="12" cy="12" r="1.6" fill="currentColor" /><circle cx="19" cy="12" r="1.6" fill="currentColor" /></svg>,
};

/* ---------------- Basic controls ---------------- */
export function Button({ kind = "primary", size = "L", fill, children, onClick, style, className = "", ...rest }) {
  return <button className={`btn ${kind} ${size} ${fill ? "fill" : ""} ${className}`} onClick={onClick} style={style} {...rest}>{children}</button>;
}
export function Round({ kind = "outline", icon = "arrow", onClick, size = 48, label, style, as, ...rest }) {
  const I = Icon[icon];
  const Tag = as || "button";
  return <Tag className={`round ${kind}`} onClick={onClick} style={{ width: size, height: size, ...style }} aria-label={label || icon} {...rest}><I /></Tag>;
}
export function Chip({ label, on, onClick }) {
  return <button className={`chip ${on ? "on" : ""}`} onClick={onClick}><Icon.plus />{label}</button>;
}
export function Pill({ label, on, onClick, style, grow, dark }) {
  return <button className={`pill ${on ? "on" : ""} ${dark ? "dark" : ""}`} onClick={onClick} style={{ flex: grow ? 1 : undefined, ...style }}>{label}</button>;
}
export function Toggle({ on, onChange }) {
  return (
    <button className={`toggle ${on ? "on" : ""}`} onClick={() => onChange && onChange(!on)} aria-pressed={on} aria-label="toggle">
      <span className="knob"><Face color={on ? "yellow" : "paper"} look={on ? "right" : "left"} size={26} style={{ filter: on ? "none" : "drop-shadow(0 1px 2px rgba(0,0,0,.18))" }} /></span>
    </button>
  );
}
COLORS.paper = "var(--paper)";

export function Spots({ joined = 1, total = 3, size = 24, colors = ["yellow", "blue", "green"] }) {
  return (
    <span style={{ display: "inline-flex" }}>
      {Array.from({ length: total }).map((_, i) => (
        <span key={i} style={{ marginLeft: i ? -size / 4 : 0, borderRadius: 99, background: "var(--paper)", display: "inline-flex" }}>
          <Face size={size} color={colors[i % colors.length]} open={i >= joined} look="right" />
        </span>
      ))}
    </span>
  );
}

export function Marker({ children, color = "yellow", className = "t-xl", style }) {
  return <span className={`marker ${className}`} style={{ "--mk": COLORS[color], ...style }}><span>{children}</span></span>;
}

export function StatusBar({ light }) {
  return (
    <div className={`statusbar ${light ? "light" : ""}`}>
      <span>9:41</span>
      <span className="island" />
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <svg width="18" height="12" viewBox="0 0 18 12"><rect x="0" y="8" width="3" height="4" rx="1" fill="currentColor" /><rect x="5" y="5.5" width="3" height="6.5" rx="1" fill="currentColor" /><rect x="10" y="3" width="3" height="9" rx="1" fill="currentColor" /><rect x="15" y="0" width="3" height="12" rx="1" fill="currentColor" /></svg>
        <svg width="16" height="12" viewBox="0 0 16 12"><path d="M8 11.5l2.4-2.6a3.4 3.4 0 0 0-4.8 0L8 11.5zM3.2 6.3a6.8 6.8 0 0 1 9.6 0l1.6-1.7a9.2 9.2 0 0 0-12.8 0l1.6 1.7z" fill="currentColor" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3.5" fill="none" stroke="currentColor" opacity=".4" /><rect x="2" y="2" width="19" height="8" rx="2" fill="currentColor" /><path d="M24 4v4c.8-.3 1.3-1.1 1.3-2S24.8 4.3 24 4z" fill="currentColor" opacity=".5" /></svg>
      </span>
    </div>
  );
}

/* Countdown that ticks every second, with a small roll on each change. */
export function useCountdown(start) {
  const [s, setS] = useState(start);
  useEffect(() => { const t = setInterval(() => setS((v) => (v > 0 ? v - 1 : 0)), 1000); return () => clearInterval(t); }, []);
  const m = Math.floor(s / 60), ss = String(s % 60).padStart(2, "0");
  return `${m}:${ss}`;
}
export function Ticking({ start, className, style }) {
  const v = useCountdown(start);
  return <span className={className} style={style}>{v.split("").map((ch, i) => <span key={i + ch} className="tick">{ch}</span>)}</span>;
}

export function PlanRow({ color, activity, meta, time, joined = 1, onClick, target }) {
  return (
    <button className="row hair press" onClick={onClick} style={{ width: "100%", textAlign: "left", gap: 14, padding: 0, height: 95 }} data-fill-target={target ? "" : undefined}>
      <Face color={color} look="right" size={48} blink />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className="t-title" style={{ display: "block" }}>{activity}</span>
        <span className="t-caption muted">{meta}</span>
      </span>
      <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <span className="t-strong">{time}</span>
        <Spots joined={joined} size={22} colors={[color, "blue", "green"]} />
      </span>
    </button>
  );
}

export function SectionHeader({ title, count, link, onLink }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="t-label">{title}</span>
        {count != null && <span style={{ minWidth: 20, height: 20, borderRadius: 10, background: "var(--ink)", color: "var(--paper)", fontSize: 11, fontWeight: 600, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>{count}</span>}
      </span>
      {link && <button className="t-strong" onClick={onLink}>{link}</button>}
    </div>
  );
}
