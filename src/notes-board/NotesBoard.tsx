import PlacementLayer from "../note-placement/PlacementLayer";
import type { Note, NoteRect } from "../sticky-note/note";
import StickyNote, { type StickyNoteHandlers } from "../sticky-note/StickyNote";
import "./NotesBoard.css";

interface NotesBoardProps extends StickyNoteHandlers {
  notes: readonly Note[];
  activeNoteId: string | null;
  isPlacing: boolean;
  placementColour: string;
  onPlace: (rect: NoteRect) => void;
  onCancelPlacement: () => void;
}

function NotesBoard({
  notes,
  activeNoteId,
  isPlacing,
  placementColour,
  onPlace,
  onCancelPlacement,
  ...noteHandlers
}: NotesBoardProps) {
  return (
    <div className="notes-board">
      {notes.map((note) => (
        <StickyNote
          key={note.id}
          note={note}
          isActive={note.id === activeNoteId}
          {...noteHandlers}
        />
      ))}
      {isPlacing && (
        <PlacementLayer colour={placementColour} onPlace={onPlace} onCancel={onCancelPlacement} />
      )}
    </div>
  );
}

export default NotesBoard;
