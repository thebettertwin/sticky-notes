import {
  memo,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import type { ClientPoint } from "../core-ui/geometry";
import type { Note } from "./note";
import "./StickyNote.css";

// Callbacks take the note's id so the parent can pass one stable function to every note,
// which lets memo skip re-rendering notes that didn't change
export interface StickyNoteHandlers {
  onTextChange: (id: string, text: string) => void;
  onMove: (id: string, x: number, y: number, pointer: ClientPoint) => void;
  /** pointer is null when the drag was cancelled (e.g. by the browser or OS) */
  onDragEnd: (id: string, pointer: ClientPoint | null) => void;
  onResize: (id: string, width: number, height: number) => void;
  onDelete: (id: string) => void;
  /** Called when the note is clicked, dragged or focused */
  onActivate: (note: Note) => void;
}

interface StickyNoteProps extends StickyNoteHandlers {
  note: Note;
  isActive: boolean;
}

function StickyNote({
  note,
  isActive,
  onTextChange,
  onMove,
  onDragEnd,
  onResize,
  onDelete,
  onActivate,
}: StickyNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);
  const grabOffset = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleObservedResize = useEffectEvent((width: number, height: number) => {
    if (width !== note.width || height !== note.height) onResize(note.id, width, height);
  });

  useEffect(() => {
    const element = noteRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      const { inlineSize, blockSize } = entry.borderBoxSize[0];
      handleObservedResize(Math.round(inlineSize), Math.round(blockSize));
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0 || !noteRef.current) return;
    e.preventDefault();
    const rect = noteRef.current.getBoundingClientRect();
    grabOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const offset = grabOffset.current;
    // The board's world layer: its position already includes the current pan
    const world = noteRef.current?.offsetParent;
    if (!offset || !world) return;
    const worldRect = world.getBoundingClientRect();
    onMove(note.id, e.clientX - worldRect.left - offset.x, e.clientY - worldRect.top - offset.y, e);
  };

  const endDrag = (pointer: ClientPoint | null) => {
    if (!grabOffset.current) return;
    grabOffset.current = null;
    setIsDragging(false);
    onDragEnd(note.id, pointer);
  };

  // Delete only when the note itself has focus, so it doesn't fire while typing in the text
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === "Delete" || e.key === "Backspace") {
      e.preventDefault();
      onDelete(note.id);
    }
  };

  // Escape leaves the text and focuses the note, so Delete is one key press away
  const handleTextKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") noteRef.current?.focus();
  };

  return (
    <div
      ref={noteRef}
      tabIndex={0}
      role="group"
      aria-label="Sticky note"
      aria-keyshortcuts="Delete"
      className={["sticky-note", isDragging && "is-dragging", isActive && "is-active"]
        .filter(Boolean)
        .join(" ")}
      style={
        {
          transform: `translate(${note.x}px, ${note.y}px)`,
          width: note.width,
          height: note.height,
          "--note-colour": note.colour,
        } as CSSProperties
      }
      onPointerDown={() => onActivate(note)}
      onFocus={() => onActivate(note)}
      onKeyDown={handleKeyDown}
    >
      <div
        className="sticky-note__handle"
        title="Drag to move, or onto the trash to delete"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={(e) => endDrag(e)}
        onPointerCancel={() => endDrag(null)}
      />
      <textarea
        aria-label="Note text"
        placeholder="Write your note here..."
        value={note.text}
        onChange={(e) => onTextChange(note.id, e.target.value)}
        onKeyDown={handleTextKeyDown}
        autoFocus={isActive}
      />
    </div>
  );
}

export default memo(StickyNote);
