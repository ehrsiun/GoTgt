"use client";
import { useState } from "react";
import { useProto, Screen } from "../proto";
import { Face, Button, Pill, Icon, Toggle } from "../ui";
import { Gap, NavHeader, MenuRow, FRIENDS } from "./common";

function TabHeader({ title }) {
  const { go } = useProto();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 8px" }}>
      <h1 className="t-l">{title}</h1>
      <button onClick={() => go("profile")} aria-label="profile" className="press"><Face color="pink" look="left" size={44} /></button>
    </div>
  );
}

/* ---------------- 6 · Friends ---------------- */
export function Friends() {
  const [req, setReq] = useState("pending");
  return (
    <Screen tab="friends">
      <TabHeader title="friends" />
      <Gap h={8} />
      <label className="input" style={{ borderRadius: 999, height: 48 }}><Icon.search style={{ color: "var(--muted)" }} /><input placeholder="Search by name or username" className="t-body" /></label>
      <Gap h={20} />
      {req !== "gone" && (
        <div style={{ transition: "opacity 300ms, transform 300ms", opacity: req === "pending" ? 1 : 0, transform: req === "pending" ? "none" : "translateX(30px)" }}>
          <span className="field-label">Friend requests</span>
          <div className="row" style={{ gap: 14 }}>
            <Face color="blue" look="right" size={44} />
            <span style={{ flex: 1 }}><span className="t-strong" style={{ display: "block" }}>Sam</span><span className="t-caption muted">Knows Maya</span></span>
            <Pill label="decline" onClick={() => { setReq("leaving"); setTimeout(() => setReq("gone"), 300); }} />
            <Pill label="accept" on onClick={() => { setReq("leaving"); setTimeout(() => setReq("gone"), 300); }} />
          </div>
          <Gap h={10} />
        </div>
      )}
      <span className="field-label">Your friends</span>
      {[...FRIENDS, ...(req === "gone" ? [{ name: "Sam", color: "blue", circles: "food" }] : [])].map((f) => (
        <MenuRow key={f.name} label={<span style={{ display: "flex", alignItems: "center", gap: 14 }}><Face color={f.color} look="right" size={44} /><span><span className="t-strong" style={{ display: "block" }}>{f.name}</span><span className="t-caption muted" style={{ fontWeight: 400 }}>Circles: {f.circles}</span></span></span>} />
      ))}
      <Gap h={16} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="secondary" size="M">invite friends</Button></div>
    </Screen>
  );
}

/* ---------------- 7 · Circles ---------------- */
export const CIRCLES = [["yellow", "food", "4 friends, notifications on"], ["blue", "coffee", "2 friends, notifications on"], ["green", "study", "1 friend, notifications on"], ["pink", "late-night eats", "2 friends, notifications off"]];
export function Circles() {
  const { go } = useProto();
  return (
    <Screen tab="circles">
      <TabHeader title="circles" />
      <p className="t-body muted">Circles group your friends by shared interests. Only you can see who is in your circles.</p>
      <Gap h={12} />
      {CIRCLES.map(([c, n, s]) => (
        <div key={n} className="row hair press" style={{ padding: "16px 0", cursor: "pointer" }} onClick={() => go("circleDetail")}>
          <span className="swatch" style={{ width: 44, height: 44, background: `var(--${c})` }} />
          <span style={{ flex: 1 }}><span className="t-title" style={{ display: "block" }}>{n}</span><span className="t-caption muted">{s}</span></span>
          <Icon.chevron style={{ color: "var(--muted)" }} />
        </div>
      ))}
      <Gap h={16} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="secondary" size="M" onClick={() => go("startCircle")}>start a circle</Button></div>
    </Screen>
  );
}

export function CircleDetail() {
  const { go } = useProto();
  const [notif, setNotif] = useState(true);
  return (
    <Screen>
      <NavHeader title="circle" right="edit" />
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}><span className="swatch" style={{ width: 56, height: 56, borderRadius: 18, background: "var(--yellow)" }} /><span className="t-l">food</span></div>
      <Gap h={8} />
      <p className="t-body muted">You&apos;re notified when these 4 friends post food plans.</p>
      <Gap h={8} />
      <MenuRow label="Notifications" sub="Plans posted to this circle" right={<Toggle on={notif} onChange={setNotif} />} />
      <MenuRow label="Quiet hours" sub="11 PM – 9 AM" onClick={() => go("quiet")} />
      <Gap h={18} />
      <span className="field-label">Members</span>
      {FRIENDS.map((f, i) => (
        <div key={f.name} className="row" style={{ gap: 14, padding: "10px 0" }}>
          <Face color={f.color} look="right" size={44} />
          <span style={{ flex: 1 }}><span className="t-strong" style={{ display: "block" }}>{f.name}</span><span className="t-caption muted">{["added 2 weeks ago", "added 2 weeks ago", "added 5 days ago", "added today"][i]}</span></span>
          <button className="t-caption muted">remove</button>
        </div>
      ))}
      <div className="spacer" />
      <Button kind="secondary" fill>add friends to circle</Button>
      <Gap h={6} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="text" size="M">delete circle</Button></div>
    </Screen>
  );
}

/* ---------------- 8 · Profile ---------------- */
export function Profile() {
  const { go, reset } = useProto();
  return (
    <Screen style={{ alignItems: "stretch" }}>
      <NavHeader title="profile" right="edit" />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Face color="pink" look="down" size={120} blink />
        <Gap h={12} />
        <p className="t-title">Erin Hsu</p>
        <p className="t-body muted">@erinhsu</p>
        <Gap h={14} />
        <div style={{ display: "flex", gap: 8 }}>{["4 friends", "4 circles", "12 plans"].map((s) => <span key={s} className="t-caption" style={{ padding: "6px 14px", borderRadius: 999, background: "var(--mist)" }}>{s}</span>)}</div>
      </div>
      <Gap h={18} />
      <MenuRow label="Notifications" sub="Choose which circles can notify you" onClick={() => go("notif")} />
      <MenuRow label="Quiet hours" value="11 PM – 9 AM" onClick={() => go("quiet")} />
      <MenuRow label="Circles" value="4" onClick={() => go("circles", { t: "fade", reset: true })} />
      <MenuRow label="Account" sub="Phone number, username" />
      <MenuRow label="Help and feedback" />
      <div className="spacer" />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="text" size="M" onClick={() => reset("splash")}>log out</Button></div>
    </Screen>
  );
}

export function NotifSettings() {
  const { go } = useProto();
  const [on, setOn] = useState({ food: true, coffee: true, study: true, "late-night eats": false, heads: true });
  const set = (k) => (v) => setOn((o) => ({ ...o, [k]: v }));
  return (
    <Screen>
      <NavHeader title="notifications" />
      <p className="t-body muted">Choose which circles can notify you when a plan is posted.</p>
      <Gap h={4} />
      {[["food", "4 friends"], ["coffee", "2 friends"], ["study", "1 friend"], ["late-night eats", "2 friends"]].map(([c, s]) => <MenuRow key={c} big label={c} sub={s} right={<Toggle on={on[c]} onChange={set(c)} />} />)}
      <Gap h={18} />
      <span className="field-label">Other</span>
      <MenuRow label="Heads-ups" sub="Updates from people who joined your plan" right={<Toggle on={on.heads} onChange={set("heads")} />} />
      <MenuRow label="Quiet hours" value="11 PM – 9 AM" onClick={() => go("quiet")} />
    </Screen>
  );
}

export function Quiet() {
  const { back } = useProto();
  const [on, setOn] = useState(true);
  const [days, setDays] = useState([1, 1, 1, 1, 1, 0, 0]);
  const [edge, setEdge] = useState("From");
  return (
    <Screen>
      <NavHeader title="quiet hours" />
      <p className="t-body muted">Notifications are paused during quiet hours. Plans still show on Home.</p>
      <Gap h={4} />
      <MenuRow label="Quiet hours" right={<Toggle on={on} onChange={setOn} />} />
      <Gap h={22} />
      <div style={{ display: "flex", gap: 12, opacity: on ? 1 : 0.4, transition: "opacity 300ms" }}>
        {[["From", "11:00 PM"], ["To", "9:00 AM"]].map(([l, v]) => (
          <button key={l} onClick={() => setEdge(l)} style={{ flex: 1, textAlign: "left", padding: "16px 18px", borderRadius: 20, boxShadow: `inset 0 0 0 1.5px ${edge === l ? "var(--ink)" : "var(--line)"}`, transition: "box-shadow 200ms" }}>
            <span className="t-caption muted" style={{ display: "block" }}>{l}</span><span className="t-title">{v}</span>
          </button>
        ))}
      </div>
      <Gap h={22} />
      <span className="field-label">Repeat</span>
      <Gap h={10} />
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {["M", "T", "W", "T", "F", "S", "S"].map((d, i) => <Pill key={i} label={d} on={!!days[i]} onClick={() => setDays((a) => a.map((x, j) => (j === i ? 1 - x : x)))} style={{ width: 44, height: 44, padding: 0 }} />)}
      </div>
      <div className="spacer" />
      <Button fill onClick={back}>save</Button>
    </Screen>
  );
}
