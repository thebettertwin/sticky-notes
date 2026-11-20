export interface Note {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  colour: string;
}

export const DEFAULT_NOTE_SIZE = { width: 200, height: 200 } as const;
