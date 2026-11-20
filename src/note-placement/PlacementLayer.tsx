import { useEffect, useEffectEvent, useState, type CSSProperties, type PointerEvent } from "react";
import type { Point } from "../core-ui/geometry";
import { DEFAULT_NOTE_SIZE, type NoteRect } from "../sticky-note/note";
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
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = toBoardPoint(e);
    setDragStart(point);
    setPointer(point);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    if (!dragStart) return;
    setDragStart(null);
    onPlace(rectFromPoints(dragStart, toBoardPoint(e)));
  };

  const ghost: NoteRect | null = dragStart && pointer
    ? rectFromPoints(dragStart, pointer)
    : pointer && { ...pointer, ...DEFAULT_NOTE_SIZE };

  return (
    <div
      className="placement-layer"
      onPointerDown={handlePointerDown}
      onPointerMove={(e) => setPointer(toBoardPoint(e))}
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
