/** A point in board coordinates (px from the board's top-left) */
export interface Point {
  x: number;
  y: number;
}

/** A point in viewport coordinates, as on pointer events */
export interface ClientPoint {
  clientX: number;
  clientY: number;
}

export function isPointInRect({ clientX, clientY }: ClientPoint, rect: DOMRectReadOnly): boolean {
  return (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  );
}
