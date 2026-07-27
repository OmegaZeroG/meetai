"use client";

import { useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

interface CommandSelectOption {
  id: string;
  value: string;
  children: React.ReactNode;
}

interface Props {
  options: CommandSelectOption[];
  onSelect: (value: string) => void;
  onSearch?: (value: string) => void;
  value: string;
  placeholder?: string;
  className?: string;
}

/**
 * A searchable select built on Popover + Command. Options are passed as
 * plain data so it can render anything (avatar + label, etc.) per item.
 */
export const CommandSelect = ({
  options,
  onSelect,
  onSearch,
  value,
  placeholder = "Select an option",
  className,
}: Props) => {
  const [open, setOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  const handleOpenChange = (open: boolean) => {
    onSearch?.("");
    setOpen(open);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "h-9 justify-between font-normal px-3 w-full",
            !selectedOption && "text-muted-foreground",
            className,
          )}
        >
          <div className="truncate">
            {selectedOption?.children ?? placeholder}
          </div>
          <ChevronsUpDownIcon className="shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={!onSearch}>
          <CommandInput placeholder="Search..." onValueChange={onSearch} />
          <CommandList>
            <CommandEmpty>
              <span className="text-muted-foreground text-sm">
                No options found
              </span>
            </CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.id}
                onSelect={() => {
                  onSelect(option.value);
                  setOpen(false);
                }}
              >
                {option.children}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
