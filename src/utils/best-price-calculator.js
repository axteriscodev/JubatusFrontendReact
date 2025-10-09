/**
 * Metodo per calcolare la miglior selezione di pacchetti per ottenere il miglior prezzo
 *
 * @param {Array} packages - Array di pacchetti disponibili, ognuno con quantityPhoto, quantityVideo e price
 * @param {number} requiredPhotos - Il numero totale di foto richieste
 * @param {number} requiredVideos - Il numero totale di video richiesti
 * @returns {number} Il prezzo migliore trovato, oppure -1 se impossibile soddisfare i requisiti
 */
export function calculatePrice(packages, requiredPhotos, requiredVideos) {
  // Funzioni helper per identificare pacchetti "illimitati"
  // Un valore di -1 indica quantità illimitata
  const hasAllPhotos = (pkg) => pkg.quantityPhoto === -1;
  const hasAllVideos = (pkg) => pkg.quantityVideo === -1;

  // Inizializza il prezzo migliore a infinito (verrà aggiornato durante la ricerca)
  let bestPrice = Infinity;

  // Filtra solo i pacchetti con quantità finite (esclude i pacchetti illimitati)
  // Questi saranno usati nella programmazione dinamica
  const finitePackages = packages.filter(
    (pkg) => pkg.quantityPhoto >= 0 && pkg.quantityVideo >= 0
  );

  // === 1. PROGRAMMAZIONE DINAMICA per pacchetti finiti ===
  // Crea una matrice DP dove dp[p][v] rappresenta il costo minimo
  // per ottenere esattamente p foto e v video
  const dp = Array.from({ length: requiredPhotos + 1 }, () =>
    Array(requiredVideos + 1).fill(Infinity)
  );
  
  // Caso base: 0 foto e 0 video costano 0
  dp[0][0] = 0;

  // Itera su tutte le possibili combinazioni di foto e video
  for (let p = 0; p <= requiredPhotos; p++) {
    for (let v = 0; v <= requiredVideos; v++) {
      // Salta le combinazioni irraggiungibili
      if (dp[p][v] === Infinity) continue;

      // Prova ad aggiungere ogni pacchetto finito alla combinazione corrente
      for (const pkg of finitePackages) {
        // Calcola la nuova quantità di foto e video (senza superare il requisito)
        const nextP = Math.min(p + pkg.quantityPhoto, requiredPhotos);
        const nextV = Math.min(v + pkg.quantityVideo, requiredVideos);
        
        // Aggiorna il costo minimo per raggiungere questa nuova combinazione
        dp[nextP][nextV] = Math.min(dp[nextP][nextV], dp[p][v] + pkg.price);
      }
    }
  }

  // Il miglior prezzo usando solo pacchetti finiti
  bestPrice = dp[requiredPhotos][requiredVideos];

  // === 2. VALUTAZIONE PACCHETTI SPECIALI (con quantità illimitate) ===
  for (const pkg of packages) {
    const { quantityPhoto, quantityVideo, price } = pkg;

    // Verifica se il pacchetto copre tutte le foto richieste
    const coversPhotos =
      hasAllPhotos(pkg) || quantityPhoto >= requiredPhotos;
    
    // Verifica se il pacchetto copre tutti i video richiesti
    const coversVideos =
      hasAllVideos(pkg) || quantityVideo >= requiredVideos;

    // CASO 1: Pacchetto che copre sia tutte le foto che tutti i video
    if (coversPhotos && coversVideos) {
      bestPrice = Math.min(bestPrice, price);
    }

    // CASO 2: Pacchetto con foto illimitate, ma video limitati e insufficienti
    if (hasAllPhotos(pkg) && quantityVideo >= 0 && quantityVideo < requiredVideos) {
      // Calcola quanti video mancano
      const remainingVideos = requiredVideos - quantityVideo;

      // Crea una DP per trovare il modo più economico di coprire i video rimanenti
      const videoDP = Array(remainingVideos + 1).fill(Infinity);
      videoDP[0] = 0;

      // Itera per trovare la combinazione ottimale di pacchetti solo-video
      for (let v = 0; v <= remainingVideos; v++) {
        if (videoDP[v] === Infinity) continue;
        
        // Considera solo pacchetti che non contengono foto (per non pagare foto già coperte)
        for (const subPkg of finitePackages.filter(p => p.quantityPhoto === 0 && p.quantityVideo > 0)) {
          const nextV = Math.min(v + subPkg.quantityVideo, remainingVideos);
          videoDP[nextV] = Math.min(videoDP[nextV], videoDP[v] + subPkg.price);
        }
      }

      // Se è possibile coprire i video rimanenti, aggiorna il prezzo migliore
      if (videoDP[remainingVideos] !== Infinity) {
        bestPrice = Math.min(bestPrice, price + videoDP[remainingVideos]);
      }
    }

    // CASO 3: Pacchetto con video illimitati, ma foto limitate e insufficienti
    if (hasAllVideos(pkg) && quantityPhoto >= 0 && quantityPhoto < requiredPhotos) {
      // Calcola quante foto mancano
      const remainingPhotos = requiredPhotos - quantityPhoto;

      // Crea una DP per trovare il modo più economico di coprire le foto rimanenti
      const photoDP = Array(remainingPhotos + 1).fill(Infinity);
      photoDP[0] = 0;

      // Itera per trovare la combinazione ottimale di pacchetti solo-foto
      for (let p = 0; p <= remainingPhotos; p++) {
        if (photoDP[p] === Infinity) continue;
        
        // Considera solo pacchetti che non contengono video (per non pagare video già coperti)
        for (const subPkg of finitePackages.filter(p => p.quantityVideo === 0 && p.quantityPhoto > 0)) {
          const nextP = Math.min(p + subPkg.quantityPhoto, remainingPhotos);
          photoDP[nextP] = Math.min(photoDP[nextP], photoDP[p] + subPkg.price);
        }
      }

      // Se è possibile coprire le foto rimanenti, aggiorna il prezzo migliore
      if (photoDP[remainingPhotos] !== Infinity) {
        bestPrice = Math.min(bestPrice, price + photoDP[remainingPhotos]);
      }
    }
  }

  // Restituisce il prezzo migliore trovato, oppure -1 se impossibile soddisfare i requisiti
  return bestPrice === Infinity ? -1 : bestPrice;
}