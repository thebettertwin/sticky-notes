import type { Ref } from "react";
import { TrashIcon } from "@phosphor-icons/react";

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
      title="Drag a note here to delete it"
    >
      <TrashIcon size={28} weight={isActive ? "fill" : "regular"} aria-hidden="true" />
    </div>
  );
}

export default TrashNote;
