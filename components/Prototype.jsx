"use client";
import { useEffect } from "react";
import { Proto, useProto } from "./proto";
import * as O from "./screens/onboarding";
import * as M from "./screens/main";
import * as R from "./screens/receiving";
import * as S from "./screens/settings";

/* Every screen in the prototype. tab = shows the tab bar; lightStatus = white status bar. */
export const SCREENS = {
  splash: { C: O.Splash },
  invite: { C: O.Invite },
  account: { C: O.Account },
  verify: { C: O.Verify },
  name: { C: O.NameScreen },
  color: { C: O.ColorScreen },
  friendsSetup: { C: O.FriendsSetup },
  circlesSetup: { C: O.CirclesSetup },
  pings: { C: O.Pings },
  startCircle: { C: O.StartCircle },
  home: { C: M.Home, tab: "home" },
  homeEmpty: { C: M.HomeEmpty, tab: "home" },
  newPost: { C: M.NewPost },
  place: { C: M.Place },
  activity: { C: M.Activity },
  live: { C: M.Live, tab: "home" },
  endPlan: { C: M.EndPlan },
  ended: { C: M.Ended },
  active: { C: M.Active, tab: "active" },
  lock: { C: R.Lock, noStatus: true },
  detail: { C: R.Detail },
  options: { C: R.Options },
  youreIn: { C: R.YoureIn },
  youreInGroup: { C: R.YoureInGroup },
  headsUp: { C: R.HeadsUp },
  friends: { C: S.Friends, tab: "friends" },
  circles: { C: S.Circles, tab: "circles" },
  circleDetail: { C: S.CircleDetail },
  profile: { C: S.Profile },
  notif: { C: S.NotifSettings },
  quiet: { C: S.Quiet },
};

const FLOWS = [
  ["App launch", "splash"],
  ["Onboarding (invite link)", "invite"],
  ["Posting a plan", "home"],
  ["Receiving a plan", "lock"],
  ["Out right now", "active"],
  ["Friends & circles", "friends"],
  ["Empty Home", "homeEmpty"],
];

function Side() {
  const { reset } = useProto();
  useEffect(() => {
    const jump = () => { const h = window.location.hash.slice(1); if (SCREENS[h]) reset(h); };
    jump(); window.addEventListener("hashchange", jump); return () => window.removeEventListener("hashchange", jump);
  }, [reset]);
  return (
    <aside className="side">
      <h1>GoTgt</h1>
      <p>Post what you&apos;re already doing. Friends tap in. Interactive prototype; jump to a flow below.</p>
      <nav>{FLOWS.map(([l, id]) => <button key={id} onClick={() => reset(id)}>{l}</button>)}</nav>
    </aside>
  );
}

function FitPhone() {
  useEffect(() => {
    const fit = () => {
      const el = document.getElementById("phone-wrap"); if (!el) return;
      if (window.innerWidth <= 760) { el.style.transform = ""; return; }
      const k = Math.min(1, (window.innerHeight - 48) / 894);
      el.style.transform = `scale(${k})`; el.style.margin = `${(-874 * (1 - k)) / 2}px ${(-402 * (1 - k)) / 2}px`;
    };
    fit(); window.addEventListener("resize", fit); return () => window.removeEventListener("resize", fit);
  }, []);
  return null;
}

export default function Prototype() {
  return (
    <main className="shell">
      <Proto screens={SCREENS} start="splash">
        <Side />
        <FitPhone />
      </Proto>
    </main>
  );
}
