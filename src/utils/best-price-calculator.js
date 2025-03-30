function calcolaPrezzoMiglioreCombinato(prezzi, fotoRichieste, videoRichiesti) {
  const memo = {};

  function trovaMigliorPrezzo(fotoRimaste, videoRimasti, indicePacchetto) {
    const chiave = `${fotoRimaste}-${videoRimasti}-${indicePacchetto}`;

    if (memo[chiave] !== undefined) {
      return memo[chiave];
    }

    if (fotoRimaste <= 0 && videoRimasti <= 0) {
      return 0;
    }

    if (indicePacchetto < 0) {
      return Infinity;
    }

    let migliorPrezzo = trovaMigliorPrezzo(fotoRimaste, videoRimasti, indicePacchetto - 1); // Prezzo senza questo pacchetto

    if (prezzi[indicePacchetto].photo <= fotoRimaste && prezzi[indicePacchetto].video <= videoRimasti) {
      const prezzoConPacchetto = prezzi[indicePacchetto].price + trovaMigliorPrezzo(
        fotoRimaste - prezzi[indicePacchetto].photo,
        videoRimasti - prezzi[indicePacchetto].video,
        indicePacchetto
      );
      migliorPrezzo = Math.min(migliorPrezzo, prezzoConPacchetto);
    }

    memo[chiave] = migliorPrezzo;
    return migliorPrezzo;
  }

  const migliorPrezzo = trovaMigliorPrezzo(fotoRichieste, videoRichiesti, prezzi.length - 1);

  return migliorPrezzo === Infinity ? "Nessuna combinazione trovata" : migliorPrezzo;
}

const prezzi = [
  { price: 3, photo: 1, video: 0 },
  { price: 10, photo: 5, video: 0 },
  { price: 25, photo: 10, video: 0 },
  { price: 10, photo: 0, video: 1 },
  { price: 30, photo: 10, video: 1 },
];

const fotoRichieste = 22;
const videoRichiesti = 2;

const prezzoMigliore = calcolaPrezzoMiglioreCombinato(prezzi, fotoRichieste, videoRichiesti);
console.log("Il prezzo migliore (combinato) è:", prezzoMigliore); // Output: 46