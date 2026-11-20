import type { Ref } from "react";
import { TrashIcon } from "@phosphor-icons/react";
import "./TrashNote.css";

interface TrashNoteProps {
  isActive: boolean;
  ref?: Ref<HTMLDivElement>;
}

// Purely visual drop target: the note being dragged checks whether it was
// released over this element's bounds (see App's isPointerOverTrash).
function TrashNote({ isActive, ref }: TrashNoteProps) {
  return (
    <div
      ref={ref}
      className={`trash-note${isActive ? " is-over" : ""}`}
      role="img"
      aria-label="Trash: drag a note here, or press Delete on a focused note, to delete it"
      title="Drag a note here to delete it"
    >
      <TrashIcon size="1.75rem" weight={isActive ? "fill" : "regular"} aria-hidden="true" />
    </div>
  );
}

export default TrashNote;
