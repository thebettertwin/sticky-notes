import { describe, expect, it } from "vitest";
import { DEFAULT_NOTE_SIZE, MIN_NOTE_SIZE } from "../sticky-note/note";
import { DRAG_THRESHOLD, rectFromPoints } from "./rectFromPoints";

describe("rectFromPoints", () => {
  const start = { x: 100, y: 100 };

  it("treats a click as a default-sized note at the press point", () => {
    expect(rectFromPoints(start, start)).toEqual({ ...start, ...DEFAULT_NOTE_SIZE });
  });

  it("treats movement under the drag threshold as a click", () => {
    const end = { x: start.x + DRAG_THRESHOLD - 1, y: start.y + DRAG_THRESHOLD - 1 };
    expect(rectFromPoints(start, end)).toEqual({ ...start, ...DEFAULT_NOTE_SIZE });
  });

  it("uses the dragged rectangle", () => {
    expect(rectFromPoints(start, { x: 400, y: 300 })).toEqual({ x: 100, y: 100, width: 300, height: 200 });
  });

  it("normalises drags up and to the left", () => {
    expect(rectFromPoints({ x: 400, y: 300 }, start)).toEqual({ x: 100, y: 100, width: 300, height: 200 });
  });

  it("never goes below the minimum note size", () => {
    expect(rectFromPoints(start, { x: 120, y: 400 })).toEqual({
      x: 100,
      y: 100,
      width: MIN_NOTE_SIZE,
      height: 300,
    });
  });
});
