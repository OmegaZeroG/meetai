"use client";

import { ColumnDef } from "@tanstack/react-table";

import { GenerateAvatar } from "@/components/generator-avatar";

import type { AgentGetMany } from "../../types";

export const columns: ColumnDef<AgentGetMany[number]>[] = [
  {
    accessorKey: "name",
    header: "Agent Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        <GenerateAvatar
          variant="botttsNeutral"
          seed={row.original.name}
          className="size-6"
        />
        <span className="font-medium capitalize">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "instructions",
    header: "Instructions",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground line-clamp-1 max-w-[300px] block">
        {row.original.instructions}
      </span>
    ),
  },
];
