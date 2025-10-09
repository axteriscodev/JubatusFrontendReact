/**
 * Utility functions per la gestione del form eventi
 */

/**
 * Restituisce i dati di default per un nuovo form
 */
export const getDefaultFormData = () => ({
  slug: "",
  pathS3: "",
  emoji: "",
  backgroundColor: "#000000",
  primaryColor: "#000000",
  secondaryColor: "#000000",
  logo: "",
  dateEvent: "",
  dateExpiry: "",
  dateStart: "",
  datePreorderStart: "",
  datePreorderExpiry: "",
  title: "",
  location: "",
  description: "",
  tag: "",
});

/**
 * Mappa i dati ricevuti dal server al formato del form
 */
export const getInitialFormData = (receivedComp) => {
  if (!receivedComp) return getDefaultFormData();

  return {
    id: receivedComp.id,
    slug: receivedComp.slug,
    pathS3: receivedComp.pathS3,
    emoji: receivedComp.languages?.[0]?.emoji || "",
    backgroundColor: receivedComp.backgroundColor,
    primaryColor: receivedComp.primaryColor,
    secondaryColor: receivedComp.secondaryColor,
    logo: "",
    dateEvent: receivedComp.dateEvent?.split("T")[0] || "",
    dateExpiry: receivedComp.dateExpiry?.split("T")[0] || "",
    dateStart: receivedComp.dateStart?.split("T")[0] || "",
    datePreorderStart: receivedComp.datePreorderStart?.split("T")[0] || "",
    datePreorderExpiry: receivedComp.datePreorderExpiry?.split("T")[0] || "",
    title: receivedComp.languages?.[0]?.title || "",
    location: receivedComp.languages?.[0]?.location || "",
    description: receivedComp.languages?.[0]?.description || "",
    tag: receivedComp.tag || "",
  };
};

/**
 * Crea un oggetto item vuoto per i listini
 */
export const createEmptyPriceItem = () => ({
  title: "",
  subTitle: "",
  bestOffer: false,
  quantityPhoto: "",
  quantityVideo: "",
  price: "",
  discount: "",
  itemsLanguages: [
    {
      title: "",
      subTitle: "",
    },
  ],
});

/**
 * Crea un listino vuoto
 */
export const createEmptyPriceList = () => ({
  dateStart: "",
  dateExpiry: "",
  items: [createEmptyPriceItem()],
});

/**
 * Restituisce il listino di default
 */
export const getDefaultPriceLists = () => [createEmptyPriceList()];

/**
 * Costruisce l'oggetto language per l'invio al server
 */
export const buildLanguageObject = (formData) => ({
  title: formData.title,
  location: formData.location,
  description: formData.description,
  emoji: formData.emoji,
});

/**
 * Prepara i dati del form per l'invio al server
 */
export const prepareSubmitData = (formData, priceLists) => ({
  ...formData,
  languages: [buildLanguageObject(formData)],
  lists: priceLists,
});