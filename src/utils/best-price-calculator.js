function calculatePrice(prices, photos, videos) {
  const memo = {};

  function findBestPrice(leftPhotos, leftVideos, pricePacketIndex) {
    const chiave = `${leftPhotos}-${leftVideos}-${pricePacketIndex}`;

    if (memo[chiave] !== undefined) {
      return memo[chiave];
    }

    // Se non ci sono più foto e video da soddisfare
    if (leftPhotos <= 0 && leftVideos <= 0) {
      return 0;
    }

    // Se non ci sono più pacchetti da considerare
    if (pricePacketIndex < 0) {
      return Infinity;
    }

    // Caso in cui non includiamo il pacchetto attuale
    let migliorPrezzo = findBestPrice(leftPhotos, leftVideos, pricePacketIndex - 1);

    // Se il pacchetto corrente è applicabile, possiamo considerarlo
    if (prices[pricePacketIndex].photo <= leftPhotos && prices[pricePacketIndex].video <= leftVideos) {
      const prezzoConPacchetto = prices[pricePacketIndex].price + findBestPrice(
        leftPhotos - prices[pricePacketIndex].photo,
        leftVideos - prices[pricePacketIndex].video,
        pricePacketIndex // Manteniamo lo stesso pacchetto (per poterlo riutilizzare)
      );
      migliorPrezzo = Math.min(migliorPrezzo, prezzoConPacchetto);
    }

    memo[chiave] = migliorPrezzo;
    return migliorPrezzo;
  }

  const migliorPrezzo = findBestPrice(photos, videos, prices.length - 1);

  return migliorPrezzo === Infinity ? "Nessuna combinazione trovata" : migliorPrezzo;
}

const prezzi = [
  { price: 3, photo: 1, video: 0 },
  { price: 10, photo: 5, video: 0 },
  { price: 18, photo: 10, video: 0 },
  { price: 5, photo: 0, video: 1 },
  { price: 21, photo: 10, video: 1 },
];

const fotoRichieste = 22;
const videoRichiesti = 2;

const prezzoMigliore = calculatePrice(prezzi, fotoRichieste, videoRichiesti);
console.log("Il prezzo migliore (combinato) è:", prezzoMigliore); // Output corretto: 60
