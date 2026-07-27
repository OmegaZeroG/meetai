"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
} from "lucide-react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { GenerateAvatar } from "@/components/generator-avatar";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";
import { cn } from "@/lib/utils";

import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { UpdateMeetingDialog } from "../components/update-meeting-dialog";
import { UpcomingState } from "../components/states/upcoming-state";
import { ActiveState } from "../components/states/active-state";
import { CancelledState } from "../components/states/cancelled-state";
import { ProcessingState } from "../components/states/processing-state";
import { CompletedState } from "../components/states/completed-state";
import { MeetingStatus } from "../../types";

interface Props {
  meetingId: string;
}

const statusIconMap = {
  [MeetingStatus.Upcoming]: ClockArrowUpIcon,
  [MeetingStatus.Active]: LoaderIcon,
  [MeetingStatus.Completed]: CircleCheckIcon,
  [MeetingStatus.Processing]: LoaderIcon,
  [MeetingStatus.Cancelled]: CircleXIcon,
};

const statusColorMap: Record<string, string> = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
};

export const MeetingIdView = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState(false);
  const [CancelConfirmation, confirmCancel] = useConfirm(
    "Cancel this meeting?",
    "This will mark the meeting as cancelled.",
  );

  const { data } = useSuspenseQuery(
    trpc.meetings.getOne.queryOptions({ id: meetingId }),
  );

  const cancelMeeting = useMutation(
    trpc.meetings.cancel.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.meetings.getMany.queryOptions({}),
        );
        await queryClient.invalidateQueries(
          trpc.meetings.getOne.queryOptions({ id: meetingId }),
        );
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onCancelMeeting = async () => {
    const ok = await confirmCancel();
    if (!ok) return;

    await cancelMeeting.mutateAsync({ id: meetingId });
  };

  const isUpcoming = data.status === MeetingStatus.Upcoming;
  const isActive = data.status === MeetingStatus.Active;
  const isCompleted = data.status === MeetingStatus.Completed;
  const isCancelled = data.status === MeetingStatus.Cancelled;
  const isProcessing = data.status === MeetingStatus.Processing;

  const Icon = statusIconMap[data.status];

  return (
    <>
      <CancelConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialogOpen}
        onOpenChange={setUpdateMeetingDialogOpen}
        initialValues={data}
      />
      <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
        <MeetingIdViewHeader
          meetingName={data.name}
          onEdit={
            isUpcoming ? () => setUpdateMeetingDialogOpen(true) : undefined
          }
          onCancel={isUpcoming ? onCancelMeeting : undefined}
        />

        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3">
              <h2 className="text-2xl font-medium">{data.name}</h2>
              <Badge
                variant="outline"
                className={cn(
                  "capitalize [&>svg]:size-4 text-muted-foreground",
                  statusColorMap[data.status],
                )}
              >
                <Icon
                  className={cn(isProcessing && "animate-spin")}
                />
                {data.status}
              </Badge>
            </div>

            <div className="flex flex-col gap-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Agent
              </p>
              <Link
                href={`/agents/${data.agent.id}`}
                className="flex items-center gap-x-2 w-fit hover:underline"
              >
                <GenerateAvatar
                  variant="botttsNeutral"
                  seed={data.agent.name}
                  className="size-6"
                />
                <span className="font-medium">{data.agent.name}</span>
              </Link>
            </div>

            <div className="flex flex-col gap-y-2">
              <p className="text-sm font-medium text-muted-foreground">
                Instructions
              </p>
              <p className="text-muted-foreground">
                {data.agent.instructions}
              </p>
            </div>
          </div>
        </div>

        {isCancelled && <CancelledState />}
        {isProcessing && <ProcessingState />}
        {isCompleted && <CompletedState />}
        {isActive && <ActiveState meetingId={meetingId} />}
        {isUpcoming && (
          <UpcomingState
            meetingId={meetingId}
            onCancelMeeting={onCancelMeeting}
            isCancelling={cancelMeeting.isPending}
          />
        )}
      </div>
    </>
  );
};

export const MeetingIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Meeting"
      description="This may take a few seconds"
    />
  );
};

export const MeetingIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Meeting"
      description="Something went wrong"
    />
  );
};
