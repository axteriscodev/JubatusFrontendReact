/**
 * Metodo di utiità per verificare se l'utente ha diritto al pacchetto foto completo
 * 
 * @param {*} actualPrice - attuale prezzo del carrello
 * @param {*} prices - listino prezzi
 * @returns - true se l'utente ha diritto al pacchetto completo, false altrimenti
 */
export function isPhotoFullPackEligible(actualPrice, prices) {
    const fullPackPrice = prices.find((price) => price.quantityPhoto === -1);
    if (!fullPackPrice)
        return false;
    
    if(actualPrice >= fullPackPrice.price) {
        return true;
    } else {
        return false;
    }
}

/**
 * Metodo di utiità per verificare se l'utente ha diritto al pacchetto video completo
 * 
 * @param {*} actualPrice - attuale prezzo del carrello
 * @param {*} prices - listino prezzi
 * @returns - true se l'utente ha diritto al pacchetto completo, false altrimenti
 */
export function isVideoFullPackEligible(actualPrice, prices) {
    const fullPackPrice = prices.find((price) => price.quantityVideo === -1);

    if(actualPrice >= fullPackPrice.price) {
        return true;
    } else {
        return false;
    }
}

export function calculateDiscount(price, pricePack) {
    if(pricePack.discount === null || pricePack.discount === 0) {
        return price;
    } else {
        return (price - (price * pricePack.discount / 100)).toFixed(2);
    }
}