/**
 * Trova il pacchetto full pack più conveniente in base al prezzo base
 *
 * @param {Array} prices - Array di pacchetti di prezzo
 * @param {string} type - Tipo di pacchetto da cercare: 'photo' o 'video'
 * @returns {Object|null} - Il pacchetto più conveniente o null se non trovato
 */
function getCheapestFullPack(prices, type) {
  if (!prices || !Array.isArray(prices) || prices.length === 0) {
    return null;
  }

  // Filtra tutti i pacchetti full pack del tipo richiesto
  let fullPackPrices;

  if (type === 'photo') {
    fullPackPrices = prices.filter((price) => price.quantityPhoto === -1);
  } else if (type === 'video') {
    fullPackPrices = prices.filter((price) => price.quantityVideo === -1);
  } else {
    return null;
  }

  // Se non ci sono pacchetti full pack, ritorna null
  if (fullPackPrices.length === 0) {
    return null;
  }

  // Trova il pacchetto con il prezzo più basso
  let cheapestPack = fullPackPrices[0];
  let cheapestPrice = cheapestPack.price;

  for (let i = 1; i < fullPackPrices.length; i++) {
    if (fullPackPrices[i].price < cheapestPrice) {
      cheapestPrice = fullPackPrices[i].price;
      cheapestPack = fullPackPrices[i];
    }
  }

  return cheapestPack;
}

/**
 * Metodo di utilità per verificare se l'utente ha diritto al pacchetto foto completo
 *
 * Ora cerca TUTTI i pacchetti con quantityPhoto === -1 e seleziona il più conveniente
 *
 * @param {*} actualPrice - attuale prezzo del carrello
 * @param {*} prices - listino prezzi
 * @returns - true se l'utente ha diritto al pacchetto completo, false altrimenti
 */
export function isPhotoFullPackEligible(actualPrice, prices) {
  const fullPackPrice = getCheapestFullPack(prices, 'photo');
  if (!fullPackPrice) return false;

  if (actualPrice >= fullPackPrice.price) {
    return true;
  } else {
    return false;
  }
}

/**
 * Metodo di utilità per verificare se l'utente ha diritto al pacchetto video completo
 *
 * Ora cerca TUTTI i pacchetti con quantityVideo === -1 e seleziona il più conveniente.
 * Aggiunge anche il null check mancante.
 *
 * @param {*} actualPrice - attuale prezzo del carrello
 * @param {*} prices - listino prezzi
 * @returns - true se l'utente ha diritto al pacchetto completo, false altrimenti
 */
export function isVideoFullPackEligible(actualPrice, prices) {
  const fullPackPrice = getCheapestFullPack(prices, 'video');

  if (!fullPackPrice) return false;

  if (actualPrice >= fullPackPrice.price) {
    return true;
  } else {
    return false;
  }
}

export function calculateDiscount(price, pricePack) {
  if (pricePack.discount === null || pricePack.discount === 0) {
    return price;
  } else {
    return (price - (price * pricePack.discount) / 100).toFixed(2);
  }
}
