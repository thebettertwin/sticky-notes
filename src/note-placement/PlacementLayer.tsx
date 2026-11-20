import { useEffect, useEffectEvent, useState, type CSSProperties, type PointerEvent } from "react";
import type { Point } from "../core-ui/geometry";
import { DEFAULT_NOTE_SIZE, type NoteRect } from "../sticky-note/note";
import { rectFromPoints } from "./rectFromPoints";
import "./PlacementLayer.css";

interface PlacementLayerProps {
  /** Board coordinate at the viewport's top-left, to convert placed rects into board space */
  pan: Point;
  colour: string;
  onPlace: (rect: NoteRect) => void;
  onCancel: () => void;
}

/** Pointer position relative to the layer, which covers the visible part of the board */
function toViewportPoint(e: PointerEvent<HTMLElement>): Point {
  const rect = e.currentTarget.getBoundingClientRect();
  return { x: e.clientX - rect.left, y: e.clientY - rect.top };
}

function PlacementLayer({ pan, colour, onPlace, onCancel }: PlacementLayerProps) {
  const [pointer, setPointer] = useState<Point | null>(null);
  const [dragStart, setDragStart] = useState<Point | null>(null);

  const cancel = useEffectEvent(onCancel);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") cancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    // Stops the board underneath from starting a pan
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = toViewportPoint(e);
    setDragStart(point);
    setPointer(point);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    setDragStart(null);
    const rect = rectFromPoints(dragStart, toViewportPoint(e));
    onPlace({ ...rect, x: rect.x + pan.x, y: rect.y + pan.y });
  };

  // In viewport coordinates, since the layer itself doesn't pan
  const ghost: NoteRect | null = dragStart && pointer
    ? rectFromPoints(dragStart, pointer)
    : pointer && { ...pointer, ...DEFAULT_NOTE_SIZE };

  return (
    <div
      className="placement-layer"
      onPointerDown={handlePointerDown}
      onPointerMove={(e) => setPointer(toViewportPoint(e))}
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
