const flagOverrides = {
    en: 'gb', // per l'inglese
    it: 'it', // per l'italiano
    pt: 'pt', // per il portoghese
    // altri se necessario
};

export function getFlagCode(langCode){
    return flagOverrides[langCode] ?? langCode;
}