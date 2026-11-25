// 점이 max개를 넘으면 고르게 솎는다. 첫 점과 끝 점은 남는다
export const thin = <T>(points: T[], max: number) =>
  points.length <= max
    ? points
    : Array.from({ length: max }, (_, i) => points[Math.round((i * (points.length - 1)) / (max - 1))]);
