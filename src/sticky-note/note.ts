export interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
}

export type NoteRect = Pick<Note, "x" | "y" | "width" | "height">;

export const DEFAULT_NOTE_SIZE = { width: 200, height: 200 } as const;

export const MIN_NOTE_SIZE = 120;

const CASCADE_OFFSET = 24;
const CASCADE_STEPS = 10;

export function cascadeRect(noteCount: number): NoteRect {
  const offset = ((noteCount % CASCADE_STEPS) + 1) * CASCADE_OFFSET;
  return { x: offset, y: offset, ...DEFAULT_NOTE_SIZE };
}

/**
 * Keeps a note between the board's left and right edges and below its top.
 * There's no bottom limit: the page scrolls to fit notes placed lower down.
 */
export function keepInsideBoard(rect: NoteRect, boardWidth: number): NoteRect {
  const maxX = Math.max(0, boardWidth - rect.width);
  return { ...rect, x: Math.min(Math.max(rect.x, 0), maxX), y: Math.max(rect.y, 0) };
}
