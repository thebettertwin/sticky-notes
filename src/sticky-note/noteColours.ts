export interface NoteColour {
  /** Announced by screen readers and shown as the swatch tooltip */
  name: string;
  value: string;
}

export const NOTE_COLOURS: readonly NoteColour[] = [
  { name: "Red", value: "#FFAFA3" },
  { name: "Yellow", value: "#FFE299" },
  { name: "Green", value: "#B3EFBD" },
  { name: "Blue", value: "#A8DAFF" },
  { name: "Pink", value: "#FFA8DB" },
];
