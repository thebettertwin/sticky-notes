import { useEffect, useEffectEvent, useState, type CSSProperties, type PointerEvent } from "react";
import type { Point } from "../core-ui/geometry";
import { DEFAULT_NOTE_SIZE, keepInsideBoard, type NoteRect } from "../sticky-note/note";
import { rectFromPoints } from "./rectFromPoints";
import "./PlacementLayer.css";

interface PlacementLayerProps {
  colour: string;
  onPlace: (rect: NoteRect) => void;
  onCancel: () => void;
}

function toBoardPoint(e: PointerEvent<HTMLElement>): Point {
  const rect = e.currentTarget.getBoundingClientRect();
  return {
    x: Math.max(0, e.clientX - rect.left),
    y: Math.max(0, e.clientY - rect.top),
  };
}

function PlacementLayer({ colour, onPlace, onCancel }: PlacementLayerProps) {
  const [pointer, setPointer] = useState<Point | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);
  // The layer covers the board, so its width is the board's width
  const [boardWidth, setBoardWidth] = useState(0);

  const cancel = useEffectEvent(onCancel);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const trackPointer = (e: PointerEvent<HTMLDivElement>) => {
    setPointer(toBoardPoint(e));
    setBoardWidth(e.currentTarget.clientWidth);
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    setBoardWidth(e.currentTarget.clientWidth);
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = toBoardPoint(e);
    setDragStart(point);
    setPointer(point);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    setDragStart(null);
    onPlace(keepInsideBoard(rectFromPoints(dragStart, toBoardPoint(e)), e.currentTarget.clientWidth));
  };

  const unconstrainedGhost: NoteRect | null = dragStart && pointer
    ? rectFromPoints(dragStart, pointer)
    : pointer && { ...pointer, ...DEFAULT_NOTE_SIZE };
  const ghost = unconstrainedGhost && keepInsideBoard(unconstrainedGhost, boardWidth);

  return (
    <div
      className="placement-layer"
      onPointerDown={handlePointerDown}
      onPointerMove={trackPointer}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => setDragStart(null)}
      onPointerLeave={() => {
        if (!dragStart) setPointer(null);
      }}
    >
      {ghost && (
        <div
          className="sticky-note sticky-note--ghost"
          style={
            {
              transform: `translate(${ghost.x}px, ${ghost.y}px)`,
              width: ghost.width,
              height: ghost.height,
              "--note-colour": colour,
            } as CSSProperties
          }
        >
          <div className="sticky-note__handle" />
        </div>
      )}
    </div>
  );
}

export default PlacementLayer;
