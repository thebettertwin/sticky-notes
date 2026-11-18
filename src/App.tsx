import { useRef, useState } from "react";
import "./App.css";
import Toolbar from "./core-ui/toolbar/Toolbar";
import StickyNote, { type Note, type Pointer } from "./StickyNote/StickyNote";


const NEW_NOTE_OFFSET = 24;
const NEW_NOTE_CASCADE = 10;

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
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
        <Toolbar onAddNote={handleAddNote} trashRef={trashRef} isTrashActive={isOverTrash} />
      </section>
    </>
  );
}

export default App;
