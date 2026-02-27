interface PricePackage {
  quantityPhoto: number;
  quantityVideo: number;
  quantityClip: number;
  price: number;
}

interface NormalizedPackage {
  p: number;
  v: number;
  c: number;
  price: number;
  original: PricePackage;
}

export interface CalculatePriceResult {
  price: number;
  usedPackages: PricePackage[];
}

function backtrack(
  normalized: NormalizedPackage[],
  parent: (PricePackage | null)[][][],
  reqP: number,
  reqV: number,
  reqC: number,
): PricePackage[] {
  const used: PricePackage[] = [];
  let p = reqP, v = reqV, c = reqC;

  while (p > 0 || v > 0 || c > 0) {
    const pkg = parent[p][v][c];
    if (!pkg) break;
    used.push(pkg);
    const norm = normalized.find((n) => n.original === pkg)!;
    p = Math.max(0, p - norm.p);
    v = Math.max(0, v - norm.v);
    c = Math.max(0, c - norm.c);
  }

  return used;
}

export function calculatePrice(
  packages: PricePackage[],
  reqP: number,
  reqV: number,
  reqC: number,
): CalculatePriceResult {
  const dp: number[][][] = Array.from({ length: reqP + 1 }, () =>
    Array.from({ length: reqV + 1 }, () => Array(reqC + 1).fill(Infinity)),
  );

  const parent: (PricePackage | null)[][][] = Array.from({ length: reqP + 1 }, () =>
    Array.from({ length: reqV + 1 }, () => Array(reqC + 1).fill(null)),
  );

  dp[0][0][0] = 0;

  const normalized: NormalizedPackage[] = packages.map((pkg) => ({
    p: pkg.quantityPhoto === -1 ? reqP : pkg.quantityPhoto,
    v: pkg.quantityVideo === -1 ? reqV : pkg.quantityVideo,
    c: pkg.quantityClip === -1 ? reqC : pkg.quantityClip,
    price: pkg.price,
    original: pkg,
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
            parent[nP][nV][nC] = pkg.original;
          }
        }
      }
    }
  }

  const result = dp[reqP][reqV][reqC];
  if (result === Infinity) return { price: -1, usedPackages: [] };
  return { price: result, usedPackages: backtrack(normalized, parent, reqP, reqV, reqC) };
}
