"use client";
import { useEffect, useState } from "react";
import { useProto, Screen, Sheet } from "../proto";
import { Face, Guys, Button, Marker, Pill, Icon, Round, Spots, Ticking } from "../ui";
import { Gap, NavHeader, Field } from "./common";

/* ---------------- 4a · Lock screen notification ---------------- */
export function Lock() {
  const { go } = useProto();
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 500); return () => clearTimeout(t); }, []);
  return (
    <div className="screen" style={{ padding: 0, background: "#bfb2a3 url(/lock.jpg) center / cover no-repeat" }}>
      {show && (
        <div className="notif-in" style={{ position: "absolute", left: 16, right: 16, top: 308, background: "rgba(255,255,255,.96)", color: "var(--ink)", borderRadius: 28, padding: 20, boxShadow: "0 12px 32px rgba(0,0,0,.12)", display: "flex", flexDirection: "column", gap: 14 }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Face color="yellow" look="rightDown" size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span className="t-label muted" style={{ fontWeight: 400 }}>GoTgt</span><span className="t-caption muted">now</span></div>
              <p className="t-strong">Maya is getting ramen</p>
              <p className="t-caption muted">1 spot left, leaving in 10 min</p>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Button kind="accent" size="M" style={{ flex: 1 }} onClick={() => go("youreIn", { t: "fade", reset: true })}>I&apos;m in</Button>
            <Button kind="secondary" size="M" style={{ flex: 1 }} onClick={() => go("detail", { t: "up", reset: true })}>see plan</Button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- 4b · Plan detail (sheet over Home) ---------------- */
export function Detail() {
  const { go, back, point } = useProto();
  return (
    <Sheet base="home" style={{ top: 64, paddingTop: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", height: 48, flex: "none" }}>
        <span className="t-heading">food circle</span>
        <button onClick={() => go("options", { t: "sheet" })} aria-label="plan options" className="press" style={{ height: 36, padding: "0 0 0 12px", display: "flex", alignItems: "center" }}><Icon.more /></button>
      </div>
      <Gap h={8} />
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 161, flex: "none" }}>
        <div style={{ width: 170, height: 161, position: "relative", flex: "none" }}><div style={{ position: "absolute", left: -28, top: -2 }}><Guys colors={["yellow"]} height={176} facing="right" /></div></div>
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, paddingBottom: 0 }}><Face open size={80} /><span className="t-caption muted">open spot</span></span>
      </div>
      <Gap h={12} />
      <p className="t-bodyl muted">Posted by Maya</p>
      <span><Marker>ramen</Marker></span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 140, flex: "none", paddingBottom: 12 }}>
        <Ticking start={582} className="t-xl" style={{ fontSize: 120, lineHeight: "120px", letterSpacing: "-0.04em" }} />
        <span style={{ paddingBottom: 0 }}><span className="t-body muted" style={{ display: "block" }}>left</span><span className="t-strong">until 12:40</span></span>
      </div>
      <Gap h={12} />
      <Field label="where" value="Ramen Nakamura" />
      <Field label="partner deal" value="Free egg for 2+ people" />
      <div className="row" style={{ height: 52, padding: 0 }}><span className="field-label">spots</span><Spots joined={1} size={24} colors={["yellow", "blue", "green"]} /><span className="t-strong">1 spot left</span></div>
      <div className="spacer" />
      <Button kind="accent" fill onClick={(e) => go("youreIn", { t: "fill", color: "yellow", from: point(e), reset: true })}>I&apos;m in</Button>
    </Sheet>
  );
}

export function Options() {
  const { go, back } = useProto();
  const toHome = () => go("home", { t: "down", reset: true });
  const rows = [
    ["mute", "Mute food circle for today", "You won't see plans from this circle until tomorrow.", toHome],
    ["mute", "Mute Maya for today", "You won't see plans from Maya until tomorrow.", toHome],
    ["bell", "Notification settings", "Choose which circles can notify you.", () => go("notif")],
    ["flag", "Report this plan", null, toHome],
  ];
  return (
    <Sheet base="detail" style={{ top: 388 }}>
      <p className="t-heading" style={{ padding: "0 0 8px" }}>plan options</p>
      {rows.map(([ic, a, b, fn]) => {
        const I = Icon[ic];
        return (
          <button key={a} className="row hair press" onClick={fn} style={{ width: "100%", textAlign: "left", padding: "14px 0", gap: 18 }}>
            <span style={{ width: 36, height: 36, borderRadius: 18, background: "var(--mist)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}><I /></span>
            <span style={{ flex: 1 }}><span className="t-strong" style={{ display: "block" }}>{a}</span>{b && <span className="t-caption muted">{b}</span>}</span>
            {ic === "bell" && <Icon.chevron style={{ color: "var(--muted)" }} />}
          </button>
        );
      })}
      <div className="spacer" />
      <Button kind="secondary" fill onClick={back}>cancel</Button>
    </Sheet>
  );
}

/* ---------------- 4c · You're in ---------------- */
function YoureInBase({ colors, place, notified, deal, faces, headsUp, onHome }) {
  const { go } = useProto();
  const group = colors.length > 2;
  return (
    <Screen style={{ alignItems: "center" }}>
      <div style={{ alignSelf: "flex-end", height: 48, flex: "none" }}><Round kind="outline" icon="down" onClick={() => go("home", { t: "down", reset: true })} label="close" /></div>
      <Gap h={40} />
      <div data-fill-target="" style={{ height: group ? 127 : 170, display: "flex", alignItems: "center", justifyContent: "center" }}><Guys colors={colors} height={group ? 112 : 151} /></div>
      <Gap h={36} />
      <p className="t-xl center rise">you&apos;re in.</p>
      <Gap h={10} />
      <p className="t-bodyl muted center rise" style={{ animationDelay: "80ms" }}>{place}<br />{notified}</p>
      <Gap h={20} />
      {deal && <span className="rise" style={{ animationDelay: "160ms", display: "inline-flex", alignItems: "center", gap: 8, height: 42, padding: "0 16px", borderRadius: 999, background: "var(--mist)" }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--green)" }} /><span className="t-strong">{deal}</span></span>}
      {deal && <Gap h={28} />}
      <span className="rise" style={{ animationDelay: "220ms", display: "flex", alignItems: "center", gap: 8 }}>{faces.map((f, i) => <Face key={i} color={f[0]} look={f[1]} size={48} />)}<span className="t-strong">{faces.length} going</span></span>
      <div className="spacer" />
      {headsUp && <Button kind="text" size="M" onClick={() => go("headsUp")}>send a heads-up</Button>}
      {headsUp && <Gap h={8} />}
      <Button kind="secondary" fill onClick={onHome}>back to home</Button>
    </Screen>
  );
}
export function YoureIn() {
  const { go } = useProto();
  return <YoureInBase colors={["yellow", "green"]} place="Ramen Nakamura at 12:40" notified="Maya has been notified." deal="Deal unlocked: free egg" faces={[["yellow", "rightDown"], ["pink", "leftDown"]]} headsUp onHome={() => go("home", { t: "walk", color: "yellow" })} />;
}
export function YoureInGroup() {
  const { go } = useProto();
  return <YoureInBase colors={["green", "pink", "blue"]} place="Costco Waterfront at 12:40" notified="Kevin and Jon have been notified." faces={[["green", "rightDown"], ["pink", "leftDown"], ["blue", "leftDown"]]} onHome={() => go("home", { t: "fade", reset: true })} />;
}

/* ---------------- 4d · Heads-up ---------------- */
export function HeadsUp() {
  const { go } = useProto();
  const [pick, setPick] = useState("on my way");
  return (
    <Screen>
      <NavHeader title="heads-up" tight />
      <span><Marker>ramen</Marker></span>
      <p className="t-bodyl muted">Ramen Nakamura at 12:40</p>
      <Gap h={24} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Face color="yellow" look="rightDown" size={48} /><Face color="pink" look="leftDown" size={48} /><span className="t-body muted">Maya and you are going</span></div>
      <Gap h={32} />
      <span className="t-label" style={{ fontWeight: 400 }}>Send Maya a quick update</span>
      <Gap h={6} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["on my way", "5 min late", "10 min late", "save me a seat"].map((p) => <Pill key={p} dark label={p} on={pick === p} onClick={() => setPick(p)} />)}</div>
      <Gap h={24} />
      <div style={{ display: "flex", gap: 12, alignItems: "center", height: 68, padding: "0 16px", borderRadius: 20, background: "var(--mist)" }}>
        <Face color="pink" look="rightDown" size={32} />
        <span><span key={pick} className="t-strong" style={{ display: "block", animation: "riseIn 300ms var(--ease-out)" }}>{pick}</span><span className="t-caption muted">Sent to Maya at 12:33</span></span>
      </div>
      <div className="spacer" />
      <Button fill onClick={() => go("home", { t: "fade", reset: true })}>send heads-up</Button>
      <Gap h={6} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="text" size="M" onClick={() => go("home", { t: "fade", reset: true })}>cancel my spot</Button></div>
    </Screen>
  );
}
