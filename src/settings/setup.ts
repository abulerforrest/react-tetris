import { Layers } from "three";

export const gameLayers = new Layers();

export const Layer = {
  LOGO: 4,
  GAME: 3,
  STARS: 2,
  TOP: 1,
  TEST: 1,
} as const;
