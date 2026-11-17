"use client";
import { useProto } from "../proto";
import { Icon, Round } from "../ui";

export const FRIENDS = [
  { name: "Maya", color: "yellow", handle: "@maya.l", circles: "food, coffee" },
  { name: "Kevin", color: "green", handle: "@kevinxu", circles: "groceries, food" },
  { name: "Jon", color: "blue", handle: "@jonpark", circles: "study" },
  { name: "Priya", color: "pink", handle: "@priya.r", circles: "coffee" },
];

export function Gap({ h = 16 }) { return <div style={{ height: h, flex: "none" }} />; }

/* Back button + optional centered title + optional right action */
export function NavHeader({ title, right, onRight, onBack, close }) {
  const { back } = useProto();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0", flex: "none" }}>
      <Round kind="outline" icon={close ? "down" : "back"} onClick={onBack || back} label="back" />
      {title ? <span className="t-heading">{title}</span> : <span />}
      {right ? <button className="t-strong muted" onClick={onRight}>{right}</button> : <span style={{ width: 48 }} />}
    </div>
  );
}

/* Onboarding header: back + progress dots + optional skip */
export function SetupHeader({ step, total = 4, skip, onSkip }) {
  const { back } = useProto();
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 0 8px", flex: "none" }}>
      <Round kind="outline" icon="back" onClick={back} label="back" />
      <span style={{ display: "flex", gap: 6, alignItems: "center" }}>
        {Array.from({ length: total }).map((_, i) => (
          <span key={i} style={{ width: i + 1 === step ? 22 : 8, height: 8, borderRadius: 4, background: i + 1 <= step ? "var(--ink)" : "var(--line)", transition: "width 320ms var(--ease-out)" }} />
        ))}
      </span>
      {skip ? <button className="t-strong muted" onClick={onSkip}>skip</button> : <span style={{ width: 48 }} />}
    </div>
  );
}

export function Field({ label, value, sub, action, onAction, icon, onClick }) {
  return (
    <div className="row hair" onClick={onClick} style={{ cursor: onClick ? "pointer" : undefined }}>
      {icon}
      <span className="field-label" style={{ flex: label ? "none" : 1 }}>{label}</span>
      <span style={{ flex: 1, textAlign: "right" }}>
        <span className="t-strong" style={{ display: "block" }}>{value}</span>
        {sub && <span className="t-caption muted">{sub}</span>}
      </span>
      {action && <button className="t-strong" onClick={onAction}>{action}</button>}
    </div>
  );
}

export function MenuRow({ label, sub, value, right, onClick, big }) {
  return (
    <div className="row hair press" onClick={onClick} style={{ padding: "16px 0", cursor: onClick ? "pointer" : undefined }}>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span className={big ? "t-title" : "t-strong"} style={{ display: "block" }}>{label}</span>
        {sub && <span className="t-caption muted">{sub}</span>}
      </span>
      {value && <span className="t-body muted">{value}</span>}
      {right !== undefined ? right : <Icon.chevron style={{ color: "var(--muted)" }} />}
    </div>
  );
}
