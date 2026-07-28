import { eq } from "drizzle-orm";

import { db } from "@/db";
import { meetings } from "@/db/schema";
import { GROQ_TEXT_MODEL, groq } from "@/lib/groq";
import { fetchResolvedTranscript, formatTranscriptAsText } from "@/lib/transcript";
import { MeetingStatus } from "@/modules/meetings/types";

import { inngest } from "./client";

const SUMMARY_PROMPT = `You are an expert meeting summarizer. You will be given the transcript of a call between a user and their AI agent. Summarize it in clear, concise markdown with exactly these two sections and no title:

### Overview
One short paragraph describing what was discussed and any conclusions reached.

### Notes
Bullet points capturing the key topics, questions, and answers, grouped under short sub-headers if there were multiple topics.

Keep the tone factual and neutral. If the transcript is empty or contains no meaningful conversation, say so briefly instead of inventing content.`;

export const meetingsProcessing = inngest.createFunction(
  { id: "meetings-processing" },
  { event: "meetings/processing" },
  async ({ event, step }) => {
    const meetingId = event.data.meetingId as string;
    const transcriptUrl = event.data.transcriptUrl as string;

    const segments = await step.run("fetch-transcript", () =>
      fetchResolvedTranscript(transcriptUrl),
    );

    const formattedTranscript = formatTranscriptAsText(segments);

    const summary = await step.run("generate-summary", async () => {
      if (!formattedTranscript.trim()) {
        return "The transcript was empty, so no summary could be generated.";
      }

      // Summarization is plain text (no audio), so it runs on Groq's free,
      // OpenAI-compatible endpoint instead of paid OpenAI credits.
      const completion = await groq.chat.completions.create({
        model: GROQ_TEXT_MODEL,
        messages: [
          { role: "system", content: SUMMARY_PROMPT },
          {
            role: "user",
            content: `Summarize the following transcript:\n\n${formattedTranscript}`,
          },
        ],
      });

      return completion.choices[0]?.message?.content ?? "";
    });

    await step.run("save-summary", async () => {
      await db
        .update(meetings)
        .set({
          summary,
          status: MeetingStatus.Completed,
        })
        .where(eq(meetings.id, meetingId));
    });
  },
);
