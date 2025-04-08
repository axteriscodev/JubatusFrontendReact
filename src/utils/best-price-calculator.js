/**
 * Metodo per calcolare la miglior selezione di pacchetti per ottenere il miglior prezzo
 *
 * @param {*} totalPhotos - Il numero totale di foto a catalogo
 * @param {*} prices - Listino prezzi
 * @param {*} photos - Foto selezionate
 * @param {*} videos - Video selezionati
 * @returns
 */
export function calculatePrice(
  totalPhotos,
  packages,
  requiredPhotos,
  requiredVideos
) {
  if (totalPhotos === requiredPhotos) {
    const totalPack = packages.find((price) => price.quantityPhoto === -1);

    if (totalPack) {
      return totalPack.price;
    }
  }

  const filteredPackages = packages.filter((price) => price.quantityPhoto !== -1);

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
