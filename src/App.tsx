import { useRef, useState } from "react";
import { NoteBlankIcon, PlusIcon } from "@phosphor-icons/react";
import "./App.css";
import IconButton from "./core-ui/buttons/IconButton";
import TrashNote from "./trash-note/TrashNote";
import Toolbar from "./core-ui/toolbar/Toolbar";
import ToolbarDock from "./core-ui/toolbar/ToolbarDock";
import StickyNote, { type Note, type Pointer } from "./sticky-note/StickyNote";
import ColourPicker from "./colour-picker/ColourPicker";


const NEW_NOTE_OFFSET = 24;
const NEW_NOTE_CASCADE = 10;

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showColours, setShowColours] = useState(false);
  const [isOverTrash, setIsOverTrash] = useState(false);
  const trashRef = useRef<HTMLDivElement>(null);

  const isPointerOverTrash = ({ clientX, clientY }: Pointer) => {
    const rect = trashRef.current?.getBoundingClientRect();
    return (
      !!rect &&
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  };

  const updateNote = (id: string, changes: Partial<Note>) => {
    setNotes((prev) => prev.map((note) => (note.id === id ? { ...note, ...changes } : note)));
  };

  const handleAddNote = () => {
    setShowColours(true);
    setNotes((prev) => {
      const step = (prev.length % NEW_NOTE_CASCADE) + 1;
      const offset = step * NEW_NOTE_OFFSET;
      return [...prev, { id: crypto.randomUUID(), text: "", x: offset, y: offset }];
    });
  };

  const handleNoteMove = (id: string, x: number, y: number, pointer: Pointer) => {
    updateNote(id, { x, y });
    setIsOverTrash(isPointerOverTrash(pointer));
  };

  const handleNoteDragEnd = (id: string, pointer: Pointer | null) => {
    setIsOverTrash(false);
    if (pointer && isPointerOverTrash(pointer)) {
      setNotes((prev) => prev.filter((note) => note.id !== id));
      return;
    }
    // Move the dropped note to the end of the list so it renders on top of the others
    setNotes((prev) => {
      const dropped = prev.find((note) => note.id === id);
      return dropped ? [...prev.filter((note) => note.id !== id), dropped] : prev;
    });
  };

  return (
    <>
      <section id="center">
        <h1>Sticky Notes</h1>
        <div className="notes-board">
          {notes.map((note) => (
            <StickyNote
              key={note.id}
              note={note}
              onChange={(text) => updateNote(note.id, { text })}
              onMove={(x, y, pointer) => handleNoteMove(note.id, x, y, pointer)}
              onDragEnd={(pointer) => handleNoteDragEnd(note.id, pointer)}
            />
          ))}
        </div>
        <ToolbarDock>
          {showColours && (
          <Toolbar aria-label="Note colour picker" size="sm">
            <ColourPicker swatches={['#FFAFA3', '#FFE299', '#B3EFBD', '#A8DAFF', '#FFA8DB']} selectedColour="#FFAFA3" onSelectColour={() => {}} />
          </Toolbar>
          )}
          <Toolbar aria-label="Notes">
            <IconButton
              label="Add sticky note"
              icon={NoteBlankIcon}
              hoverIcon={PlusIcon}
              onClick={handleAddNote}
            />
            <TrashNote ref={trashRef} isActive={isOverTrash} />
          </Toolbar>
        </ToolbarDock>
      </section>
    </>
  );
}

export default App;
