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
  // Funzione helper: indica se il pacchetto include tutte le foto
  const hasAllPhotos = (pkg) => pkg.quantityPhoto === -1;
  // Funzione helper: indica se il pacchetto include tutti i video
  const hasAllVideos = (pkg) => pkg.quantityVideo === -1;

  let bestPrice = Infinity;

  // Pacchetti con quantità finite (>= 0 per entrambi)
  const finitePackages = packages.filter(
    (pkg) => pkg.quantityPhoto >= 0 && pkg.quantityVideo >= 0
  );

  // === 1. Calcolo base: solo pacchetti normali combinati via programmazione dinamica ===
  const dp = Array.from({ length: requiredPhotos + 1 }, () =>
    Array(requiredVideos + 1).fill(Infinity)
  );
  dp[0][0] = 0; // prezzo base: 0 foto, 0 video = 0€

  for (const pkg of finitePackages) {
    const { quantityPhoto, quantityVideo, price } = pkg;

    // Calcolo combinazioni valide partendo dall'alto verso il basso (evita sovrascritture premature)
    for (let p = requiredPhotos; p >= quantityPhoto; p--) {
      for (let v = requiredVideos; v >= quantityVideo; v--) {
        const prev = dp[p - quantityPhoto][v - quantityVideo];
        if (prev !== Infinity) {
          dp[p][v] = Math.min(dp[p][v], prev + price);
        }
      }
    }
  }

  // Salvo il prezzo più basso ottenuto solo da pacchetti normali
  bestPrice = dp[requiredPhotos][requiredVideos];

  // === 2. Valuto i pacchetti speciali (illimitati o combinati) ===
  for (const pkg of packages) {
    const { quantityPhoto, quantityVideo, price } = pkg;

    const coversPhotos =
      hasAllPhotos(pkg) || quantityPhoto >= requiredPhotos;
    const coversVideos =
      hasAllVideos(pkg) || quantityVideo >= requiredVideos;

    // Se copre tutte le foto e tutti i video: può sostituire tutto
    if (coversPhotos && coversVideos) {
      bestPrice = Math.min(bestPrice, price);
    }

    // Caso: pacchetto copre tutte le foto, ma solo una parte dei video
    if (hasAllPhotos(pkg) && quantityVideo >= 0 && quantityVideo < requiredVideos) {
      const remainingVideos = requiredVideos - quantityVideo;

      // Trova il miglior modo per coprire i video rimanenti con pacchetti normali (solo video)
      const videoDP = Array(remainingVideos + 1).fill(Infinity);
      videoDP[0] = 0;

      for (const subPkg of finitePackages.filter(p => p.quantityPhoto === 0 && p.quantityVideo > 0)) {
        for (let v = remainingVideos; v >= subPkg.quantityVideo; v--) {
          const prev = videoDP[v - subPkg.quantityVideo];
          if (prev !== Infinity) {
            videoDP[v] = Math.min(videoDP[v], prev + subPkg.price);
          }
        }
      }

      if (videoDP[remainingVideos] !== Infinity) {
        bestPrice = Math.min(bestPrice, price + videoDP[remainingVideos]);
      }
    }

    // Caso: pacchetto copre tutti i video, ma solo una parte delle foto
    if (hasAllVideos(pkg) && quantityPhoto >= 0 && quantityPhoto < requiredPhotos) {
      const remainingPhotos = requiredPhotos - quantityPhoto;

      // Trova il miglior modo per coprire le foto rimanenti con pacchetti normali (solo foto)
      const photoDP = Array(remainingPhotos + 1).fill(Infinity);
      photoDP[0] = 0;

      for (const subPkg of finitePackages.filter(p => p.quantityVideo === 0 && p.quantityPhoto > 0)) {
        for (let p = remainingPhotos; p >= subPkg.quantityPhoto; p--) {
          const prev = photoDP[p - subPkg.quantityPhoto];
          if (prev !== Infinity) {
            photoDP[p] = Math.min(photoDP[p], prev + subPkg.price);
          }
        }
      }

      if (photoDP[remainingPhotos] !== Infinity) {
        bestPrice = Math.min(bestPrice, price + photoDP[remainingPhotos]);
      }
    }
  }

  // Se nessuna combinazione valida è stata trovata, ritorna -1
  return bestPrice === Infinity ? -1 : bestPrice;
}
