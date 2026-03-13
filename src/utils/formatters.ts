export function formatNumber(num: number | string): string {
  if (typeof num === 'string') return num;
  return new Intl.NumberFormat('en-US', { notation: "compact", compactDisplay: "short" }).format(num);
}
