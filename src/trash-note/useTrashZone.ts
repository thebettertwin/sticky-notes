import { useCallback, useRef, useState } from "react";
import { isPointInRect, type ClientPoint } from "../core-ui/geometry";


export function useTrashZone() {
  const trashRef = useRef<HTMLDivElement>(null);
  const [isOverTrash, setIsOverTrash] = useState(false);

  const isOver = useCallback((pointer: ClientPoint) => {
    const rect = trashRef.current?.getBoundingClientRect();
    return !!rect && isPointInRect(pointer, rect);
  }, []);


  const trackPointer = useCallback(
    (pointer: ClientPoint) => setIsOverTrash(isOver(pointer)),
    [isOver],
  );

  const stopTracking = useCallback(() => setIsOverTrash(false), []);

  return { trashRef, isOverTrash, isOver, trackPointer, stopTracking };
}
