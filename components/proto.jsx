"use client";
import { createContext, memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Face, Guys, StatusBar, Icon } from "./ui";

/* ------------------------------------------------------------------
   Navigation + transitions for the prototype.
   go(id, { t })  t = push | dissolve | fade | tab | up | sheet | none | fill | walk
   Timings follow the Figma prototype: push 0.3 ease-out, move-in 0.3 ease-out,
   move-out 0.25 ease-out, dissolve 0.2 ease-out, tabs smart-animate 0.3 ease-in-out.
   back()          reverses whatever transition opened the screen.
------------------------------------------------------------------- */
const ProtoCtx = createContext(null);
const LayerCtx = createContext({ hideTab: false, inert: false });
export const useProto = () => useContext(ProtoCtx);
export const useLayer = () => useContext(LayerCtx);

const REVERSE = { up: "down", push: "pop", sheet: "sheetDown", fade: "fade", dissolve: "fade", tab: "tab", fill: "down", walk: "fade", none: "fade" };
const MS = { up: 300, down: 250, push: 300, pop: 300, fade: 200, dissolve: 300, tab: 300, sheet: 300, sheetDown: 250 };

export function Proto({ screens, start = "splash", children }) {
  const [stack, setStack] = useState([{ id: start, t: "none" }]);
  const [trans, setTrans] = useState(null); // {from, to, type}
  const [overlay, setOverlay] = useState(null);
  const stageRef = useRef(null);
  const busy = useRef(false);
  const cur = stack[stack.length - 1].id;

  // Where a fill transition starts: the centre of the tapped button (like the Figma "T ·" frames).
  const point = useCallback((e) => {
    const el = stageRef.current; if (!el || !e) return null;
    const r = el.getBoundingClientRect(); const k = el.offsetWidth / r.width;
    const t = e.currentTarget && e.currentTarget.getBoundingClientRect ? e.currentTarget.getBoundingClientRect() : null;
    if (t) return { x: (t.left + t.width / 2 - r.left) * k, y: (t.top + t.height / 2 - r.top) * k };
    const p = e.touches ? e.touches[0] : e;
    return { x: (p.clientX - r.left) * k, y: (p.clientY - r.top) * k };
  }, []);
  const params = useRef({});

  const commit = useCallback((to, type, mode = "push") => {
    setStack((s) => {
      const from = s[s.length - 1].id;
      if (type !== "none") setTrans({ from, to, type });
      if (mode === "replace") return [...s.slice(0, -1), { id: to, t: type }];
      if (mode === "reset") return [{ id: to, t: type }];
      return [...s, { id: to, t: type }];
    });
  }, []);

  const go = useCallback((to, opts = {}) => {
    if (busy.current) return;
    const t = opts.t || "push";
    params.current[to] = opts.params || null;
    const mode = opts.mode || (["tab", "walk"].includes(t) || opts.reset ? "reset" : "push");
    if (t === "fill" || t === "walk") {
      busy.current = true;
      setOverlay({ kind: t, to, color: opts.color || "yellow", from: opts.from || { x: 201, y: 760 }, mode });
      return;
    }
    commit(to, t, mode);
  }, [commit]);

  const back = useCallback(() => {
    if (busy.current) return;
    setStack((s) => {
      if (s.length < 2) return s;
      const top = s[s.length - 1];
      const to = s[s.length - 2].id;
      setTrans({ from: top.id, to, type: REVERSE[top.t] || "pop" });
      return s.slice(0, -1);
    });
  }, []);

  const reset = useCallback((id) => { busy.current = false; setOverlay(null); setTrans(null); setStack([{ id, t: "none" }]); }, []);

  // finish CSS transitions
  useEffect(() => {
    if (!trans) return;
    const id = setTimeout(() => setTrans(null), (MS[trans.type] || 300) + 40);
    return () => clearTimeout(id);
  }, [trans]);

  const ctx = useMemo(() => ({ go, back, reset, cur, point, stageRef, screens, params: params.current }), [go, back, reset, cur, point, screens]);
  const meta = (id) => screens[id] || {};
  const tabOf = (id) => meta(id).tab;

  const Layer = ({ id, cls = "", hideTab = false, inert = false, k }) => <LayerView key={k || id} C={meta(id).C} id={id} cls={cls} hideTab={hideTab} inert={inert} />;

  let layers;
  const stageTab = (!trans && tabOf(cur)) || (trans && trans.type === "tab" && tabOf(trans.to));
  if (!trans) layers = [Layer({ id: cur, hideTab: !!tabOf(cur) })];
  else {
    const { from, to, type } = trans;
    // keep the outgoing screen mounted (same key as before) so it doesn't restart mid-transition
    const fk = from === to ? "f" + from : from;
    const hideTo = type === "tab";
    const hideFrom = type === "tab";
    const map = {
      push: [Layer({ k: fk, id: from, cls: "a-outLeft", hideTab: hideFrom, inert: true }), Layer({ k: to, id: to, cls: "a-inRight", hideTab: hideTo })],
      pop: [Layer({ k: to, id: to, cls: "a-inLeft", hideTab: hideTo }), Layer({ k: fk, id: from, cls: "a-outRight", hideTab: hideFrom, inert: true })],
      fade: [Layer({ k: fk, id: from, inert: true }), Layer({ k: to, id: to, cls: "a-fadeIn" })],
      dissolve: [Layer({ k: fk, id: from, inert: true }), Layer({ k: to, id: to, cls: "a-dissolve" })],
      tab: [Layer({ k: fk, id: from, hideTab: true, inert: true }), Layer({ k: to, id: to, cls: "a-tabIn", hideTab: true })],
      up: [Layer({ k: fk, id: from, inert: true, hideTab: false }), Layer({ k: to, id: to, cls: "a-up" })],
      down: [Layer({ k: to, id: to }), Layer({ k: fk, id: from, cls: "a-down", inert: true })],
      sheet: [Layer({ k: to, id: to, cls: "sheet-enter" })],
      sheetDown: [Layer({ k: to, id: to }), Layer({ k: fk, id: from, cls: "sheet-exit", inert: true })],
    };
    layers = map[type] || [Layer({ k: to, id: to })];
  }

  return (
    <ProtoCtx.Provider value={ctx}>
      {children}
      <div className="phone-wrap" id="phone-wrap">
        <div className="phone">
          <div className="stage" ref={stageRef}>
            {layers}
            {stageTab && <TabBar current={stageTab} />}
            {overlay && <Overlay o={overlay} stageRef={stageRef} onSwap={() => commit(overlay.to, "none", overlay.mode)} onDone={() => { busy.current = false; setOverlay(null); }} />}
          </div>
          {!(meta(trans ? trans.to : cur).noStatus && !overlay) && <StatusBar light={!!meta(trans ? trans.to : cur).lightStatus && !overlay} />}
        </div>
      </div>
    </ProtoCtx.Provider>
  );
}

const LayerView = memo(function LayerView({ C, id, cls, hideTab, inert }) {
  return (
    <LayerCtx.Provider value={{ hideTab, inert }}>
      <div data-screen={id} className={`layer ${cls || ""} ${inert ? "noink" : ""}`} aria-hidden={inert || undefined}>{C ? <C /> : <div className="screen">Missing screen: {id}</div>}</div>
    </LayerCtx.Provider>
  );
});

/* ---------------- Screen wrapper ---------------- */
export function Screen({ children, tab, className = "", style, scroll }) {
  const { hideTab } = useLayer();
  return (
    <>
      <div className={`screen ${tab ? "tabbed" : ""} ${scroll ? "scroll" : ""} ${className}`} style={style}>{children}</div>
      {tab && !hideTab && <TabBar current={tab} />}
    </>
  );
}

/* Sheet over another screen: base screen + 30% scrim + panel. */
export function Sheet({ base, children, onDismiss, style }) {
  const { screens, back } = useProto();
  const B = screens[base]?.C;
  return (
    <div className="sheet-host">
      {B && <LayerCtx.Provider value={{ hideTab: false, inert: true }}><div className="layer noink"><B /></div></LayerCtx.Provider>}
      <div className="scrim" onClick={onDismiss || back} />
      <div className="sheet-panel" style={style}><div className="grabber" />{children}</div>
    </div>
  );
}

/* ---------------- Tab bar: the post button's eyes look at the active tab ---------------- */
const TAB_LOOK = { home: "leftUp", active: "leftDown", friends: "rightDown", circles: "rightUp" };
function Tab({ id, label, to, current, go }) {
  return (
    <button className={`tab ${current === id ? "on" : ""}`} onClick={() => current !== id && go(to, { t: "tab" })}>
      <span>{label}</span><span className="dot" />
    </button>
  );
}
export function TabBar({ current }) {
  const { go } = useProto();
  return (
    <nav className="tabbar">
      <Tab id="home" label="home" to="home" current={current} go={go} />
      <Tab id="active" label="active" to="active" current={current} go={go} />
      <button className="postbtn" aria-label="post a plan" onClick={() => go("newPost", { t: "up" })}>
        <Face color="yellow" look={TAB_LOOK[current] || "up"} size={64} />
        <span className="badge"><Icon.plus width="12" height="12" /></span>
      </button>
      <Tab id="friends" label="friends" to="friends" current={current} go={go} />
      <Tab id="circles" label="circles" to="circles" current={current} go={go} />
    </nav>
  );
}

/* ---------------- Lil guy transitions (timed from the Figma "T ·" frames) ----------------
   fill:  a face grows from the tapped button to cover the screen (0.57 s), its eyes
          open; held until 1 s. The next screen swaps in underneath, the face blinks,
          then shrinks into the thing it lands on (0.6 s).
   walk:  a lil guy walks right-to-left pulling a curtain of his color (1.1 s),
          then the curtain slides off to reveal the next screen (0.5 s, ease-out). */
const IO = "cubic-bezier(.42,0,.58,1)", OUT = "cubic-bezier(0,0,.58,1)";
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
function Overlay({ o, stageRef, onSwap, onDone }) {
  const move = useRef(null), circle = useRef(null), eyesMove = useRef(null), eyes = useRef(null), panel = useRef(null), walker = useRef(null);
  useLayoutEffect(() => {
    let alive = true;
    const run = async () => {
      if (o.kind === "fill") {
        const c = circle.current, e = eyes.current, em = eyesMove.current;
        const grow = [[0, 0.01], [0.1, 0.3], [0.2, 1], [0.3, 2.5], [0.4, 6], [0.5, 12], [0.574, 17]];
        c.animate(grow.map(([t, v]) => ({ offset: t / 0.574, transform: `scale(${v})` })), { duration: 574, easing: "linear", fill: "forwards" });
        em.animate([{ offset: 0, transform: "translateY(16px)" }, { offset: 0.35 / 0.6, transform: "translateY(16px)", easing: IO }, { offset: 1, transform: "none" }], { duration: 600, fill: "forwards" });
        em.animate([{ offset: 0, opacity: 0 }, { offset: 0.35 / 0.525, opacity: 0, easing: IO }, { offset: 1, opacity: 1 }], { duration: 525, fill: "forwards", composite: "replace" });
        await wait(1000);
        if (!alive) return;
        onSwap();
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const st = stageRef.current; const t = st?.querySelector("[data-fill-target]");
        let tx = 201, ty = 437;
        if (t) { const sr = st.getBoundingClientRect(), tr = t.getBoundingClientRect(), k = st.offsetWidth / sr.width; tx = (tr.left - sr.left + tr.width / 2) * k; ty = (tr.top - sr.top + tr.height / 2) * k; }
        const dx = tx - o.from.x, dy = ty - o.from.y, ex = tx - 201, ey = ty - 380;
        const D = 600, f = (s) => s / 0.6;
        const shrink = [[0, 17], [0.14, 17], [0.24, 9], [0.33, 4], [0.42, 1.6], [0.5, 0.5], [0.58, 0.01], [0.6, 0.01]];
        await Promise.all([
          c.animate(shrink.map(([t, v]) => ({ offset: f(t), transform: `scale(${v})`, opacity: t < 0.5 ? 1 : t >= 0.58 ? 0 : 1 - (t - 0.5) / 0.08 })), { duration: D, easing: "linear", fill: "forwards" }).finished,
          move.current.animate([{ offset: 0, transform: "none", easing: IO }, { offset: f(0.56), transform: `translate(${dx}px, ${dy}px)` }, { offset: 1, transform: `translate(${dx}px, ${dy}px)` }], { duration: D, fill: "forwards" }).finished,
          em.animate([{ offset: 0, opacity: 1, transform: "none" }, { offset: f(0.14), opacity: 1, transform: "none", easing: IO }, { offset: f(0.4), opacity: 1, transform: `translate(${ex * 0.85}px, ${ey * 0.85}px)` }, { offset: f(0.48), opacity: 0, transform: `translate(${ex}px, ${ey}px)` }, { offset: 1, opacity: 0, transform: `translate(${ex}px, ${ey}px)` }], { duration: D, fill: "forwards" }).finished,
          e.animate([
            { offset: 0, transform: "scale(1, 1)", easing: IO }, { offset: f(0.05), transform: "scale(1, 0.1)", easing: IO }, { offset: f(0.11), transform: "scale(1, 1)" },
            { offset: f(0.2), transform: "scale(1, 1)", easing: IO }, { offset: f(0.48), transform: "scale(0.15, 0.15)" }, { offset: 1, transform: "scale(0.15, 0.15)" },
          ], { duration: D, fill: "forwards" }).finished,
        ]);
      } else {
        const p = panel.current, w = walker.current;
        await Promise.all([
          w.animate([{ transform: "translateX(422px)" }, { transform: "translateX(-210.3px)" }], { duration: 1100, easing: "linear", fill: "forwards" }).finished,
          p.animate([{ transform: "translateX(628.7px)" }, { transform: "translateX(-3.6px)" }], { duration: 1100, easing: "linear", fill: "forwards" }).finished,
        ]);
        if (!alive) return;
        onSwap();
        w.style.visibility = "hidden";
        await p.animate([{ transform: "translateX(-53.6px)" }, { transform: "translateX(-693.6px)" }], { duration: 500, easing: OUT, fill: "forwards" }).finished;
      }
      if (alive) onDone();
    };
    run();
    return () => { alive = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const col = `var(--${o.color})`;
  if (o.kind === "fill") return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "all" }}>
      <div ref={move} style={{ position: "absolute", left: o.from.x - 50, top: o.from.y - 50, width: 100, height: 100 }}>
        <div ref={circle} style={{ width: 100, height: 100, borderRadius: "50%", background: col, transform: "scale(0.01)" }} />
      </div>
      <div ref={eyesMove} style={{ position: "absolute", left: 163, top: 358, width: 76, height: 44, opacity: 0 }}>
        <div ref={eyes} style={{ width: 76, height: 44, display: "flex", justifyContent: "space-between" }}>
          <span style={{ width: 28, height: 44, borderRadius: 14, background: "var(--ink)" }} /><span style={{ width: 28, height: 44, borderRadius: 14, background: "var(--ink)" }} />
        </div>
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "all", overflow: "hidden" }}>
      <div ref={panel} style={{ position: "absolute", left: 0, top: 0, width: 640, height: "100%", background: col, transform: "translateX(628.7px)" }} />
      <div ref={walker} style={{ position: "absolute", left: -15, top: "calc(50% + 63px)", transform: "translateX(422px)" }}><Guys colors={[o.color]} height={194} /></div>
    </div>
  );
}
