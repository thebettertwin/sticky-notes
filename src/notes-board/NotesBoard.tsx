import { useRef, useState, type PointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import type { Point } from "../core-ui/geometry";
import PlacementLayer from "../note-placement/PlacementLayer";
import type { Note, NoteRect } from "../sticky-note/note";
import StickyNote, { type StickyNoteHandlers } from "../sticky-note/StickyNote";
import "./NotesBoard.css";

// Firefox reports mouse wheel movement in lines rather than pixels
const PIXELS_PER_LINE = 16;

interface NotesBoardProps extends StickyNoteHandlers {
  notes: readonly Note[];
  activeNoteId: string | null;
  pan: Point;
  onPan: (dx: number, dy: number) => void;
  isPlacing: boolean;
  placementColour: string;
  onPlace: (rect: NoteRect) => void;
  onCancelPlacement: () => void;
}

function wheelDeltaInPixels(e: ReactWheelEvent, pageHeight: number): Point {
  const scale =
    e.deltaMode === WheelEvent.DOM_DELTA_LINE
      ? PIXELS_PER_LINE
      : e.deltaMode === WheelEvent.DOM_DELTA_PAGE
        ? pageHeight
        : 1;
  return { x: e.deltaX * scale, y: e.deltaY * scale };
}

function NotesBoard({
  notes,
  activeNoteId,
  pan,
  onPan,
  isPlacing,
  placementColour,
  onPlace,
  onCancelPlacement,
  ...noteHandlers
}: NotesBoardProps) {
  const lastPanPoint = useRef<{ clientX: number; clientY: number } | null>(null);
  const [isPanning, setIsPanning] = useState(false);

  const handleWheel = (e: ReactWheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey) return; // pinch-zoom gesture, not a pan
    // Let a note's text scroll if it has overflowing content
    const target = e.target;
    if (target instanceof HTMLTextAreaElement && target.scrollHeight > target.clientHeight) return;
    const delta = wheelDeltaInPixels(e, e.currentTarget.clientHeight);
    onPan(delta.x, delta.y);
  };

  // Dragging empty board space pans; presses on notes are handled by the notes themselves
  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    const isEmptySpace = e.target === e.currentTarget || e.target === e.currentTarget.firstChild;
    if (!isEmptySpace || (e.button !== 0 && e.button !== 1)) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    lastPanPoint.current = { clientX: e.clientX, clientY: e.clientY };
    setIsPanning(true);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const last = lastPanPoint.current;
    if (!last) return;
    onPan(last.clientX - e.clientX, last.clientY - e.clientY);
    lastPanPoint.current = { clientX: e.clientX, clientY: e.clientY };
  };

  const stopPanning = () => {
    lastPanPoint.current = null;
    setIsPanning(false);
  };

  return (
    <div
      className={`notes-board${isPanning ? " is-panning" : ""}`}
      onWheel={handleWheel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopPanning}
      onPointerCancel={stopPanning}
    >
      {/* Positioned with left/top rather than transform: a transform would create a stacking
          context and trap a dragged note's z-index beneath the toolbar */}
      <div className="notes-board__world" style={{ left: -pan.x, top: -pan.y }}>
        {notes.map((note) => (
          <StickyNote
            key={note.id}
            note={note}
            isActive={note.id === activeNoteId}
            {...noteHandlers}
          />
        ))}
      </div>
      {isPlacing && (
        <PlacementLayer
          pan={pan}
          colour={placementColour}
          onPlace={onPlace}
          onCancel={onCancelPlacement}
        />
      )}
    </div>
  );
}

export default NotesBoard;
