import { describe, expect, it } from "vitest";
import { isPointInRect, type ClientRect } from "./geometry";

describe("isPointInRect", () => {
  const rect: ClientRect = { left: 10, top: 20, right: 110, bottom: 70 };

  it("is true for a point inside", () => {
    expect(isPointInRect({ clientX: 50, clientY: 40 }, rect)).toBe(true);
  });

  it("includes the edges", () => {
    expect(isPointInRect({ clientX: 10, clientY: 20 }, rect)).toBe(true);
    expect(isPointInRect({ clientX: 110, clientY: 70 }, rect)).toBe(true);
  });

  it.each([
    { clientX: 9, clientY: 40 },
    { clientX: 111, clientY: 40 },
    { clientX: 50, clientY: 19 },
    { clientX: 50, clientY: 71 },
  ])("is false just outside: %o", (point) => {
    expect(isPointInRect(point, rect)).toBe(false);
  });
});
