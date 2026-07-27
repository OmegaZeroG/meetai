"use client";

import { useQuery } from "@tanstack/react-query";

import {Button} from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useTRPC } from "@/trpc/client";

export const HomeView = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  const { data: greeting } = useQuery(
    trpc.hello.queryOptions({ text: "Meet.AI" }),
  );

  if(!session){
    return (
      <p>Loading...</p>
    )
  }

  return (
    <div>
      <p>Welcome, {session.user.name}!</p>
      {greeting && <p className="text-muted-foreground">{greeting.greeting}</p>}
      <Button onClick={() => authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in")
          }
        }
      })}>Sign Out</Button>
    </div>
  );
};