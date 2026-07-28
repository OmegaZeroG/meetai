"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { SendIcon, SparklesIcon } from "lucide-react";
import { toast } from "sonner";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GenerateAvatar } from "@/components/generator-avatar";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

interface Props {
  meetingId: string;
  meetingName: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export const MeetingChat = ({ meetingId, meetingName }: Props) => {
  const trpc = useTRPC();
  const { data: session } = authClient.useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");

  const askQuestion = useMutation(trpc.meetings.askQuestion.mutationOptions());

  const handleSend = async () => {
    const question = input.trim();
    if (!question || askQuestion.isPending) return;

    const history = messages;
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setInput("");

    try {
      const result = await askQuestion.mutateAsync({
        meetingId,
        question,
        history,
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: result.answer },
      ]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    }
  };

  return (
    <div className="flex flex-col gap-y-4 rounded-lg border bg-white px-4 py-5">
      <div className="flex items-center gap-x-2">
        <SparklesIcon className="size-4" />
        <p className="text-sm font-medium">
          Ask about &quot;{meetingName}&quot;
        </p>
      </div>

      <ScrollArea className="max-h-[400px] min-h-[120px]">
        <div className="flex flex-col gap-y-3">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Ask a question about this meeting and it&apos;ll be answered
              using the transcript and summary.
            </p>
          )}

          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={cn(
                "flex items-start gap-x-2",
                message.role === "user" && "flex-row-reverse text-right",
              )}
            >
              {message.role === "assistant" ? (
                <GenerateAvatar
                  seed="AI"
                  variant="botttsNeutral"
                  className="size-6 shrink-0"
                />
              ) : (
                <GenerateAvatar
                  seed={session?.user.name ?? "You"}
                  variant="initials"
                  className="size-6 shrink-0"
                />
              )}
              <div
                className={cn(
                  "max-w-[85%] rounded-md border px-3 py-2 text-sm",
                  message.role === "user" ? "bg-muted" : "bg-background",
                )}
              >
                {message.content}
              </div>
            </div>
          ))}

          {askQuestion.isPending && (
            <p className="text-sm text-muted-foreground">Thinking...</p>
          )}
        </div>
      </ScrollArea>

      <div className="flex items-center gap-x-2">
        <Input
          placeholder="Ask a question..."
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              void handleSend();
            }
          }}
          disabled={askQuestion.isPending}
        />
        <Button
          onClick={() => void handleSend()}
          disabled={askQuestion.isPending || !input.trim()}
        >
          <SendIcon />
        </Button>
      </div>
    </div>
  );
};
