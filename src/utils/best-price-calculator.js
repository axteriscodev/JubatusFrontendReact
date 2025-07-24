/**
 * Metodo per calcolare la miglior selezione di pacchetti per ottenere il miglior prezzo
 *
 * @param {*} totalPhotos - Il numero totale di foto a catalogo
 * @param {*} prices - Listino prezzi
 * @param {*} photos - Foto selezionate
 * @param {*} videos - Video selezionati
 * @returns
 */
export function calculatePrice(packages, requiredPhotos, requiredVideos) {
   const hasAllPhotos = (pkg) => pkg.quantityPhoto === -1;
  const hasAllVideos = (pkg) => pkg.quantityVideo === -1;

  let bestPrice = Infinity;

  // Pacchetti con quantità finite
  const finitePackages = packages.filter(
    (pkg) => pkg.quantityPhoto >= 0 && pkg.quantityVideo >= 0
  );

  // === 1. Programmazione dinamica in avanti (permette più copie dello stesso pacchetto) ===
  const dp = Array.from({ length: requiredPhotos + 1 }, () =>
    Array(requiredVideos + 1).fill(Infinity)
  );
  dp[0][0] = 0;

  for (let p = 0; p <= requiredPhotos; p++) {
    for (let v = 0; v <= requiredVideos; v++) {
      if (dp[p][v] === Infinity) continue;

      for (const pkg of finitePackages) {
        const nextP = Math.min(p + pkg.quantityPhoto, requiredPhotos);
        const nextV = Math.min(v + pkg.quantityVideo, requiredVideos);
        dp[nextP][nextV] = Math.min(dp[nextP][nextV], dp[p][v] + pkg.price);
      }
    }
  }

  bestPrice = dp[requiredPhotos][requiredVideos];

  // === 2. Valutazione pacchetti speciali ===
  for (const pkg of packages) {
    const { quantityPhoto, quantityVideo, price } = pkg;

    const coversPhotos =
      hasAllPhotos(pkg) || quantityPhoto >= requiredPhotos;
    const coversVideos =
      hasAllVideos(pkg) || quantityVideo >= requiredVideos;

    // Copre tutto
    if (coversPhotos && coversVideos) {
      bestPrice = Math.min(bestPrice, price);
    }

    // Copre tutte le foto, ma non tutti i video
    if (hasAllPhotos(pkg) && quantityVideo >= 0 && quantityVideo < requiredVideos) {
      const remainingVideos = requiredVideos - quantityVideo;

      const videoDP = Array(remainingVideos + 1).fill(Infinity);
      videoDP[0] = 0;

      for (let v = 0; v <= remainingVideos; v++) {
        if (videoDP[v] === Infinity) continue;
        for (const subPkg of finitePackages.filter(p => p.quantityPhoto === 0 && p.quantityVideo > 0)) {
          const nextV = Math.min(v + subPkg.quantityVideo, remainingVideos);
          videoDP[nextV] = Math.min(videoDP[nextV], videoDP[v] + subPkg.price);
        }
      }

      if (videoDP[remainingVideos] !== Infinity) {
        bestPrice = Math.min(bestPrice, price + videoDP[remainingVideos]);
      }
    }

    // Copre tutti i video, ma non tutte le foto
    if (hasAllVideos(pkg) && quantityPhoto >= 0 && quantityPhoto < requiredPhotos) {
      const remainingPhotos = requiredPhotos - quantityPhoto;

      const photoDP = Array(remainingPhotos + 1).fill(Infinity);
      photoDP[0] = 0;

      for (let p = 0; p <= remainingPhotos; p++) {
        if (photoDP[p] === Infinity) continue;
        for (const subPkg of finitePackages.filter(p => p.quantityVideo === 0 && p.quantityPhoto > 0)) {
          const nextP = Math.min(p + subPkg.quantityPhoto, remainingPhotos);
          photoDP[nextP] = Math.min(photoDP[nextP], photoDP[p] + subPkg.price);
        }
      }

      if (photoDP[remainingPhotos] !== Infinity) {
        bestPrice = Math.min(bestPrice, price + photoDP[remainingPhotos]);
      }
    }
  }

  return bestPrice === Infinity ? -1 : bestPrice;
}
