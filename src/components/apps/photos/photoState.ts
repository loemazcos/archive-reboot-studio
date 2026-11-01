import type { RunState } from "@/state/runState";

const PHOTO_KEY = "photos.unlocked";

/** Photo ids shown in Photos beyond the default album. Empty for new saves. */
export function unlockedPhotoIds(run: RunState): string[] {
  try {
    const parsed: unknown = JSON.parse(run.appFlags[PHOTO_KEY] ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === "string") : [];
  } catch {
    return [];
  }
}

export function unlockPhoto(run: RunState, id: string): RunState {
  const ids = unlockedPhotoIds(run);
  if (ids.includes(id)) return run;
  return { ...run, appFlags: { ...run.appFlags, [PHOTO_KEY]: JSON.stringify([...ids, id]) } };
}

/** Every clue the player has obtained (Kakao, apps, etc.) adds a hint photo. */
export function syncCluePhotos(run: RunState): RunState {
  return (run.clues ?? []).reduce((current, clue) => unlockPhoto(current, `clue:${clue}`), run);
}
