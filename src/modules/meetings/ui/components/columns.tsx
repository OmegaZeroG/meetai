"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  CircleCheckIcon,
  CircleXIcon,
  ClockArrowUpIcon,
  LoaderIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { GenerateAvatar } from "@/components/generator-avatar";
import { Badge } from "@/components/ui/badge";

import type { MeetingGetMany } from "../../types";

const statusIconMap = {
  upcoming: ClockArrowUpIcon,
  active: LoaderIcon,
  completed: CircleCheckIcon,
  processing: LoaderIcon,
  cancelled: CircleXIcon,
} as const;

const statusColorMap: Record<string, string> = {
  upcoming: "bg-yellow-500/20 text-yellow-800 border-yellow-800/5",
  active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
  completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
  cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
  processing: "bg-gray-300/20 text-gray-800 border-gray-800/5",
};

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Meeting Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-y-1">
        <span className="font-medium capitalize">{row.original.name}</span>
        <div className="flex items-center gap-x-2">
          <GenerateAvatar
            variant="botttsNeutral"
            seed={row.original.agent.name}
            className="size-4"
          />
          <span className="text-sm text-muted-foreground">
            {row.original.agent.name}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const Icon = statusIconMap[row.original.status];

      return (
        <Badge
          variant="outline"
          className={cn(
            "capitalize [&>svg]:size-4 text-muted-foreground",
            statusColorMap[row.original.status],
          )}
        >
          <Icon
            className={cn(row.original.status === "processing" && "animate-spin")}
          />
          {row.original.status}
        </Badge>
      );
    },
  },
];
