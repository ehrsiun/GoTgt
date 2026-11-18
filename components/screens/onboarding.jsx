"use client";
import { useEffect, useRef, useState } from "react";
import { SPLASH } from "@/lib/splash";
import { valueAt } from "@/lib/timeline";
import { markup } from "../walk";
import { useProto, Screen } from "../proto";
import { Face, Guys, Wordmark, Button, Marker, Toggle, Pill, Icon, Round } from "../ui";
import { Gap, SetupHeader, NavHeader, FRIENDS } from "./common";

/* ---------------- 0 · Splash ----------------
   Played straight from the Figma timeline ("GoTgt wordmark animation", 12 s):
   lil guys pop into the "o" and "g", look at each other, draw their limbs,
   the wordmark fades, they meet hand in hand and walk; tagline rises;
   at 10 s it dissolves to Home (0.3 s ease-out), like the prototype. */
const PAD = 3.945; // half stroke: exported SVGs are padded by it
function SplashPart({ k }) {
  const pad = k.svg.includes("stroke=") ? PAD : 0;
  return (
    <g transform={`translate(${k.x - pad} ${k.y - pad})`}>
      <g data-part="" className="sp-part" dangerouslySetInnerHTML={{ __html: k.svg }} />
    </g>
  );
}
export function Splash() {
  const { go } = useProto();
  const root = useRef(null);
  const [loop, setLoop] = useState(false);
  const [held, setHeld] = useState(false);
  useEffect(() => {
    const el = root.current; if (!el) return;
    const parts = [...el.querySelectorAll("[data-anim]")].map((n) => ({ n, tr: JSON.parse(n.dataset.anim), trim: n.dataset.trim === "1" }));
    const t0 = performance.now();
    let raf, gone = false;
    const tick = (now) => {
      const t = (now - t0) / 1000;
      for (const { n, tr, trim } of parts) {
        const o = valueAt(tr.OPACITY, t, 1);
        const tx = valueAt(tr.TRANSLATION_X, t, 0), ty = valueAt(tr.TRANSLATION_Y, t, 0);
        const sx = valueAt(tr.SCALE_X, t, 1), sy = valueAt(tr.SCALE_Y, t, 1);
        n.style.opacity = o;
        n.style.transform = `translate(${tx}px, ${ty}px) scale(${sx}, ${sy})`;
        if (trim) { const v = valueAt(tr.PATH_TRIM_END, t, 1); n.querySelectorAll("path").forEach((p) => (p.style.strokeDashoffset = 1 - v)); }
      }
      if (t >= SPLASH.held.start) setHeld(true);
      if (t >= SPLASH.held.loop) setLoop(true);
      if (t >= 10 && !gone) { gone = true; go("home", { t: "dissolve", reset: true }); }
      if (t < 12) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [go]);
  const W = SPLASH.held, k = 350 / 1044;
  return (
    <div className="screen" style={{ alignItems: "center", cursor: "pointer", padding: 0 }} onClick={() => go("home", { t: "dissolve", reset: true })}>
      <svg ref={root} viewBox="0 0 1044 520" width={350} height={520 * k} style={{ position: "absolute", left: "50%", top: "calc(50% - 117px)", marginLeft: -175, overflow: "visible" }} fill="none" aria-label="GoTgt">
        <g data-anim={JSON.stringify(SPLASH.wordmark.tr)} className="sp-part">
          <path transform={`translate(${SPLASH.wordmark.x} ${SPLASH.wordmark.y})`} d={SPLASH.wordmark.d} fill="var(--ink)" />
        </g>
        {["yellow", "green"].map((c) => (
          <g key={c} data-anim={JSON.stringify(SPLASH[c].tr)} style={{ color: "var(--ink)" }}>
            {SPLASH[c].kids.map((p) => (
              <g key={p.n} data-anim={JSON.stringify(p.tr)} data-trim={p.tr.PATH_TRIM_END ? "1" : "0"} className="sp-part">
                <SplashPart k={p} />
              </g>
            ))}
          </g>
        ))}
        {held && (
          <g transform={`translate(${W.yBody + 102.373} 196)`} className="guys" stroke="var(--ink)" strokeWidth="7.8" strokeLinecap="round" strokeLinejoin="round"
            dangerouslySetInnerHTML={{ __html: markup(["yellow", "green"], loop) }} />
        )}
      </svg>
      <p className="t-bodyl" data-tagline="" style={{ position: "absolute", left: 24, right: 24, top: "calc(50% + 263px)", textAlign: "center", fontSize: 17, animation: "splashTag 997ms cubic-bezier(.5,0,.5,1) 6184ms both" }}>Let&apos;s go together!</p>
    </div>
  );
}

/* ---------------- 0a · Circle invite ---------------- */
export function Invite() {
  const { go } = useProto();
  return (
    <Screen>
      <Gap h={40} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        <div style={{ width: 178, height: 170, position: "relative", flex: "none" }}><div style={{ position: "absolute", left: -28, top: -6 }}><Guys colors={["yellow"]} height={178} facing="right" /></div></div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <Face open size={96} />
          <span className="t-caption muted">open spot</span>
        </div>
      </div>
      <Gap h={32} />
      <p className="t-bodyl muted">Maya invited you to her</p>
      <Gap h={4} />
      <span><Marker>food</Marker></span>
      <span className="t-xl">circle</span>
      <Gap h={28} />
      {["See when friends are heading somewhere you could join.", "Join with one tap, or ignore it. No one is told if you don't join.", "Plans disappear once they're over."].map((t, i) => (
        <p key={i} className="t-body hair-top rise" style={{ padding: "12px 0", animationDelay: `${150 + i * 80}ms` }}>{t}</p>
      ))}
      <div className="spacer" />
      <Button kind="accent" fill onClick={() => go("account")}>join Maya&apos;s circle</Button>
      <Gap h={6} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="text" size="M" onClick={() => go("home", { t: "fade", reset: true })}>browse first</Button></div>
    </Screen>
  );
}

/* ---------------- 0a1–0a4 · Account ---------------- */
export function Account() {
  const { go } = useProto();
  return (
    <Screen>
      <NavHeader />
      <h1 className="t-l">create your<br />account</h1>
      <Gap h={12} />
      <p className="t-body muted">You need an account to join Maya&apos;s food circle.</p>
      <Gap h={28} />
      <span className="field-label">Phone number</span>
      <Gap h={8} />
      <label className="input active"><span className="t-heading muted">+1</span><span style={{ width: 1.5, height: 22, background: "var(--line)" }} /><input className="t-heading" defaultValue="(412) 555-0134" inputMode="tel" /></label>
      <Gap h={10} />
      <p className="t-caption muted">We&apos;ll text you a 6-digit code to confirm your number.</p>
      <div className="spacer" />
      <Button fill onClick={() => go("verify")}>send code</Button>
      <Gap h={16} />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}><span style={{ flex: 1, height: 1, background: "var(--line)" }} /><span className="t-caption muted">or</span><span style={{ flex: 1, height: 1, background: "var(--line)" }} /></div>
      <Gap h={16} />
      <Button kind="secondary" fill onClick={() => go("name")}>continue with Apple</Button>
      <Gap h={14} />
      <p className="t-caption muted center">By continuing, you agree to the Terms of Service and Privacy Policy.</p>
    </Screen>
  );
}

export function Verify() {
  const { go } = useProto();
  const [code, setCode] = useState("3815");
  const [sec, setSec] = useState(24);
  useEffect(() => { const t = setInterval(() => setSec((s) => (s > 0 ? s - 1 : 0)), 1000); return () => clearInterval(t); }, []);
  return (
    <Screen>
      <NavHeader />
      <h1 className="t-l">enter the<br />code</h1>
      <Gap h={12} />
      <p className="t-body muted">Sent to +1 (412) 555-0134</p>
      <Gap h={28} />
      <label style={{ position: "relative", display: "flex", gap: 8 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <span key={i} style={{ flex: 1, height: 60, borderRadius: 14, boxShadow: `inset 0 0 0 1.5px ${i === code.length ? "var(--ink)" : "var(--line)"}`, display: "flex", alignItems: "center", justifyContent: "center", transition: "box-shadow 200ms" }}>
            {code[i] && <span key={code[i] + i} className="t-title" style={{ animation: "popIn 260ms var(--ease-out)" }}>{code[i]}</span>}
          </span>
        ))}
        <input value={code} onChange={(e) => { const v = e.target.value.replace(/\D/g, "").slice(0, 6); setCode(v); if (v.length === 6) setTimeout(() => go("name"), 350); }} inputMode="numeric" style={{ position: "absolute", inset: 0, opacity: 0 }} aria-label="code" />
      </label>
      <Gap h={16} />
      <span className="t-strong muted">{sec ? `Resend code in 0:${String(sec).padStart(2, "0")}` : "Resend code"}</span>
      <div className="spacer" />
      <Button fill onClick={() => go("name")}>verify</Button>
    </Screen>
  );
}

export function NameScreen() {
  const { go } = useProto();
  return (
    <Screen>
      <NavHeader />
      <h1 className="t-l">what&apos;s your<br />name?</h1>
      <Gap h={12} />
      <p className="t-body muted">Friends see your name on your plans.</p>
      <Gap h={28} />
      <span className="field-label">Name</span><Gap h={8} />
      <label className="input active"><input className="t-heading" defaultValue="Erin Hsu" /></label>
      <Gap h={20} />
      <span className="field-label">Username</span><Gap h={8} />
      <label className="input"><input className="t-heading" defaultValue="@erinhsu" /></label>
      <Gap h={10} />
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--green)" }} /><span className="t-caption muted">Username available</span></span>
      <div className="spacer" />
      <Button fill onClick={() => go("color")}>continue</Button>
    </Screen>
  );
}

export function ColorScreen() {
  const { go } = useProto();
  const [c, setC] = useState("pink");
  return (
    <Screen>
      <NavHeader />
      <h1 className="t-l">pick your<br />color</h1>
      <Gap h={12} />
      <p className="t-body muted">This color represents you next to your plans and in your friends&apos; lists.</p>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
        <Face key={c} color={c} look="down" size={180} blink style={{ animation: "popIn 420ms var(--ease-out)" }} />
        <span className="t-title">Erin</span>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 16, paddingBottom: 28 }}>
        {["yellow", "blue", "pink", "green"].map((k) => (
          <button key={k} onClick={() => setC(k)} className="press" style={{ width: 64, height: 64, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: c === k ? "inset 0 0 0 2px var(--ink)" : "none", transition: "box-shadow 200ms" }}>
            <Face color={k} look="up" size={52} />
          </button>
        ))}
      </div>
      <Button fill onClick={() => go("friendsSetup")}>continue</Button>
    </Screen>
  );
}

/* ---------------- 0b · Add friends ---------------- */
function Person({ f, sub, trail }) {
  return (
    <div className="row" style={{ height: 64, padding: 0, gap: 14 }}>
      <Face color={f.color} look="right" size={44} />
      <span style={{ flex: 1 }}><span className="t-strong" style={{ display: "block" }}>{f.name}</span><span className="t-caption muted">{sub}</span></span>
      {trail}
    </div>
  );
}
export function FriendsSetup() {
  const { go } = useProto();
  const [added, setAdded] = useState({ Kevin: true, Jon: true, Priya: false, Sam: false });
  const n = Object.values(added).filter(Boolean).length + 1;
  const tog = (k) => setAdded((a) => ({ ...a, [k]: !a[k] }));
  return (
    <Screen>
      <SetupHeader step={1} />
      <Gap h={18} />
      <h1 className="t-l">add your<br />friends</h1>
      <Gap h={12} />
      <p className="t-body muted">Only friends you add can see your plans.</p>
      <Gap h={18} />
      <label className="input" style={{ borderRadius: 999, height: 48, padding: "0 18px" }}><Icon.search style={{ color: "var(--muted)" }} /><input placeholder="Search by name or username" className="t-body" /></label>
      <Gap h={18} />
      <span className="field-label">From your contacts</span>
      <Person f={FRIENDS[0]} sub="Invited you" trail={<span className="t-caption muted">Friends</span>} />
      {FRIENDS.slice(1).map((f) => (
        <Person key={f.name} f={f} sub={f.handle} trail={<Pill label={added[f.name] ? "added" : f.name === "Priya" ? "invite" : "add"} on={added[f.name]} onClick={() => tog(f.name)} />} />
      ))}
      <Gap h={10} />
      <span className="field-label">People you may know</span>
      <Person f={{ name: "Sam", color: "blue" }} sub="Friends with Maya" trail={<Pill label={added.Sam ? "added" : "add"} on={added.Sam} onClick={() => tog("Sam")} />} />
      <div className="spacer" />
      <Button fill onClick={() => go("circlesSetup")}>continue with {n} friends</Button>
    </Screen>
  );
}

/* ---------------- 0c · Pick circles ---------------- */
export function CirclesSetup() {
  const { go } = useProto();
  const [on, setOn] = useState({ food: true, coffee: true, study: true });
  const n = Object.values(on).filter(Boolean).length;
  return (
    <Screen>
      <SetupHeader step={2} />
      <Gap h={28} />
      <h1 className="t-l">what are<br />you into?</h1>
      <Gap h={12} />
      <p className="t-body muted">Circles group your friends by shared interests. Only you can see who is in your circles.</p>
      <Gap h={24} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {["food", "coffee", "study", "gym", "walks", "movies", "thrifting", "climbing"].map((c) => {
          const s = !!on[c];
          return (
            <button key={c} onClick={() => setOn((o) => ({ ...o, [c]: !o[c] }))} className="press" style={{ height: 60, borderRadius: 999, padding: "0 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: s ? "var(--ink)" : "var(--paper)", color: s ? "var(--paper)" : "var(--ink)", boxShadow: s ? "none" : "inset 0 0 0 1.5px var(--line)", transition: "background 250ms, color 250ms" }}>
              <span className="t-heading">{c}</span>
              <span style={{ color: s ? "var(--yellow)" : "var(--line)", transition: "transform 320ms var(--ease-out)", transform: s ? "rotate(0)" : "rotate(-90deg)", display: "flex" }}>{s ? <Icon.check /> : <Icon.plus />}</span>
            </button>
          );
        })}
      </div>
      <Gap h={16} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="text" size="M" onClick={() => go("startCircle")}>start your own circle <Icon.arrow /></Button></div>
      <div className="spacer" />
      <Button fill onClick={() => go("pings")}>join {n} circles</Button>
    </Screen>
  );
}

/* ---------------- 0d · Pings ---------------- */
export function Pings() {
  const { go } = useProto();
  const [on, setOn] = useState({ food: true, coffee: true, study: true });
  return (
    <Screen>
      <SetupHeader step={3} />
      <Gap h={28} />
      <h1 className="t-l">hear when<br />friends head out</h1>
      <Gap h={12} />
      <p className="t-body muted">Choose which circles can notify you when a plan is posted.</p>
      <Gap h={12} />
      {[["food", "2 friends"], ["coffee", "2 friends"], ["study", "1 friend"]].map(([c, s]) => (
        <div key={c} className="row hair" style={{ padding: "16px 0" }}>
          <span style={{ flex: 1 }}><span className="t-heading" style={{ display: "block" }}>{c}</span><span className="t-caption muted">{s}</span></span>
          <Toggle on={on[c]} onChange={(v) => setOn((o) => ({ ...o, [c]: v }))} />
        </div>
      ))}
      <div className="row press" style={{ padding: "16px 0", cursor: "pointer" }} onClick={() => go("quiet")}>
        <span style={{ flex: 1 }}><span className="t-strong" style={{ display: "block" }}>quiet hours</span><span className="t-caption muted">No notifications from 11 PM to 9 AM</span></span>
        <Round kind="outline" icon="arrow" size={36} />
      </div>
      <div className="spacer" />
      <Button fill onClick={() => go("startCircle")}>turn on pings</Button>
      <Gap h={6} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="text" size="M" onClick={() => go("startCircle")}>not now</Button></div>
    </Screen>
  );
}

/* ---------------- 0e · Start your own circle ---------------- */
export function StartCircle() {
  const { go, point } = useProto();
  const [col, setCol] = useState("pink");
  const [members, setMembers] = useState({ Maya: true, Kevin: true, Jon: false });
  const done = () => go("home", { t: "walk", color: col });
  return (
    <Screen>
      <SetupHeader step={4} skip onSkip={done} />
      <Gap h={28} />
      <h1 className="t-l">start your<br />own circle</h1>
      <Gap h={12} />
      <p className="t-body muted">Name a circle and choose which friends are in it. You can edit it later.</p>
      <Gap h={20} />
      <span className="field-label">Name</span><Gap h={8} />
      <label className="input active"><input className="t-heading" defaultValue="late-night eats" maxLength={24} /><span className="t-caption muted">15/24</span></label>
      <Gap h={18} />
      <span className="field-label">Color</span><Gap h={10} />
      <div style={{ display: "flex", gap: 10 }}>
        {["yellow", "blue", "pink", "green"].map((k) => (
          <button key={k} onClick={() => setCol(k)} style={{ width: 52, height: 52, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: col === k ? "inset 0 0 0 2px var(--ink)" : "none", transition: "box-shadow 200ms" }}>
            <span className="swatch" style={{ width: 36, height: 36, borderRadius: 11, background: `var(--${k})`, transform: col === k ? "scale(1.06)" : "none", transition: "transform 250ms var(--ease-out)" }} />
          </button>
        ))}
      </div>
      <Gap h={18} />
      <span className="field-label">Members</span>
      {FRIENDS.slice(0, 3).map((f) => (
        <div key={f.name} className="row" style={{ height: 64, padding: 0, gap: 14 }}>
          <Face color={f.color} look="right" size={44} />
          <span style={{ flex: 1 }}><span className="t-strong" style={{ display: "block" }}>{f.name}</span><span className="t-caption muted">{f.circles}</span></span>
          <Pill label={members[f.name] ? "added" : "add"} on={members[f.name]} onClick={() => setMembers((m) => ({ ...m, [f.name]: !m[f.name] }))} />
        </div>
      ))}
      <div className="spacer" />
      <Button fill onClick={done}>create circle</Button>
    </Screen>
  );
}
