/**
 * Metodo per calcolare la miglior selezione di pacchetti per ottenere il miglior prezzo
 * 
 * @param {*} totalPhotos - Il numero totale di foto a catalogo
 * @param {*} prices - Listino prezzi
 * @param {*} photos - Foto selezionate
 * @param {*} videos - Video selezionati
 * @returns 
 */
export function calculatePrice(totalPhotos, prices, photos, videos) {
  const memo = {};

  function findBestPrice(leftPhotos, leftVideos, pricePacketIndex) {
    const key = `${leftPhotos}-${leftVideos}-${pricePacketIndex}`;

    if (memo[key] !== undefined) {
      return memo[key];
    }

    // Se non ci sono più foto e video da soddisfare
    if (leftPhotos <= 0 && leftVideos <= 0) {
      return 0;
    }

    // Se non ci sono più pacchetti da considerare e il percorso non è utilizzabile
    if (pricePacketIndex < 0) {
      return Infinity;
    }

    // Caso in cui non includiamo il pacchetto attuale
    let bestPrice = findBestPrice(leftPhotos, leftVideos, pricePacketIndex - 1);

    // Se il pacchetto corrente è applicabile, possiamo considerarlo
    if (prices[pricePacketIndex].photo <= leftPhotos && prices[pricePacketIndex].video <= leftVideos) {
      const prezzoConPacchetto = prices[pricePacketIndex].price + findBestPrice(
        leftPhotos - prices[pricePacketIndex].photo,
        leftVideos - prices[pricePacketIndex].video,
        pricePacketIndex // Riproviamo con lo stesso pacchetto
      );
      bestPrice = Math.min(bestPrice, prezzoConPacchetto);
    }

    memo[key] = bestPrice;
    return bestPrice;
  }

  if(totalPhotos === photos) {
    const totalPack = prices.find((price) => price.quantityPhoto === -1 );

    if(totalPack) {
      return totalPack.price;
    }
  }

  const bestPrice = findBestPrice(photos, videos, prices.length - 1);

  return bestPrice === Infinity ? "Nessuna combinazione trovata" : bestPrice;
}


//------------ TEST --------------

// const prezzi = [
//   { price: 3, photo: 1, video: 0 },
//   { price: 10, photo: 5, video: 0 },
//   { price: 18, photo: 10, video: 0 },
//   { price: 5, photo: 0, video: 1 },
//   { price: 21, photo: 10, video: 1 },
// ];

// const fotoTotali = 40;
// const fotoRichieste = 22;
// const videoRichiesti = 2;

// const prezzoMigliore = calculatePrice(50, prezzi, fotoRichieste, videoRichiesti);
// console.log("Best price:", prezzoMigliore);


// -----------------------------------
