// Shared scroll state: motion.ts writes it, world.ts reads it. Pure, no DOM.
export const rail = { ids: [] as string[], index: 0, local: 0, slip: 0 };

// Maps "zone i, progress p through it" onto 0..1 along the camera path of n stops.
// The camera sits exactly on stop i while zone i is centred and eases between stops, so it lingers while you read.
export function railT(i: number, p: number, n: number) {
  if (n < 2) return 0;
  const u = Math.min(Math.max(i + p - 0.5, 0), n - 1);
  const k = Math.min(Math.floor(u), n - 2);
  return (k + (1 - Math.cos(Math.PI * (u - k))) / 2) / (n - 1);
}
