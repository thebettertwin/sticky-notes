import type { MouseEvent, Ref } from "react";
import { NoteBlankIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import ColourPicker from "../colour-picker/ColourPicker";
import IconButton from "../core-ui/buttons/IconButton";
import Toolbar from "../core-ui/toolbar/Toolbar";
import ToolbarDock from "../core-ui/toolbar/ToolbarDock";
import { NOTE_COLOURS } from "../sticky-note/noteColours";
import TrashNote from "../trash-note/TrashNote";

interface NotesToolbarProps {
  isPlacing: boolean;
  onAddClick: (e: MouseEvent<HTMLButtonElement>) => void;
  showColours: boolean;
  selectedColour: string;
  onSelectColour: (colour: string) => void;
  onCloseColours: () => void;
  trashRef: Ref<HTMLDivElement>;
  isOverTrash: boolean;
}

function NotesToolbar({
  isPlacing,
  onAddClick,
  showColours,
  selectedColour,
  onSelectColour,
  onCloseColours,
  trashRef,
  isOverTrash,
}: NotesToolbarProps) {
  return (
    <ToolbarDock>
      {showColours && (
        <Toolbar aria-label="Note colour picker" size="sm">
          <ColourPicker
            swatches={NOTE_COLOURS}
            selectedColour={selectedColour}
            onSelectColour={onSelectColour}
          />
          <IconButton
            className="toolbar-close"
            label="Close colour picker"
            icon={XIcon}
            iconSize="1rem"
            onClick={onCloseColours}
          />
        </Toolbar>
      )}
      <Toolbar aria-label="Notes">
        <IconButton
          label="Add sticky note"
          icon={NoteBlankIcon}
          hoverIcon={PlusIcon}
          aria-pressed={isPlacing}
          onClick={onAddClick}
        />
        <TrashNote ref={trashRef} isActive={isOverTrash} />
      </Toolbar>
    </ToolbarDock>
  );
}

export default NotesToolbar;
