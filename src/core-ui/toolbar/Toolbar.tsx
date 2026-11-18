import type { Ref } from "react";
import { NoteBlankIcon } from "@phosphor-icons/react";
import IconButton from "../buttons/IconButton";
import TrashNote from "../buttons/TrashNote";
import './Toolbar.css';

interface ToolbarProps {
  onAddNote: () => void;
  trashRef: Ref<HTMLDivElement>;
  isTrashActive: boolean;
}

function Toolbar({ onAddNote, trashRef, isTrashActive }: ToolbarProps) {
  return (
    <nav className="toolbar">
      <IconButton
        label="Add sticky note"
        icon={NoteBlankIcon}
        onClick={onAddNote}
      />
      <TrashNote ref={trashRef} isActive={isTrashActive} />
    </nav>
  );
}

export default Toolbar;
