"use client";

import { useState } from "react";
import { CallingState, StreamTheme, useCall } from "@stream-io/video-react-sdk";

import { CallLobby } from "./call-lobby";
import { CallActive } from "./call-active";
import { CallEnded } from "./call-ended";

interface Props {
  meetingName: string;
}

type CallStatus = "lobby" | "call" | "ended";

export const CallUI = ({ meetingName }: Props) => {
  const call = useCall();
  const [show, setShow] = useState<CallStatus>("lobby");
  const [isJoining, setIsJoining] = useState(false);

  const handleJoin = async () => {
    if (!call || isJoining || call.state.callingState !== CallingState.IDLE)
      return;

    setIsJoining(true);
    try {
      // `create: true` is a safety net: it lets you join a call whose
      // Stream call object wasn't created server-side (e.g. a meeting
      // made before Stream was wired up). For meetings created after
      // this chapter, meetings.create already created the call, so this
      // is a no-op.
      await call.join({ create: true });
      setShow("call");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeave = () => {
    if (!call) return;

    call.endCall();
    setShow("ended");
  };

  return (
    <StreamTheme className="h-full">
      {show === "lobby" && <CallLobby onJoin={handleJoin} />}
      {show === "call" && (
        <CallActive onLeave={handleLeave} meetingName={meetingName} />
      )}
      {show === "ended" && <CallEnded />}
    </StreamTheme>
  );
};
