import { useEffect, useEffectEvent, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import type { Note } from "./note";
import "./StickyNote.css";

export interface Pointer {
  clientX: number;
  clientY: number;
}

interface StickyNoteProps {
  note: Note;
  onChange: (text: string) => void;
  onMove: (x: number, y: number, pointer: Pointer) => void;
  onDragEnd: (pointer: Pointer | null) => void;
  onResize: (width: number, height: number) => void;
  onActivate: () => void;
  isActive?: boolean;
}

function StickyNote({ note, onChange, onMove, onDragEnd, onResize, onActivate, isActive = false }: StickyNoteProps) {
  const noteRef = useRef<HTMLDivElement>(null);
  const grabOffset = useRef<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleObservedResize = useEffectEvent((width: number, height: number) => {
    if (width !== note.width || height !== note.height) onResize(width, height);
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
    const board = noteRef.current?.offsetParent;
    if (!offset || !board) return;
    const boardRect = board.getBoundingClientRect();
    const x = Math.max(0, e.clientX - boardRect.left - offset.x);
    const y = Math.max(0, e.clientY - boardRect.top - offset.y);
    onMove(x, y, e);
  };

  const endDrag = (pointer: Pointer | null) => {
    if (!grabOffset.current) return;
    grabOffset.current = null;
    setIsDragging(false);
    onDragEnd(pointer);
  };

  return (
    <div
      ref={noteRef}
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
      onPointerDown={onActivate}
      onFocus={onActivate}
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
        onChange={(e) => onChange(e.target.value)}
        autoFocus={isActive}
      />
    </div>
  );
}

export default StickyNote;
