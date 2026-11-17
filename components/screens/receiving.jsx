"use client";
import { useEffect, useState } from "react";
import { useProto, Screen, Sheet } from "../proto";
import { Face, Guys, Button, Marker, Pill, Icon, Round, Spots, Ticking } from "../ui";
import { Gap, NavHeader, Field } from "./common";

/* ---------------- 4a · Lock screen notification ---------------- */
export function Lock() {
  const { go, point } = useProto();
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 500); return () => clearTimeout(t); }, []);
  return (
    <div className="screen" style={{ padding: "96px 16px 34px", alignItems: "center", background: "radial-gradient(120% 70% at 85% 10%, #fbf6ee 0%, transparent 55%), radial-gradient(90% 60% at 10% 85%, #8f8274 0%, transparent 60%), linear-gradient(160deg, #d8ccbb 0%, #efe6da 35%, #b7a893 65%, #e9e0d3 100%)", color: "#fff" }}>
      <p style={{ fontSize: 18, fontWeight: 600, opacity: 0.9 }}>Tuesday, March 4</p>
      <p style={{ fontSize: 104, lineHeight: 1, fontWeight: 600, letterSpacing: "-0.02em", textShadow: "0 2px 20px rgba(0,0,0,.08)" }}>9:41</p>
      <Gap h={40} />
      {show && (
        <div className="rise" style={{ width: "100%", background: "rgba(255,255,255,.94)", color: "var(--ink)", borderRadius: 28, padding: 18, boxShadow: "0 12px 32px rgba(0,0,0,.1)", backdropFilter: "blur(20px)" }}>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <Face color="yellow" look="right" size={44} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span className="t-label muted">GoTgt</span><span className="t-caption muted">now</span></div>
              <p className="t-strong">Maya is getting ramen</p>
              <p className="t-caption muted">1 spot left, leaving in 10 min</p>
            </div>
          </div>
          <Gap h={14} />
          <div style={{ display: "flex", gap: 8 }}>
            <Button kind="accent" size="M" style={{ flex: 1 }} onClick={(e) => go("youreIn", { t: "fill", color: "yellow", from: point(e), reset: true })}>I&apos;m in</Button>
            <Button kind="secondary" size="M" style={{ flex: 1 }} onClick={() => go("detail", { t: "fade", reset: true })}>see plan</Button>
          </div>
        </div>
      )}
      <div className="spacer" />
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between", padding: "0 30px" }}>
        {["◐", "◉"].map((x, i) => <span key={i} style={{ width: 50, height: 50, borderRadius: 25, background: "rgba(0,0,0,.25)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>{x}</span>)}
      </div>
      <Gap h={18} />
      <span style={{ width: 134, height: 5, borderRadius: 3, background: "#fff" }} />
    </div>
  );
}

/* ---------------- 4b · Plan detail (sheet over Home) ---------------- */
export function Detail() {
  const { go, point } = useProto();
  return (
    <Sheet base="home" style={{ top: 64 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 6 }}>
        <span className="t-heading">food circle</span>
        <button onClick={() => go("options", { t: "sheet" })} aria-label="plan options" className="round" style={{ width: 36, height: 36 }}><Icon.more /></button>
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 6 }}>
        <Guys colors={["yellow"]} height={130} facing="right" />
        <span style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><Face open size={80} /><span className="t-caption muted">open spot</span></span>
      </div>
      <Gap h={14} />
      <p className="t-bodyl muted">Posted by Maya</p>
      <span><Marker>ramen</Marker></span>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginTop: 4 }}>
        <Ticking start={582} className="t-xl" style={{ fontSize: 104, lineHeight: "96px", letterSpacing: "-0.04em" }} />
        <span style={{ paddingBottom: 6 }}><span className="t-body muted" style={{ display: "block" }}>left</span><span className="t-strong">until 12:40</span></span>
      </div>
      <Gap h={10} />
      <Field label="where" value="Ramen Nakamura" />
      <Field label="partner deal" value="Free egg for 2+ people" />
      <div className="row"><span className="field-label">spots</span><Spots joined={1} size={22} /><span className="t-strong">1 spot left</span></div>
      <div className="spacer" />
      <Button kind="accent" fill onClick={(e) => go("youreIn", { t: "fill", color: "yellow", from: point(e), reset: true })}>I&apos;m in</Button>
    </Sheet>
  );
}

export function Options() {
  const { go, back } = useProto();
  const rows = [
    ["mute", "Mute food circle for today", "You won't see plans from this circle until tomorrow.", () => back()],
    ["mute", "Mute Maya for today", "You won't see plans from Maya until tomorrow.", () => back()],
    ["bell", "Notification settings", "Choose which circles can notify you.", () => go("notif")],
    ["flag", "Report this plan", null, () => back()],
  ];
  return (
    <Sheet base="detail" style={{ top: 360 }}>
      <p className="t-heading" style={{ padding: "6px 0 10px" }}>plan options</p>
      {rows.map(([ic, a, b, fn]) => {
        const I = Icon[ic];
        return (
          <button key={a} className="row hair press" onClick={fn} style={{ width: "100%", textAlign: "left", padding: "14px 0" }}>
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
function YoureInBase({ colors, place, notified, deal, faces, color, headsUp }) {
  const { go } = useProto();
  return (
    <Screen style={{ alignItems: "center" }}>
      <div style={{ alignSelf: "flex-end", padding: "20px 0" }}><Round kind="outline" icon="down" onClick={() => go("home", { t: "fade", reset: true })} label="close" /></div>
      <Gap h={20} />
      <div data-fill-target="" style={{ animation: "fadeIn 400ms both" }}><Guys colors={colors} height={colors.length > 2 ? 104 : 124} /></div>
      <Gap h={36} />
      <p className="t-xl center rise">you&apos;re in.</p>
      <Gap h={10} />
      <p className="t-bodyl muted center rise" style={{ animationDelay: "80ms" }}>{place}<br />{notified}</p>
      <Gap h={20} />
      {deal && <span className="rise" style={{ animationDelay: "160ms", display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 999, background: "var(--mist)" }}><span style={{ width: 8, height: 8, borderRadius: 4, background: "var(--green)" }} /><span className="t-strong">{deal}</span></span>}
      <Gap h={28} />
      <span className="rise" style={{ animationDelay: "220ms", display: "flex", alignItems: "center", gap: 8 }}>{faces.map((f, i) => <Face key={i} color={f[0]} look={f[1]} size={48} />)}<span className="t-strong">{faces.length} going</span></span>
      <div className="spacer" />
      {headsUp && <Button kind="text" size="M" onClick={() => go("headsUp")}>send a heads-up</Button>}
      <Gap h={8} />
      <Button kind="secondary" fill onClick={() => go("home", { t: "walk", color })}>back to home</Button>
    </Screen>
  );
}
export function YoureIn() {
  return <YoureInBase colors={["yellow", "pink"]} color="yellow" place="Ramen Nakamura at 12:40" notified="Maya has been notified." deal="Deal unlocked: free egg" faces={[["yellow", "right"], ["pink", "left"]]} headsUp />;
}
export function YoureInGroup() {
  return <YoureInBase colors={["green", "pink", "blue"]} color="green" place="Costco Waterfront at 12:40" notified="Kevin and Jon have been notified." faces={[["green", "right"], ["pink", "right"], ["blue", "left"]]} />;
}

/* ---------------- 4d · Heads-up ---------------- */
export function HeadsUp() {
  const { go } = useProto();
  const [pick, setPick] = useState("on my way");
  const [sent, setSent] = useState(null);
  return (
    <Screen>
      <NavHeader title="heads-up" />
      <span><Marker>ramen</Marker></span>
      <p className="t-bodyl muted">Ramen Nakamura at 12:40</p>
      <Gap h={20} />
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}><Face color="yellow" look="right" size={48} /><Face color="pink" look="left" size={48} /><span className="t-body muted">Maya and you are going</span></div>
      <Gap h={28} />
      <span className="t-label">Send Maya a quick update</span>
      <Gap h={12} />
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{["on my way", "5 min late", "10 min late", "save me a seat"].map((p) => <Pill key={p} label={p} on={pick === p} onClick={() => setPick(p)} />)}</div>
      <Gap h={24} />
      {sent && (
        <div key={sent.t} className="rise" style={{ display: "flex", gap: 12, alignItems: "center", padding: "14px 16px", borderRadius: 20, background: "var(--mist)" }}>
          <Face color="pink" look="right" size={32} />
          <span><span className="t-strong" style={{ display: "block" }}>{sent.msg}</span><span className="t-caption muted">Sent to Maya at 12:33</span></span>
        </div>
      )}
      <div className="spacer" />
      <Button fill onClick={() => setSent({ msg: pick, t: Date.now() })}>send heads-up</Button>
      <Gap h={6} />
      <div style={{ display: "flex", justifyContent: "center" }}><Button kind="text" size="M" onClick={() => go("home", { t: "fade", reset: true })}>cancel my spot</Button></div>
    </Screen>
  );
}
