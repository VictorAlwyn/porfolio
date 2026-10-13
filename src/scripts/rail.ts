export const rail = { ids: [] as string[], dwell: [] as number[], index: 0, local: 0, slip: 0 };

const ease = (x: number) => (1 - Math.cos(Math.PI * x)) / 2;

export function railT(i: number, p: number, n: number, a = 0.25) {
  if (n < 2) return 0;
  const lead = p < a ? ease(p / a) / 2 - 0.5 : 0;
  const lag = p > 1 - a ? ease((p - (1 - a)) / a) / 2 : 0;
  const u = Math.min(Math.max(i + lead + lag, 0), n - 1);
  return u / (n - 1);
}
