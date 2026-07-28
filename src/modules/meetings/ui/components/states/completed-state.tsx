"use client";

import Link from "next/link";
import { formatDuration, intervalToDuration } from "date-fns";
import {
  ClockFadingIcon,
  FileTextIcon,
  FileVideoIcon,
  MessageCircleIcon,
  SparklesIcon,
} from "lucide-react";
import Markdown from "react-markdown";

import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { GenerateAvatar } from "@/components/generator-avatar";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { MeetingChat } from "../meeting-chat";
import { Transcript } from "../transcript";

import type { MeetingGetOne } from "../../../types";

interface Props {
  data: MeetingGetOne;
}

function formatMeetingDuration(seconds: number) {
  if (seconds <= 0) return "0 seconds";

  const formatted = formatDuration(
    intervalToDuration({ start: 0, end: seconds * 1000 }),
    { format: ["hours", "minutes", "seconds"] },
  );

  return formatted || "0 seconds";
}

export const CompletedState = ({ data }: Props) => {
  const durationSeconds =
    data.startedAt && data.endedAt
      ? Math.max(
          0,
          Math.round(
            (new Date(data.endedAt).getTime() -
              new Date(data.startedAt).getTime()) /
              1000,
          ),
        )
      : null;

  return (
    <div className="flex flex-col gap-y-4">
      <Tabs defaultValue="summary">
        <div className="rounded-lg border bg-white px-3">
          <TabsList className="h-13 justify-start rounded-none bg-background p-0">
            <TabsTrigger value="summary" className="h-full">
              <SparklesIcon className="size-4" />
              Summary
            </TabsTrigger>
            <TabsTrigger value="transcript" className="h-full">
              <FileTextIcon className="size-4" />
              Transcript
            </TabsTrigger>
            <TabsTrigger value="recording" className="h-full">
              <FileVideoIcon className="size-4" />
              Recording
            </TabsTrigger>
            <TabsTrigger value="chat" className="h-full">
              <MessageCircleIcon className="size-4" />
              Ask AI
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary">
          <div className="flex flex-col gap-y-6 rounded-lg border bg-white px-4 py-5">
            <h2 className="text-2xl font-medium">{data.name}</h2>

            <div className="flex items-center gap-x-4">
              <Link
                href={`/agents/${data.agent.id}`}
                className="flex w-fit items-center gap-x-2 hover:underline"
              >
                <GenerateAvatar
                  variant="botttsNeutral"
                  seed={data.agent.name}
                  className="size-5"
                />
                <span className="font-medium">{data.agent.name}</span>
              </Link>

              {data.startedAt && (
                <p className="text-sm text-muted-foreground">
                  {new Date(data.startedAt).toLocaleDateString(undefined, {
                    dateStyle: "medium",
                  })}
                </p>
              )}
            </div>

            {durationSeconds !== null && (
              <Badge
                variant="outline"
                className="flex w-fit items-center gap-x-2 [&>svg]:size-4"
              >
                <ClockFadingIcon />
                {formatMeetingDuration(durationSeconds)}
              </Badge>
            )}

            {data.summary ? (
              <div className="text-sm leading-relaxed">
                <Markdown
                  components={{
                    h3: (props) => (
                      <h3 className="mt-4 mb-2 text-lg font-medium" {...props} />
                    ),
                    ul: (props) => (
                      <ul className="list-disc space-y-1 pl-6" {...props} />
                    ),
                    li: (props) => <li {...props} />,
                    p: (props) => <p className="leading-relaxed" {...props} />,
                    strong: (props) => (
                      <strong className="font-semibold" {...props} />
                    ),
                  }}
                >
                  {data.summary}
                </Markdown>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                The summary is still being generated. Check back in a minute.
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="transcript">
          <Transcript meetingId={data.id} />
        </TabsContent>

        <TabsContent value="recording">
          {data.recordingUrl ? (
            <video
              src={data.recordingUrl}
              controls
              className="w-full rounded-lg border bg-black"
            />
          ) : (
            <div className="rounded-lg border bg-white">
              <EmptyState
                title="No recording yet"
                description="The recording will appear here once Stream finishes processing it."
              />
            </div>
          )}
        </TabsContent>

        <TabsContent value="chat">
          <MeetingChat meetingId={data.id} meetingName={data.name} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
