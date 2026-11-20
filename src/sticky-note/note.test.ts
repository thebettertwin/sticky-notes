import { describe, expect, it } from "vitest";
import { DEFAULT_NOTE_SIZE, cascadeRect } from "./note";

describe("cascadeRect", () => {
  it("offsets the first note from the board corner at the default size", () => {
    expect(cascadeRect(0)).toEqual({ x: 24, y: 24, ...DEFAULT_NOTE_SIZE });
  });

  it("steps each following note diagonally", () => {
    expect(cascadeRect(1)).toMatchObject({ x: 48, y: 48 });
    expect(cascadeRect(9)).toMatchObject({ x: 240, y: 240 });
  });

  it("wraps back to the start after ten steps", () => {
    expect(cascadeRect(10)).toEqual(cascadeRect(0));
  });
});
