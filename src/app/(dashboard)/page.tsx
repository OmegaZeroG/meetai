import { redirect } from "next/navigation";
import {headers} from "next/headers";

import {HomeView}from "@/modules/home/ui/views/home-view";
import {auth} from "@/lib/auth";
import { getQueryClient, trpc, HydrateClient } from "@/trpc/server";

const Page = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.hello.queryOptions({ text: "Meet.AI" }),
  );

  return (
    <HydrateClient>
      <HomeView />
    </HydrateClient>
  );
};

export default Page;
