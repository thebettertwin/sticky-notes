import { describe, expect, it } from "vitest";
import { DEFAULT_NOTE_SIZE, cascadeRect, keepInsideBoard } from "./note";

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

describe("keepInsideBoard", () => {
  const size = { width: 200, height: 150 };

  it("leaves a note that's already inside unchanged", () => {
    expect(keepInsideBoard({ x: 100, y: 50, ...size }, 1000)).toEqual({ x: 100, y: 50, ...size });
  });

  it("stops a note at the left and top edges", () => {
    expect(keepInsideBoard({ x: -40, y: -10, ...size }, 1000)).toMatchObject({ x: 0, y: 0 });
  });

  it("stops a note's right edge at the board's right edge", () => {
    expect(keepInsideBoard({ x: 900, y: 0, ...size }, 1000)).toMatchObject({ x: 800 });
  });

  it("doesn't limit how far down a note can go", () => {
    expect(keepInsideBoard({ x: 0, y: 5000, ...size }, 1000)).toMatchObject({ y: 5000 });
  });

  it("pins a note wider than the board to the left edge", () => {
    expect(keepInsideBoard({ x: 50, y: 0, width: 1200, height: 150 }, 1000)).toMatchObject({ x: 0 });
  });
});
