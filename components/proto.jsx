"use client";
import { createContext, memo, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Face, Guys, StatusBar, Icon } from "./ui";

/* ------------------------------------------------------------------
   Navigation + transitions for the prototype.
   go(id, { t })  t = push | fade | tab | sheet | none | fill | walk
   back()          reverses whatever transition opened the screen.
------------------------------------------------------------------- */
const ProtoCtx = createContext(null);
const LayerCtx = createContext({ hideTab: false, inert: false });
export const useProto = () => useContext(ProtoCtx);
export const useLayer = () => useContext(LayerCtx);

const REVERSE = { up: "down", push: "pop", sheet: "sheetDown", fade: "fade", tab: "tab", fill: "fade", walk: "fade", none: "fade" };

export function Proto({ screens, start = "splash", children }) {
  const [stack, setStack] = useState([{ id: start, t: "none" }]);
  const [trans, setTrans] = useState(null); // {from, to, type}
  const [overlay, setOverlay] = useState(null);
  const stageRef = useRef(null);
  const busy = useRef(false);
  const cur = stack[stack.length - 1].id;

  const point = useCallback((e) => {
    const el = stageRef.current; if (!el || !e) return null;
    const r = el.getBoundingClientRect(); const k = el.offsetWidth / r.width;
    const p = e.touches ? e.touches[0] : e;
    return { x: (p.clientX - r.left) * k, y: (p.clientY - r.top) * k };
  }, []);

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
    const ms = { up: 360, down: 300, push: 330, pop: 330, fade: 340, tab: 210, sheet: 330, sheetDown: 270, slowfade: 720 }[trans.type] || 340;
    const id = setTimeout(() => setTrans(null), ms + 30);
    return () => clearTimeout(id);
  }, [trans]);

  const ctx = useMemo(() => ({ go, back, reset, cur, point, stageRef, screens }), [go, back, reset, cur, point, screens]);
  const meta = (id) => screens[id] || {};
  const tabOf = (id) => meta(id).tab;

  const Layer = ({ id, cls = "", hideTab = false, inert = false, k }) => <LayerView key={k || id} C={meta(id).C} id={id} cls={cls} hideTab={hideTab} inert={inert} />;

  let layers;
  const stageTab = (!trans && tabOf(cur)) || (trans && trans.type === "tab" && tabOf(trans.to));
  if (!trans) layers = [Layer({ id: cur, hideTab: !!tabOf(cur) })];
  else {
    const { from, to, type } = trans;
    const hideTo = type === "tab";
    const hideFrom = type === "tab";
    const map = {
      push: [Layer({ k: "f" + from, id: from, cls: "a-outLeft", hideTab: hideFrom, inert: true }), Layer({ k: to, id: to, cls: "a-inRight", hideTab: hideTo })],
      pop: [Layer({ k: to, id: to, cls: "a-inLeft", hideTab: hideTo }), Layer({ k: "f" + from, id: from, cls: "a-outRight", hideTab: hideFrom, inert: true })],
      fade: [Layer({ k: "f" + from, id: from, inert: true }), Layer({ k: to, id: to, cls: "a-fadeIn" })],
      slowfade: [Layer({ k: "f" + from, id: from, inert: true }), Layer({ k: to, id: to, cls: "a-fadeInSlow" })],
      tab: [Layer({ k: "f" + from, id: from, hideTab: true, inert: true }), Layer({ k: to, id: to, cls: "a-tabIn", hideTab: true })],
      up: [Layer({ k: "f" + from, id: from, inert: true, hideTab: false }), Layer({ k: to, id: to, cls: "a-up" })],
      down: [Layer({ k: to, id: to }), Layer({ k: "f" + from, id: from, cls: "a-down", inert: true })],
      sheet: [Layer({ k: to, id: to, cls: "sheet-enter" })],
      sheetDown: [Layer({ k: to, id: to }), Layer({ k: "f" + from, id: from, cls: "sheet-exit", inert: true })],
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
            <Ripples stageRef={stageRef} point={point} />
          </div>
          <StatusBar light={!!meta(trans ? trans.to : cur).lightStatus && !overlay} />
        </div>
      </div>
    </ProtoCtx.Provider>
  );
}

function Ripples({ stageRef, point }) {
  const [ripples, setRipples] = useState([]);
  useEffect(() => {
    const el = stageRef.current; if (!el) return;
    const onDown = (e) => { const p = point(e); if (!p) return; const id = Math.random(); setRipples((r) => [...r, { ...p, id }]); setTimeout(() => setRipples((r) => r.filter((x) => x.id !== id)), 520); };
    el.addEventListener("pointerdown", onDown); return () => el.removeEventListener("pointerdown", onDown);
  }, [stageRef, point]);
  return ripples.map((r) => <span key={r.id} className="tap-ripple" style={{ left: r.x, top: r.y, width: 90, height: 90 }} />);
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

/* ---------------- Lil guy transitions ----------------
   fill: a face grows from the tapped button to cover the screen, blinks,
         then shrinks into the thing it lands on in the next screen.
   walk: a lil guy walks across pulling a curtain of his color, then the
         curtain keeps going to reveal the next screen. */
function Overlay({ o, stageRef, onSwap, onDone }) {
  const circle = useRef(null), eyes = useRef(null), panel = useRef(null), walker = useRef(null);
  useLayoutEffect(() => {
    let alive = true;
    const run = async () => {
      if (o.kind === "fill") {
        const c = circle.current, e = eyes.current;
        const up = [0.01, 0.3, 1, 2.5, 6, 12, 17];
        await Promise.all([
          c.animate(up.map((s) => ({ transform: `translate(-50%,-50%) scale(${s})` })), { duration: 460, easing: "linear", fill: "forwards" }).finished,
          e.animate([{ opacity: 0, transform: "translate(-50%,-50%) translateY(16px)" }, { opacity: 0, offset: 0.6 }, { opacity: 1, transform: "translate(-50%,-50%)" }], { duration: 500, easing: "ease-out", fill: "forwards" }).finished,
        ]);
        if (!alive) return;
        onSwap();
        await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
        const st = stageRef.current; const t = st?.querySelector("[data-fill-target]");
        let tx = 201, ty = 437;
        if (t) { const sr = st.getBoundingClientRect(), tr = t.getBoundingClientRect(), k = st.offsetWidth / sr.width; tx = (tr.left - sr.left + tr.width / 2) * k; ty = (tr.top - sr.top + tr.height / 2) * k; }
        const dx = tx - o.from.x, dy = ty - o.from.y, ex = tx - 201, ey = ty - 380;
        const dn = [17, 17, 9, 4, 1.6, 0.5, 0.01];
        await Promise.all([
          c.animate(dn.map((s, i) => ({ transform: `translate(-50%,-50%) translate(${i < 2 ? 0 : dx * Math.min(1, (i - 1) / 4.5)}px, ${i < 2 ? 0 : dy * Math.min(1, (i - 1) / 4.5)}px) scale(${s})`, opacity: i === 6 ? 0 : 1 })), { duration: 620, easing: "linear", fill: "forwards" }).finished,
          e.animate([
            { transform: "translate(-50%,-50%) scaleY(1)", opacity: 1 },
            { transform: "translate(-50%,-50%) scaleY(0.1)", opacity: 1, offset: 0.08 },
            { transform: "translate(-50%,-50%) scaleY(1)", opacity: 1, offset: 0.18 },
            { transform: "translate(-50%,-50%) scaleY(1)", opacity: 1, offset: 0.24 },
            { transform: `translate(-50%,-50%) translate(${ex}px, ${ey}px) scale(0.15)`, opacity: 0, offset: 0.8 },
            { transform: `translate(-50%,-50%) translate(${ex}px, ${ey}px) scale(0.15)`, opacity: 0 },
          ], { duration: 620, easing: "ease-in-out", fill: "forwards" }).finished,
        ]);
      } else {
        const p = panel.current, w = walker.current; const ww = w.getBoundingClientRect().width * (stageRef.current.offsetWidth / stageRef.current.getBoundingClientRect().width);
        const s = 422, end = -ww - 40, off = 0.92 * ww;
        await Promise.all([
          w.animate([{ transform: `translateX(${s}px)` }, { transform: `translateX(${end}px)` }], { duration: 1100, easing: "linear", fill: "forwards" }).finished,
          p.animate([{ transform: `translateX(${s + off}px)` }, { transform: `translateX(${end + off}px)` }], { duration: 1100, easing: "linear", fill: "forwards" }).finished,
        ]);
        if (!alive) return;
        onSwap();
        await p.animate([{ transform: `translateX(${end + off}px)` }, { transform: `translateX(${end + off - 660}px)` }], { duration: 520, easing: "cubic-bezier(.2,.7,.3,1)", fill: "forwards" }).finished;
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
      <div ref={circle} style={{ position: "absolute", left: o.from.x, top: o.from.y, width: 100, height: 100, borderRadius: "50%", background: col, transform: "translate(-50%,-50%) scale(0.01)" }} />
      <div ref={eyes} style={{ position: "absolute", left: 201, top: 380, width: 76, height: 44, display: "flex", justifyContent: "space-between", opacity: 0, transform: "translate(-50%,-50%)" }}>
        <span style={{ width: 28, height: 44, borderRadius: 14, background: "var(--ink)" }} /><span style={{ width: 28, height: 44, borderRadius: 14, background: "var(--ink)" }} />
      </div>
    </div>
  );
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents: "all", overflow: "hidden" }}>
      <div ref={panel} style={{ position: "absolute", left: 0, top: 0, width: 660, height: "100%", background: col, transform: "translateX(600px)" }} />
      <div ref={walker} style={{ position: "absolute", left: 0, bottom: 210, transform: "translateX(422px)" }}><Guys colors={[o.color]} height={190} /></div>
    </div>
  );
}
