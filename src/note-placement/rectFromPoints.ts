import type { Point } from "../core-ui/geometry";
import { DEFAULT_NOTE_SIZE, MIN_NOTE_SIZE, type NoteRect } from "../sticky-note/note";

// Pointer travel (px) before a press counts as drawing a size rather than a click
export const DRAG_THRESHOLD = 4;

/**
 * The note rect for a press at `start` released at `end`: a click gives a default-sized note
 * at the press point, a drag gives the dragged rectangle (in any direction), never below the minimum size.
 */
export function rectFromPoints(start: Point, end: Point): NoteRect {
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);
  if (width < DRAG_THRESHOLD && height < DRAG_THRESHOLD) {
    return { ...start, ...DEFAULT_NOTE_SIZE };
  }
  return {
    x: Math.min(start.x, end.x),
    y: Math.min(start.y, end.y),
    width: Math.max(MIN_NOTE_SIZE, width),
    height: Math.max(MIN_NOTE_SIZE, height),
  };
}
