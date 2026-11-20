import { useEffect, useMemo, useReducer, useRef } from "react";
import type { Note } from "./note";
import { notesReducer, type NoteChanges } from "./notesReducer";
import { loadNotes, saveNotes } from "./noteStorage";

const SAVE_DELAY_MS = 300;

export function useNotes() {
  const [notes, dispatch] = useReducer(notesReducer, undefined, loadNotes);
  const latestNotes = useRef(notes);

  useEffect(() => {
    latestNotes.current = notes;
    const timer = window.setTimeout(() => saveNotes(notes), SAVE_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [notes]);

  useEffect(() => {
    const flush = () => saveNotes(latestNotes.current);
    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, []);

  const actions = useMemo(
    () => ({
      addNote: (note: Note) => dispatch({ type: "add", note }),
      updateNote: (id: string, changes: NoteChanges) => dispatch({ type: "update", id, changes }),
      removeNote: (id: string) => dispatch({ type: "remove", id }),
      bringToFront: (id: string) => dispatch({ type: "bringToFront", id }),
    }),
    [],
  );

  return { notes, ...actions };
}
