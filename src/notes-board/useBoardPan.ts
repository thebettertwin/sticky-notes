import { useCallback, useState } from "react";
import type { Point } from "../core-ui/geometry";

/** The camera over the board: `pan` is the board coordinate shown at the viewport's top-left */
export function useBoardPan() {
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });

  const panBy = useCallback((dx: number, dy: number) => {
    setPan((current) => ({ x: current.x + dx, y: current.y + dy }));
  }, []);

  return { pan, panBy };
}
