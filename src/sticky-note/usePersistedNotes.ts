import { useEffect, useRef, useState } from "react";
import type { Note } from "./note";
import { loadNotes, saveNotes } from "./noteStorage";

const SAVE_DELAY_MS = 300;

export function usePersistedNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);
  const latestNotes = useRef(notes);

  useEffect(() => {
    latestNotes.current = notes;
    const timer = window.setTimeout(() => saveNotes(notes), SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [notes]);

  // Flush a pending save if the page is closed or reloaded inside the debounce window
  useEffect(() => {
    const flush = () => saveNotes(latestNotes.current);
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, []);

  return [notes, setNotes] as const;
}
