import type { Object3D } from 'three';

export type Tier = 1 | 2;
export type Vec3 = [number, number, number];
export type Palette = { paper: string; ink: string; spot: string; dark?: boolean };
export type Built = { object: Object3D; update?: (local: number, time: number) => void };
export type ZoneArt = { id: string; cam: Vec3; look: Vec3; palette: Palette; build: (tier: Tier) => Built };
export type WorldArt = { boss: Palette; zones: ZoneArt[] };
