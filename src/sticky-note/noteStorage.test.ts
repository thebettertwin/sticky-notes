import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Note } from "./note";
import { loadNotes, saveNotes } from "./noteStorage";

const STORAGE_KEY = "sticky-notes:v1";

class MemoryStorage implements Storage {
  private items = new Map<string, string>();
  get length() {
    return this.items.size;
  }
  clear() {
    this.items.clear();
  }
  getItem(key: string) {
    return this.items.get(key) ?? null;
  }
  key(index: number) {
    return [...this.items.keys()][index] ?? null;
  }
  removeItem(key: string) {
    this.items.delete(key);
  }
  setItem(key: string, value: string) {
    this.items.set(key, value);
  }
}

const note: Note = {
  id: "a",
  text: "Hello",
  x: 10,
  y: 20,
  width: 200,
  height: 150,
  colour: "#B3EFBD",
};

describe("noteStorage", () => {
  let storage: MemoryStorage;

  beforeEach(() => {
    storage = new MemoryStorage();
    vi.stubGlobal("localStorage", storage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("restores what was saved", () => {
    saveNotes([note]);
    expect(loadNotes()).toEqual([note]);
  });

  it("returns no notes when nothing has been saved", () => {
    expect(loadNotes()).toEqual([]);
  });

  it("returns no notes for invalid JSON", () => {
    storage.setItem(STORAGE_KEY, "{not json");
    expect(loadNotes()).toEqual([]);
  });

  it("returns no notes when the saved value isn't a list", () => {
    storage.setItem(STORAGE_KEY, JSON.stringify({ notes: [note] }));
    expect(loadNotes()).toEqual([]);
  });

  it("drops malformed notes but keeps valid ones", () => {
    const { width: _width, ...missingWidth } = note;
    storage.setItem(
      STORAGE_KEY,
      JSON.stringify([note, missingWidth, { ...note, id: "b", x: "10" }, { ...note, id: "c", y: null }, null]),
    );
    expect(loadNotes()).toEqual([note]);
  });

  it("doesn't throw when storage is full or blocked", () => {
    vi.spyOn(storage, "setItem").mockImplementation(() => {
      throw new DOMException("Quota exceeded", "QuotaExceededError");
    });
    expect(() => saveNotes([note])).not.toThrow();
  });
});
