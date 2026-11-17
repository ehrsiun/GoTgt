"use client";
import { useEffect, useState } from "react";
import { useProto, Screen, Sheet } from "../proto";
import { Face, Guys, Button, Marker, Chip, Pill, Icon, Round, Spots, PlanRow, SectionHeader, Ticking } from "../ui";
import { Gap, NavHeader } from "./common";

/* ---------------- Home ---------------- */
const SUGGEST = ["grab lunch", "get coffee", "hit the gym"];
function Prompt({ empty }) {
  const { go } = useProto();
  const [i, setI] = useState(0);
  useEffect(() => { const t = setInterval(() => setI((v) => (v + 1) % SUGGEST.length), 3200); return () => clearInterval(t); }, []);
  return (
    <button onClick={() => go("newPost", { t: "up" })} style={{ textAlign: "left", position: "relative", zIndex: 1 }} className="press">
      <span className="t-l" style={{ display: "block" }}>ready to</span>
      <span key={i} className="t-l muted" style={{ display: "inline-block", textDecoration: "underline", textDecorationColor: "var(--yellow)", textDecorationThickness: 3, textUnderlineOffset: 6, animation: "riseIn 500ms var(--ease-out) both" }}>{SUGGEST[i]}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 14 }}><span className="t-l">Tgt?</span><Round kind="outline" icon="arrow" size={40} /></span>
    </button>
  );
}

export function Home() {
  const { go, point } = useProto();
  return (
    <Screen tab="home">
      <div style={{ position: "absolute", right: -46, top: 64, zIndex: 0 }}><Guys colors={["yellow"]} height={170} /></div>
      <Gap h={44} />
      <Prompt />
      <Gap h={20} />
      <div style={{ display: "flex", gap: 8 }}>
        {["coffee", "study", "gym"].map((c) => <Chip key={c} label={c} onClick={() => go("newPost", { t: "up" })} />)}
      </div>
      <Gap h={36} />
      <SectionHeader title="out right now" count={3} link="see all" onLink={() => go("active", { t: "tab" })} />
      <Gap h={4} />
      <PlanRow color="yellow" activity="ramen" meta="Maya · Tsukiya" time="14 min" joined={1} onClick={() => go("detail", { t: "sheet" })} />
      <PlanRow color="green" activity="Costco run" meta="Kevin · Waterfront" time="5 min" joined={2} onClick={() => go("active", { t: "tab" })} />
      <PlanRow color="blue" activity="bouldering" meta="Dev · Ascend" time="41 min" joined={1} onClick={() => go("detail", { t: "sheet" })} />
    </Screen>
  );
}

export function HomeEmpty() {
  const { go } = useProto();
  return (
    <Screen tab="home">
      <Gap h={44} />
      <Prompt />
      <Gap h={40} />
      <SectionHeader title="out right now" count={0} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, paddingBottom: 60 }}>
        <Face color="yellow" look="up" size={96} blink />
        <Gap h={6} />
        <p className="t-title center">No plans right now</p>
        <p className="t-body muted center">You&apos;ll be notified about food, coffee and study plans.</p>
        <Gap h={6} />
        <Button kind="accent" size="M" onClick={() => go("newPost", { t: "up" })}>post a plan</Button>
      </div>
    </Screen>
  );
}

/* ---------------- 2 · New post ---------------- */
export function NewPost() {
  const { go, back, point } = useProto();
  const [act, setAct] = useState("lunch");
  const [spots, setSpots] = useState(2);
  const [mins, setMins] = useState("15 min");
  return (
    <Screen>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 0" }}>
        <button className="t-strong muted" onClick={back}>cancel</button>
        <span className="t-heading">new plan</span>
        <button className="t-strong muted">drafts</button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}>
        <Marker key={act}>{act}</Marker><span className="t-xl" style={{ color: "var(--line)" }}>Tgt?</span>
      </div>
      <Gap h={14} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["lunch", "coffee", "study"].map((c) => <Chip key={c} label={c} on={act === c} onClick={() => setAct(c)} />)}
        <Chip label="other" onClick={() => go("activity", { t: "sheet" })} />
      </div>
      <Gap h={12} />
      <span className="field-label">where</span>
      <Gap h={8} />
      <button className="press" onClick={() => go("place", { t: "sheet" })} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", borderRadius: 16, background: "var(--mist)", textAlign: "left" }}>
        <Icon.pin />
        <span style={{ flex: 1 }}><span className="t-strong" style={{ display: "block" }}>Ramen Nakamura</span><span className="t-caption muted">Tsukiya St, 4 min walk</span></span>
        <span className="t-strong">change</span>
      </button>
      <div className="row hair"><span className="field-label">partner deal</span><span className="t-strong" style={{ flex: 1, textAlign: "right" }}>Free egg for 2+ people</span></div>
      <div className="row hair">
        <span style={{ flex: 1 }}><span className="field-label" style={{ display: "block" }}>spots available</span><span key={spots} className="t-l tick" style={{ display: "inline-block" }}>{spots}</span></span>
        <Round kind="outline" icon="up" onClick={() => setSpots((s) => Math.min(8, s + 1))} label="more spots" />
        <Round kind="ink" icon="down" onClick={() => setSpots((s) => Math.max(1, s - 1))} label="fewer spots" />
      </div>
      <div className="hair" style={{ padding: "12px 0" }}>
        <span className="field-label">time to join</span><Gap h={10} />
        <div style={{ display: "flex", gap: 8 }}>{["15 min", "30 min", "1 hr"].map((m) => <Pill key={m} label={m} on={mins === m} grow onClick={() => setMins(m)} />)}</div>
      </div>
      <div style={{ padding: "12px 0" }}>
        <span className="field-label">who gets notified</span><Gap h={10} />
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          {["yellow", "green", "blue", "pink"].map((c) => <Face key={c} color={c} look="right" size={40} />)}
          <span className="t-body muted" style={{ marginLeft: 8 }}>4 friends in food circle</span>
        </div>
      </div>
      <div className="spacer" />
      <Button kind="accent" fill onClick={(e) => go("live", { t: "fill", color: "pink", from: point(e), reset: true })}>send out for {mins}</Button>
    </Screen>
  );
}

export function Place() {
  const { back } = useProto();
  const [sel, setSel] = useState("Ramen Nakamura");
  const rows = [["Ramen Nakamura", "Japanese · 4 min walk", true], ["Menya Ichi", "Japanese · 7 min walk"], ["Ippudo Downtown", "Japanese · 11 min walk", true], ["Noodle Bar 21", "Asian fusion · 14 min walk"]];
  return (
    <Sheet base="newPost" style={{ top: 96 }}>
      <p className="t-heading" style={{ padding: "8px 0 16px" }}>choose a place</p>
      <label className="input active" style={{ borderRadius: 999, height: 48 }}><Icon.search /><input defaultValue="ramen" /><Icon.close style={{ color: "var(--muted)" }} /></label>
      <div className="row hair press" style={{ padding: "16px 0", cursor: "pointer" }}>
        <span style={{ width: 36, height: 36, borderRadius: 18, background: "var(--mist)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon.pin /></span>
        <span><span className="t-strong" style={{ display: "block" }}>Use current location</span><span className="t-caption muted">Tsukiya St &amp; 5th Ave</span></span>
      </div>
      <Gap h={14} />
      <span className="t-caption muted">Nearby, closest first</span>
      {rows.map(([n, s, deal]) => (
        <button key={n} className="row hair" onClick={() => setSel(n)} style={{ textAlign: "left", width: "100%" }}>
          <span style={{ flex: 1 }}><span className="t-strong" style={{ display: "block" }}>{n}</span><span className="t-caption muted">{s}</span></span>
          {deal && <span className="t-label" style={{ background: "var(--green)", borderRadius: 999, padding: "3px 8px" }}>DEAL</span>}
          <span style={{ width: 24, height: 24, borderRadius: 12, boxShadow: sel === n ? "none" : "inset 0 0 0 1.5px var(--line)", background: sel === n ? "var(--ink)" : "transparent", color: "var(--paper)", display: "flex", alignItems: "center", justifyContent: "center", transition: "background 200ms" }}>{sel === n && <Icon.check width="12" height="12" />}</span>
        </button>
      ))}
      <Gap h={14} />
      <p className="t-caption muted">Places tagged DEAL offer a discount to groups.</p>
      <div className="spacer" />
      <Button fill onClick={back}>use {sel}</Button>
    </Sheet>
  );
}

export function Activity() {
  const { back } = useProto();
  const [v, setV] = useState("boba run");
  return (
    <Sheet base="newPost" style={{ top: 96 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0 16px" }}><span className="t-heading">new activity</span><button className="t-strong muted" onClick={back}>cancel</button></div>
      <label className="input active"><input className="t-heading" value={v} maxLength={24} onChange={(e) => setV(e.target.value)} /><span className="t-caption muted">{v.length}/24</span></label>
      <Gap h={8} />
      <p className="t-caption muted">Friends see this as the plan&apos;s title.</p>
      <Gap h={22} />
      <span className="t-caption muted">Recent</span><Gap h={8} />
      <div style={{ display: "flex", gap: 8 }}>{["library", "groceries", "boba"].map((x) => <Pill key={x} label={x} onClick={() => setV(x)} />)}</div>
      <Gap h={22} />
      <span className="t-caption muted">Suggested</span><Gap h={8} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["gym", "walk", "thrifting", "movie", "dinner"].map((x) => <Pill key={x} label={x} onClick={() => setV(x)} />)}</div>
      <div className="spacer" />
      <Button fill onClick={back}>add activity</Button>
    </Sheet>
  );
}

/* ---------------- 3 · Post is live ---------------- */
export function Live() {
  const { go } = useProto();
  const [joined, setJoined] = useState(1);
  useEffect(() => { const t = setTimeout(() => setJoined(2), 3200); return () => clearTimeout(t); }, []);
  return (
    <Screen tab="home">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--green)", animation: "blink 1.6s infinite" }} /><span className="t-label">Posted to food circle</span></span>
        <button className="t-strong muted" onClick={() => go("endPlan", { t: "sheet" })}>end early</button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 10 }}><Marker className="t-l">lunch</Marker><span className="t-l">Tgt</span></div>
      <Gap h={6} />
      <p className="t-body muted">Ramen Nakamura</p>
      <Gap h={18} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12 }}>
        <Ticking start={265} className="t-xl" style={{ fontSize: 112, lineHeight: "100px", letterSpacing: "-0.04em" }} />
        <span className="t-body muted" style={{ paddingBottom: 8 }}>left to join</span>
      </div>
      <Gap h={24} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span data-fill-target=""><Face color="pink" look="right" size={64} /></span>
        {[0, 1].map((i) => (i === 0 && joined >= 2 ? <Face key="k" color="green" look="left" size={64} style={{ animation: "popIn 450ms var(--ease-out)" }} /> : <Face key={i} open size={64} />))}
        <span style={{ marginLeft: 6 }}><span className="t-strong" style={{ display: "block" }}>{joined} joined</span><span className="t-caption muted">{3 - joined} spot{3 - joined === 1 ? "" : "s"} left</span></span>
      </div>
      <Gap h={16} />
      <span style={{ alignSelf: "flex-start", display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 16px", borderRadius: 999, background: joined >= 2 ? "var(--ink)" : "var(--mist)", color: joined >= 2 ? "var(--paper)" : "var(--ink)", transition: "all 400ms var(--ease-out)" }}>
        <span className="t-label" style={{ color: joined >= 2 ? "var(--green)" : "var(--muted)" }}>DEAL</span>
        <span className="t-strong">{joined >= 2 ? "Unlocked: free egg" : "Free egg for 2+ people"}</span>
      </span>
      <div className="spacer" />
      <SectionHeader title="also out" count={2} link="see all" onLink={() => go("active", { t: "tab" })} />
      <PlanRow color="green" activity="Costco run" meta="Kevin · Costco Waterfront" time="12:40" joined={2} onClick={() => go("active", { t: "tab" })} />
    </Screen>
  );
}

export function EndPlan() {
  const { go, back } = useProto();
  return (
    <Sheet base="live">
      <div style={{ display: "flex", gap: 16, alignItems: "center", padding: "8px 0 16px" }}>
        <Face color="yellow" look="right" size={64} />
        <span><span className="t-strong" style={{ display: "block" }}>end this plan?</span><span className="t-body muted">1 person has joined.</span></span>
      </div>
      <p className="t-body muted">Kevin will be notified that the plan has ended. The partner deal will no longer apply.</p>
      <Gap h={20} />
      <Button fill onClick={() => go("ended", { t: "fade", reset: true })}>end plan</Button>
      <Gap h={6} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="text" size="M" onClick={back}>keep it open</Button></div>
    </Sheet>
  );
}

export function Ended() {
  const { go } = useProto();
  return (
    <Screen style={{ alignItems: "center" }}>
      <div style={{ alignSelf: "flex-end", padding: "20px 0" }}><Round kind="outline" icon="down" onClick={() => go("home", { t: "fade", reset: true })} label="close" /></div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%" }}>
        <Face color="pink" look="down" size={120} blink style={{ animation: "popIn 500ms var(--ease-out)" }} />
        <Gap h={24} />
        <p className="t-l center">plan ended</p>
        <p className="t-bodyl muted center">lunch Tgt at Ramen Nakamura</p>
        <Gap h={24} />
        <div style={{ width: "100%", background: "var(--mist)", borderRadius: 20, padding: "4px 20px" }}>
          {[["Posted", "12:15"], ["Ended", "12:31"], ["Joined", "Kevin"]].map(([a, b], i) => (
            <div key={a} className={`row ${i < 2 ? "hair" : ""}`}><span className="t-caption muted" style={{ flex: 1 }}>{a}</span><span className="t-strong">{b}</span></div>
          ))}
        </div>
        <Gap h={14} />
        <p className="t-caption muted center">Kevin was notified that the plan ended.</p>
      </div>
      <Button fill onClick={() => go("newPost", { t: "up" })}>post another plan</Button>
      <Gap h={6} />
      <Button kind="text" size="M" onClick={() => go("home", { t: "fade", reset: true })}>back to home</Button>
    </Screen>
  );
}

/* ---------------- 3b · Out right now (swipe deck) ---------------- */
const DECK = [
  { color: "green", circle: "Groceries circle", leaves: "Leaves in 8 min", a: "Costco", b: "run", who: "Kevin is going to Costco Waterfront.", joined: 2, to: "youreInGroup" },
  { color: "pink", circle: "Coffee circle", leaves: "Leaves in 15 min", a: "boba", b: "break", who: "Priya is getting boba at Kung Fu Tea.", joined: 1, to: "youreIn" },
  { color: "blue", circle: "Study circle", leaves: "Leaves in 22 min", a: "study", b: "session", who: "Jon is studying at Hunt Library.", joined: 1, to: "youreIn" },
];
export function Active() {
  const { go, point } = useProto();
  const [i, setI] = useState(0);
  const [out, setOut] = useState(false);
  const c = DECK[i];
  const skip = () => { if (out) return; setOut(true); setTimeout(() => { setOut(false); setI((v) => v + 1); }, 320); };
  return (
    <Screen tab="active">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 0 12px" }}>
        <span className="t-heading">out right now</span>
        <span className="t-strong muted">{Math.min(i + 1, DECK.length)} of {DECK.length}</span>
      </div>
      {c ? (
        <>
          <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
            {DECK[i + 1] && <div className="card" style={{ position: "absolute", inset: "0 18px 28px", top: 0, background: "var(--mist)" }} />}
            <div key={i} className="card" style={{ position: "absolute", inset: "14px 0 0", boxShadow: "inset 0 0 0 1.5px var(--line)", padding: "26px 22px 22px", display: "flex", flexDirection: "column", overflow: "hidden", background: "var(--paper)", animation: out ? "cardOut 320ms cubic-bezier(.4,0,1,1) forwards" : "cardIn 360ms var(--ease-out)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span className="t-label muted">{c.circle.toUpperCase()}</span><span className="t-caption muted">{c.leaves}</span></div>
              <div style={{ display: "flex", justifyContent: "flex-end", margin: "8px -10px 0 0" }}><Guys colors={[c.color]} height={190} /></div>
              <div className="spacer" />
              <span><Marker color={c.color}>{c.a}</Marker></span>
              <span className="t-xl">{c.b}</span>
              <Gap h={10} />
              <p className="t-body muted">{c.who}</p>
              <Gap h={12} />
              <Spots joined={c.joined} colors={[c.color, "blue", "green"]} />
            </div>
          </div>
          <Gap h={12} />
          <div style={{ display: "flex", gap: 10 }}>
            <Button kind="secondary" style={{ flex: 1 }} onClick={skip}>skip</Button>
            <Button kind="accent" style={{ flex: 1, background: `var(--${c.color})` }} onClick={(e) => go(c.to, { t: "fill", color: c.color, from: point(e), reset: true })}>I&apos;m in</Button>
          </div>
        </>
      ) : (
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
          <Face color="yellow" look="up" size={88} blink />
          <p className="t-title center">You&apos;re all caught up</p>
          <p className="t-body muted center">New plans from your circles will show up here.</p>
          <Button kind="secondary" size="M" onClick={() => setI(0)}>see them again</Button>
        </div>
      )}
    </Screen>
  );
}
