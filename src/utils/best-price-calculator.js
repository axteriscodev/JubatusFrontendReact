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
  const filteredPackages = packages.filter(
    (price) => price.quantityPhoto !== -1
  );

  // Crea una tabella DP per memorizzare il miglior prezzo per ogni combinazione di foto e video
  const dp = Array.from({ length: requiredPhotos + 1 }, () =>
    Array(requiredVideos + 1).fill(Infinity)
  );

  // La base: il prezzo per 0 foto e 0 video è 0
  dp[0][0] = 0;

  // Esploriamo ogni pacchetto
  for (let i = 0; i < filteredPackages.length; i++) {
    const { quantityPhoto, quantityVideo, price } = filteredPackages[i];

    // Aggiorniamo la tabella DP
    for (let photos = 0; photos <= requiredPhotos; photos++) {
      for (let videos = 0; videos <= requiredVideos; videos++) {
        // Verifica se è possibile aggiungere il pacchetto a questa combinazione
        if (photos >= quantityPhoto && videos >= quantityVideo) {
          // Calcoliamo il nuovo prezzo
          const newPrice =
            dp[photos - quantityPhoto][videos - quantityVideo] + price;
          dp[photos][videos] = Math.min(dp[photos][videos], newPrice);
        }
      }
    }
  }

  // Se la cella finale ha ancora il valore Infinity, significa che non esiste una combinazione valida
  return dp[requiredPhotos][requiredVideos] === Infinity
    ? -1
    : dp[requiredPhotos][requiredVideos];
}

/**
 * Calcola il miglior prezzo e il miglior prezzo scontato per una selezione di pacchetti
 *
 * @param {*} packages - Lista pacchetti [{ quantityPhoto, quantityVideo, price, discount }]
 * @param {*} requiredPhotos - Numero di foto richieste
 * @param {*} requiredVideos - Numero di video richiesti
 * @returns {{ bestPrice: number, bestDiscountedPrice: number } | -1}
 */
export function calculatePriceWithDiscount(
  packages,
  requiredPhotos,
  requiredVideos
) {
  const filteredPackages = packages.filter((pkg) => pkg.quantityPhoto !== -1);

  const dp = Array.from({ length: requiredPhotos + 1 }, () =>
    Array(requiredVideos + 1).fill(Infinity)
  );
  const dpDiscounted = Array.from({ length: requiredPhotos + 1 }, () =>
    Array(requiredVideos + 1).fill(Infinity)
  );

  dp[0][0] = 0;
  dpDiscounted[0][0] = 0;

  for (const pkg of filteredPackages) {
    const { quantityPhoto, quantityVideo, price, discount = 0 } = pkg;
    const discountedPrice = Math.max(price - discount, 0);

    for (let photos = requiredPhotos; photos >= 0; photos--) {
      for (let videos = requiredVideos; videos >= 0; videos--) {
        const prevPhotos = photos - quantityPhoto;
        const prevVideos = videos - quantityVideo;

        if (prevPhotos >= 0 && prevVideos >= 0) {
          const newPrice = dp[prevPhotos][prevVideos] + price;
          const newDiscounted =
            dpDiscounted[prevPhotos][prevVideos] + discountedPrice;

          dp[photos][videos] = Math.min(dp[photos][videos], newPrice);
          dpDiscounted[photos][videos] = Math.min(
            dpDiscounted[photos][videos],
            newDiscounted
          );
        }
      }
    }
  }

  const bestPrice = dp[requiredPhotos][requiredVideos];
  const bestDiscountedPrice = dpDiscounted[requiredPhotos][requiredVideos];

  return bestPrice === Infinity
    ? -1
    : {
        bestPrice,
        bestDiscountedPrice,
      };
}
