import "server-only";

import { inArray } from "drizzle-orm";

import { db } from "@/db";
import { agents, user } from "@/db/schema";

interface RawTranscriptItem {
  type: string;
  speaker_id: string;
  text: string;
  start_time: string;
  stop_time: string;
}

export interface TranscriptSegment extends RawTranscriptItem {
  speakerName: string;
}

/**
 * Fetches a Stream call transcription (JSONL) and resolves each
 * speaker_id to a display name, checking both the user and agents
 * tables since either can be a "speaker" in the call.
 */
export async function fetchResolvedTranscript(
  transcriptUrl: string,
): Promise<TranscriptSegment[]> {
  const response = await fetch(transcriptUrl);
  const text = await response.text();

  const rawItems: RawTranscriptItem[] = text
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .map((line) => JSON.parse(line) as RawTranscriptItem);

  const speakerIds = [...new Set(rawItems.map((item) => item.speaker_id))];

  const [userSpeakers, agentSpeakers] =
    speakerIds.length > 0
      ? await Promise.all([
          db.select().from(user).where(inArray(user.id, speakerIds)),
          db.select().from(agents).where(inArray(agents.id, speakerIds)),
        ])
      : [[], []];

  const speakerNameById = new Map<string, string>();
  for (const speaker of userSpeakers) {
    speakerNameById.set(speaker.id, speaker.name);
  }
  for (const speaker of agentSpeakers) {
    speakerNameById.set(speaker.id, speaker.name);
  }

  return rawItems.map((item) => ({
    ...item,
    speakerName: speakerNameById.get(item.speaker_id) ?? "Unknown",
  }));
}

export function formatTranscriptAsText(segments: TranscriptSegment[]) {
  return segments.map((s) => `${s.speakerName}: ${s.text}`).join("\n");
}
