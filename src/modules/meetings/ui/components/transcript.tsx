"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchIcon } from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GenerateAvatar } from "@/components/generator-avatar";
import { EmptyState } from "@/components/empty-state";

interface Props {
  meetingId: string;
}

export const Transcript = ({ meetingId }: Props) => {
  const trpc = useTRPC();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery(
    trpc.meetings.getTranscript.queryOptions({ meetingId }),
  );

  const filteredData = (data ?? []).filter((item) =>
    item.text.toLowerCase().includes(search.toLowerCase()),
  );

  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white px-4 py-5 text-sm text-muted-foreground">
        Loading transcript...
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white">
        <EmptyState
          title="No transcript yet"
          description="The transcript will appear here once Stream finishes processing it."
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4 rounded-lg border bg-white px-4 py-5">
      <p className="text-sm font-medium">Transcript</p>

      <div className="relative">
        <SearchIcon className="absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search transcript..."
          className="h-9 w-full max-w-sm pl-7"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <ScrollArea className="max-h-[500px]">
        <div className="flex flex-col gap-y-4">
          {filteredData.map((item, index) => (
            <div
              key={`${item.speaker_id}-${item.start_time}-${index}`}
              className="flex flex-col gap-y-1 rounded-md border p-3 hover:bg-muted"
            >
              <div className="flex items-center gap-x-2">
                <GenerateAvatar
                  seed={item.speakerName}
                  variant="initials"
                  className="size-6"
                />
                <p className="text-sm font-medium">{item.speakerName}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(item.start_time).toLocaleTimeString(undefined, {
                    timeStyle: "short",
                  })}
                </p>
              </div>
              <p className="pl-8 text-sm text-muted-foreground">
                {item.text}
              </p>
            </div>
          ))}

          {filteredData.length === 0 && (
            <p className="text-sm text-muted-foreground">No matches found.</p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
