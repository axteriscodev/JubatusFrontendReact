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