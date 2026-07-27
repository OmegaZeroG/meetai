"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { CommandSelect } from "@/components/command-select";
import { GenerateAvatar } from "@/components/generator-avatar";
import { useTRPC } from "@/trpc/client";
import { useMeetingsFilters } from "../../hooks/use-meetings-filters";

export const AgentIdFilter = () => {
  const [filters, setFilters] = useMeetingsFilters();
  const [agentSearch, setAgentSearch] = useState("");

  const trpc = useTRPC();
  const agents = useQuery(
    trpc.agents.getMany.queryOptions({
      pageSize: 100,
      search: agentSearch,
    }),
  );

  return (
    <CommandSelect
      placeholder="Agent"
      className="h-9 w-fit max-w-[200px]"
      options={(agents.data?.items ?? []).map((agent) => ({
        id: agent.id,
        value: agent.id,
        children: (
          <div className="flex items-center gap-x-2">
            <GenerateAvatar
              seed={agent.name}
              variant="botttsNeutral"
              className="size-4"
            />
            {agent.name}
          </div>
        ),
      }))}
      onSelect={(value) => setFilters({ agentId: value, page: 1 })}
      onSearch={setAgentSearch}
      value={filters.agentId}
    />
  );
};
