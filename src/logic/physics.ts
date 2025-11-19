export interface BallState {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const FIELD_WIDTH = 300;
export const FIELD_HEIGHT = 400;

export function stepBall(ball: BallState, dt: number): BallState {
  let { x, y, vx, vy } = ball;

  x += vx * dt;
  y += vy * dt;

  if (x < 0) {
    x = 0;
    vx = -vx;
  } else if (x > FIELD_WIDTH) {
    x = FIELD_WIDTH;
    vx = -vx;
  }

  if (y < 0) {
    y = 0;
    vy = -vy;
  } else if (y > FIELD_HEIGHT) {
    y = FIELD_HEIGHT;
    vy = -vy;
  }

  return { ...ball, x, y, vx, vy };
}
