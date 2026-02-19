/**
 * Metodo che imposta l'interfaccia utente con il tema dell'evento
 * 
 * @param {*} eventData - dati dell'evento
 */
export function setUiPreset(eventData) {
    document.documentElement.style.setProperty( "--bg-event-color", eventData.backgroundColor );
    document.documentElement.style.setProperty( "--font-button-event-color", eventData.backgroundColor );
    document.documentElement.style.setProperty( "--primary-event-color", eventData.primaryColor );
    document.documentElement.style.setProperty( "--secondary-event-color", eventData.secondaryColor );
}

export function setHeaderData(eventData) {
    //da ripristinare quando passerà la favicon
    // let link = document.querySelector("link[rel='icon']");
    // link.href = eventData.faviconUrl;

    document.title = eventData.languages[0].title;
}

export function resetHeaderData() {
    document.title = 'My Memories';
}