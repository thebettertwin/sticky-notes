import { describe, expect, it } from "vitest";
import type { Note } from "./note";
import { notesReducer } from "./notesReducer";

function makeNote(id: string, overrides: Partial<Note> = {}): Note {
  return { id, text: "", x: 0, y: 0, width: 200, height: 200, colour: "#FFE299", ...overrides };
}

describe("notesReducer", () => {
  const a = makeNote("a");
  const b = makeNote("b");
  const c = makeNote("c");

  it("adds a note on top of the stack", () => {
    expect(notesReducer([a, b], { type: "add", note: c })).toEqual([a, b, c]);
  });

  it("merges changes into the matching note", () => {
    const [updated] = notesReducer([a], { type: "update", id: "a", changes: { x: 40, text: "Hi" } });
    expect(updated).toEqual({ ...a, x: 40, text: "Hi" });
  });

  it("keeps untouched notes as the same objects so memoised notes skip re-rendering", () => {
    const result = notesReducer([a, b, c], { type: "update", id: "b", changes: { y: 10 } });
    expect(result[0]).toBe(a);
    expect(result[1]).not.toBe(b);
    expect(result[2]).toBe(c);
  });

  it("removes a note", () => {
    expect(notesReducer([a, b, c], { type: "remove", id: "b" })).toEqual([a, c]);
  });

  describe("bringToFront", () => {
    it("moves the note to the end of the list", () => {
      expect(notesReducer([a, b, c], { type: "bringToFront", id: "a" })).toEqual([b, c, a]);
    });

    it("returns the same array when the note is already on top", () => {
      const notes = [a, b, c];
      expect(notesReducer(notes, { type: "bringToFront", id: "c" })).toBe(notes);
    });

    it("returns the same array for an unknown id", () => {
      const notes = [a, b];
      expect(notesReducer(notes, { type: "bringToFront", id: "missing" })).toBe(notes);
    });
  });
});
