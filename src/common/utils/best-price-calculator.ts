interface PricePackage {
  quantityPhoto: number;
  quantityVideo: number;
  quantityClip: number;
  price: number;
}

export function calculatePrice(
  packages: PricePackage[],
  reqP: number,
  reqV: number,
  reqC: number,
): number {
  const dp: number[][][] = Array.from({ length: reqP + 1 }, () =>
    Array.from({ length: reqV + 1 }, () => Array(reqC + 1).fill(Infinity)),
  );

  dp[0][0][0] = 0;

  const normalized = packages.map((pkg) => ({
    p: pkg.quantityPhoto === -1 ? reqP : pkg.quantityPhoto,
    v: pkg.quantityVideo === -1 ? reqV : pkg.quantityVideo,
    c: pkg.quantityClip === -1 ? reqC : pkg.quantityClip,
    price: pkg.price,
  }));

  for (let p = 0; p <= reqP; p++) {
    for (let v = 0; v <= reqV; v++) {
      for (let c = 0; c <= reqC; c++) {
        if (dp[p][v][c] === Infinity) continue;

        for (const pkg of normalized) {
          const nP = Math.min(p + pkg.p, reqP);
          const nV = Math.min(v + pkg.v, reqV);
          const nC = Math.min(c + pkg.c, reqC);

          if (dp[p][v][c] + pkg.price < dp[nP][nV][nC]) {
            dp[nP][nV][nC] = dp[p][v][c] + pkg.price;
          }
        }
      }
    }
  }

  const result = dp[reqP][reqV][reqC];
  return result === Infinity ? -1 : result;
}
