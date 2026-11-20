import { useCallback, useState, type MouseEvent } from "react";
import "./App.css";
import type { ClientPoint } from "./core-ui/geometry";
import NotesBoard from "./notes-board/NotesBoard";
import { useBoardPan } from "./notes-board/useBoardPan";
import NotesToolbar from "./notes-toolbar/NotesToolbar";
import { cascadeRect, type Note, type NoteRect } from "./sticky-note/note";
import { NOTE_COLOURS } from "./sticky-note/noteColours";
import { useNotes } from "./sticky-note/useNotes";
import { useTrashZone } from "./trash-note/useTrashZone";

function App() {
  const { notes, addNote, updateNote, removeNote, bringToFront } = useNotes();
  const { pan, panBy } = useBoardPan();
  const { trashRef, isOverTrash, isOver: isPointerOverTrash, trackPointer, stopTracking } =
    useTrashZone();

  const [selectedColour, setSelectedColour] = useState(NOTE_COLOURS[0].value);
  const [showColours, setShowColours] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);

  const createNote = (rect: NoteRect) => {
    const id = crypto.randomUUID();
    addNote({ id, text: "", ...rect, colour: selectedColour });
    setActiveNoteId(id);
    setShowColours(true);
  };

  const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
    // detail is 0 for clicks triggered by Enter/Space: there's no cursor to place with,
    // so put the note at the next cascade position instead
    if (e.detail === 0) {
      // Relative to the visible part of the board, wherever it's panned to
      const rect = cascadeRect(notes.length);
      createNote({ ...rect, x: rect.x + pan.x, y: rect.y + pan.y });
      return;
    }
    setIsPlacing((placing) => !placing);
    setShowColours(true);
    setActiveNoteId(null);
  };

  const handlePlace = (rect: NoteRect) => {
    setIsPlacing(false);
    createNote(rect);
  };

  const handleSelectColour = (colour: string) => {
    setSelectedColour(colour);
    if (activeNoteId) updateNote(activeNoteId, { colour });
  };

  const handleCloseColours = () => {
    setShowColours(false);
    setActiveNoteId(null);
    setIsPlacing(false);
  };

  // Note handlers are passed to every note and must stay stable for StickyNote's memo to work
  const handleTextChange = useCallback(
    (id: string, text: string) => updateNote(id, { text }),
    [updateNote],
  );

  const handleResize = useCallback(
    (id: string, width: number, height: number) => updateNote(id, { width, height }),
    [updateNote],
  );

  const handleMove = useCallback(
    (id: string, x: number, y: number, pointer: ClientPoint) => {
      updateNote(id, { x, y });
      trackPointer(pointer);
    },
    [updateNote, trackPointer],
  );

  const handleDelete = useCallback(
    (id: string) => {
      removeNote(id);
      setActiveNoteId((active) => (active === id ? null : active));
    },
    [removeNote],
  );

  const handleDragEnd = useCallback(
    (id: string, pointer: ClientPoint | null) => {
      stopTracking();
      if (pointer && isPointerOverTrash(pointer)) {
        handleDelete(id);
      } else {
        bringToFront(id);
      }
    },
    [stopTracking, isPointerOverTrash, handleDelete, bringToFront],
  );

  const handleActivate = useCallback((note: Note) => {
    setActiveNoteId(note.id);
    setSelectedColour(note.colour);
  }, []);

  return (
    <section id="center">
      <h1>Notes</h1>
      <NotesBoard
        notes={notes}
        activeNoteId={activeNoteId}
        pan={pan}
        onPan={panBy}
        isPlacing={isPlacing}
        placementColour={selectedColour}
        onPlace={handlePlace}
        onCancelPlacement={() => setIsPlacing(false)}
        onTextChange={handleTextChange}
        onMove={handleMove}
        onDragEnd={handleDragEnd}
        onDelete={handleDelete}
        onResize={handleResize}
        onActivate={handleActivate}
      />
      <NotesToolbar
        isPlacing={isPlacing}
        onAddClick={handleAddClick}
        showColours={showColours}
        selectedColour={selectedColour}
        onSelectColour={handleSelectColour}
        onCloseColours={handleCloseColours}
        trashRef={trashRef}
        isOverTrash={isOverTrash}
      />
    </section>
  );
}

export default App;
