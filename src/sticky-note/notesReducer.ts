import type { Note } from "./note";

export type NoteChanges = Partial<Omit<Note, "id">>;

export type NotesAction =
  | { type: "add"; note: Note }
  | { type: "update"; id: string; changes: NoteChanges }
  | { type: "remove"; id: string }
  | { type: "bringToFront"; id: string };

export function notesReducer(notes: Note[], action: NotesAction): Note[] {
  switch (action.type) {
    case "add":
      return [...notes, action.note];
    case "update":
      return notes.map((note) => (note.id === action.id ? { ...note, ...action.changes } : note));
    case "remove":
      return notes.filter((note) => note.id !== action.id);
    case "bringToFront": {
      const index = notes.findIndex((note) => note.id === action.id);
      if (index === -1 || index === notes.length - 1) return notes;
      return [...notes.slice(0, index), ...notes.slice(index + 1), notes[index]];
    }
  }
}
