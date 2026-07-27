"use client";

import { useMutation } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";
import { generateAvatarUri } from "@/lib/avatar";
import { LoaderIcon } from "lucide-react";

import { CallConnect } from "./call-connect";

interface Props {
  meetingId: string;
  meetingName: string;
}

export const CallProvider = ({ meetingId, meetingName }: Props) => {
  const trpc = useTRPC();
  const { data, isPending } = authClient.useSession();
  const generateToken = useMutation(trpc.meetings.generateToken.mutationOptions());

  if (!data || isPending) {
    return (
      <div className="flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar">
        <LoaderIcon className="size-6 animate-spin text-white" />
      </div>
    );
  }

  return (
    <CallConnect
      meetingId={meetingId}
      meetingName={meetingName}
      userId={data.user.id}
      userName={data.user.name}
      userImage={
        data.user.image ??
        generateAvatarUri({ seed: data.user.name, variant: "initials" })
      }
      generateToken={() => generateToken.mutateAsync()}
    />
  );
};
