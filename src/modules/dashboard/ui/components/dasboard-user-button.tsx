"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from "lucide-react";

import { GenerateAvatar } from "@/components/generator-avatar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { authClient } from "@/lib/auth-client";

export const DashboardUserButton = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data, isPending } = authClient.useSession();
  const router = useRouter();
  const isMobile = useIsMobile();

  const onLogout = () => {
    authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/sign-in");
        },
      },
    });
  };

  if (isPending || !data?.user) {
    return null;
  }

  const avatar = data.user.image ? (
    <Avatar>
      <AvatarImage src={data.user.image} />
    </Avatar>
  ) : (
    <GenerateAvatar
      seed={data.user.name}
      variant="initials"
      className="size-9 mr-3"
    />
  );

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden"
        >
          {avatar}
          <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
            <p className="text-sm truncate w-full">{data.user.name}</p>
            <p className="text-xs truncate w-full">{data.user.email}</p>
          </div>
          <ChevronDownIcon className="size-4 shrink-0" />
        </button>
        <Drawer open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{data.user.name}</DrawerTitle>
              <DrawerDescription>{data.user.email}</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-2 px-4 pb-4">
              <Button
                variant="outline"
                className="flex items-center justify-between"
              >
                Billing
                <CreditCardIcon className="size-4" />
              </Button>
              <Button
                variant="outline"
                onClick={onLogout}
                className="flex items-center justify-between"
              >
                Logout
                <LogOutIcon className="size-4" />
              </Button>
            </div>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden">
        {avatar}
        <div className="flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0">
          <p className="text-sm truncate w-full">{data.user.name}</p>
          <p className="text-xs truncate w-full">{data.user.email}</p>
        </div>
        <ChevronDownIcon className="size-4 shrink-0" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="right" className="w-72">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span className="font-medium truncate">{data.user.name}</span>
            <span className="text-sm font-normal text-muted-foreground truncate">
              {data.user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer flex items-center justify-between">
          Billing
          <CreditCardIcon className="size-4" />
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={onLogout}
          className="cursor-pointer flex items-center justify-between"
        >
          Logout
          <LogOutIcon className="size-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
