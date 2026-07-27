"use client";

import Link from "next/link";
import { VideoIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";

interface Props {
  meetingId: string;
}

export const ActiveState = ({ meetingId }: Props) => {
  return (
    <div className="bg-white rounded-lg px-4 py-5 flex flex-col gap-y-8 items-center justify-center">
      <EmptyState
        title="Meeting is active"
        description="The meeting will end once all participants have left."
      />
      <Button asChild className="w-full lg:w-auto">
        <Link href={`/meetings/${meetingId}/call`}>
          <VideoIcon />
          Join meeting
        </Link>
      </Button>
    </div>
  );
};
