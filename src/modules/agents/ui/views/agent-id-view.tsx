"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VideoIcon } from "lucide-react";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { GenerateAvatar } from "@/components/generator-avatar";
import { Badge } from "@/components/ui/badge";
import { useConfirm } from "@/hooks/use-confirm";

import { AgentIdViewHeader } from "../components/agent-id-view-header";
import { UpdateAgentDialog } from "../components/update-agent-dialog";

interface Props {
  agentId: string;
}

export const AgentIdView = ({ agentId }: Props) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState(false);
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    "This will permanently remove this agent.",
  );

  const { data } = useSuspenseQuery(
    trpc.agents.getOne.queryOptions({ id: agentId }),
  );

  const removeAgent = useMutation(
    trpc.agents.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.agents.getMany.queryOptions({}),
        );
        router.push("/agents");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );

  const onRemove = async () => {
    const ok = await confirmRemove();
    if (!ok) return;

    await removeAgent.mutateAsync({ id: agentId });
  };

  return (
    <>
      <RemoveConfirmation />
      <UpdateAgentDialog
        open={updateAgentDialogOpen}
        onOpenChange={setUpdateAgentDialogOpen}
        initialValues={data}
      />
      <div className="flex flex-1 flex-col gap-y-4 p-4 md:px-8">
        <AgentIdViewHeader
          agentName={data.name}
          onEdit={() => setUpdateAgentDialogOpen(true)}
          onRemove={onRemove}
        />
        <div className="bg-white rounded-lg border">
          <div className="px-4 py-5 gap-y-5 flex flex-col col-span-5">
            <div className="flex items-center gap-x-3">
              <GenerateAvatar
                variant="botttsNeutral"
                seed={data.name}
                className="size-10"
              />
              <h2 className="text-2xl font-medium">{data.name}</h2>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-x-2 [&>svg]:size-4"
            >
              <VideoIcon className="text-blue-700" />
              0 Meetings
            </Badge>
            <div className="flex flex-col gap-y-4">
              <p className="text-lg font-medium">Instructions</p>
              <p className="text-muted-foreground">{data.instructions}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const AgentIdViewLoading = () => {
  return (
    <LoadingState
      title="Loading Agent"
      description="This may take a few seconds"
    />
  );
};

export const AgentIdViewError = () => {
  return (
    <ErrorState
      title="Error Loading Agent"
      description="Something went wrong"
    />
  );
};
