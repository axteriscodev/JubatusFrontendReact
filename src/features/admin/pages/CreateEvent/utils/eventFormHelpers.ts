import type { Competition } from '@/types/competition';
import type { PriceItem, PriceList } from '@/types/cart';
import { getOrganizationId } from '@common/utils/auth';

/**
 * Struttura piatta usata internamente dai form di creazione/modifica evento.
 * È una "proiezione" semplificata di Competition: i campi multilingua (title,
 * location, description, emoji) sono estratti dalla prima lingua dell'array
 * languages, e il logo viene gestito come stringa (URL esistente) oppure File
 * (nuovo upload selezionato dall'utente).
 *
 * id è opzionale: assente durante la creazione, presente durante la modifica.
 */
export interface EventFormData {
  id?: number;
  slug: string;
  pathS3: string;           // percorso S3 delle foto dell'evento
  emoji: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string | File;      // stringa = URL già salvato sul server; File = nuovo upload
  dateEvent: string;        // data dello svolgimento fisico dell'evento (YYYY-MM-DD)
  dateExpiry: string;       // data oltre cui l'evento non è più visibile/acquistabile
  dateStart: string;        // data di pubblicazione: da quando l'evento è visibile
  datePreorderStart: string;
  datePreorderExpiry: string;
  title: string;
  location: string;
  description: string;
  tag: string;              // etichetta testuale del tag (es. "Running")
  tagId: number;            // ID del tag selezionato, inviato al backend
  currencyId: number;
  verifiedAttendanceEvent: boolean; // se true, abilita la tab Partecipanti con upload lista
  hasReel: boolean;
  aspectRatio: string;
  organizationId: number;
}

/**
 * Valori iniziali per un nuovo evento (nessun Competition dal server).
 * dateStart viene preimpostato a oggi e dateExpiry a oggi + 4 anni,
 * così l'admin non deve compilarli da zero nel caso più comune.
 * Le date vengono estratte come YYYY-MM-DD (formato atteso dagli <input type="date">).
 */
export const getDefaultFormData = (): EventFormData => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];

  const fourYearsLater = new Date(today);
  fourYearsLater.setFullYear(fourYearsLater.getFullYear() + 4);
  const fourYearsLaterStr = fourYearsLater.toISOString().split('T')[0];

  return {
    slug: '',
    pathS3: '',
    emoji: '',
    backgroundColor: '#000000',
    primaryColor: '#000000',
    secondaryColor: '#000000',
    logo: '',
    dateEvent: '',
    dateExpiry: fourYearsLaterStr,
    dateStart: todayStr,
    datePreorderStart: '',
    datePreorderExpiry: '',
    title: '',
    location: '',
    description: '',
    tag: '',
    tagId: 0,
    currencyId: 0,
    verifiedAttendanceEvent: false,
    hasReel: false,
    aspectRatio: '1:1',
    organizationId: getOrganizationId(),
  };
};

/**
 * Converte un oggetto Competition (struttura API, con array languages) nel formato
 * piatto EventFormData usato dai form. Usa la prima voce di languages come lingua
 * di default (assumendo che il backend restituisca sempre almeno una lingua).
 *
 * Le date ISO 8601 (es. "2024-06-15T00:00:00Z") vengono troncate a YYYY-MM-DD
 * per essere compatibili con <input type="date">.
 *
 * Il campo logo viene azzerato: il form non ricarica l'immagine esistente nel
 * file input (impossibile per ragioni di sicurezza browser); l'anteprima viene
 * gestita separatamente da EventLogo tramite la prop receivedComp.
 *
 * Se receivedComp è null (nuovo evento), delega a getDefaultFormData.
 */
export const getInitialFormData = (receivedComp: Competition | null): EventFormData => {
  if (!receivedComp) return getDefaultFormData();

  return {
    id: receivedComp.id,
    slug: receivedComp.slug,
    pathS3: receivedComp.pathS3 ?? '',
    emoji: receivedComp.languages?.[0]?.emoji || '',
    backgroundColor: receivedComp.backgroundColor,
    primaryColor: receivedComp.primaryColor,
    secondaryColor: receivedComp.secondaryColor,
    logo: '',
    dateEvent: receivedComp.dateEvent?.split('T')[0] || '',
    dateExpiry: receivedComp.dateExpiry?.split('T')[0] || '',
    dateStart: receivedComp.dateStart?.split('T')[0] || '',
    datePreorderStart: receivedComp.datePreorderStart?.split('T')[0] || '',
    datePreorderExpiry: receivedComp.datePreorderExpiry?.split('T')[0] || '',
    title: receivedComp.languages?.[0]?.title || '',
    location: receivedComp.languages?.[0]?.location || '',
    description: receivedComp.languages?.[0]?.description || '',
    tag: receivedComp.tag?.tag || '',
    tagId: receivedComp.tagId || 0,
    currencyId: receivedComp.currencyId || 0,
    verifiedAttendanceEvent: receivedComp.verifiedAttendanceEvent || false,
    hasReel: receivedComp.hasReel || false,
    aspectRatio: receivedComp.aspectRatio || '1:1',
    organizationId: receivedComp.organizationId || 0,
  };
};

/**
 * Crea un pacchetto (riga) vuoto all'interno di un listino prezzi.
 * price e discount sono stringhe vuote (non 0) per poter distinguere
 * "campo non ancora compilato" da "valore zero", utile per la validazione UI.
 */
export const createEmptyPriceItem = (): PriceItem => ({
  labelId: null,
  bestOffer: false,
  quantityPhoto: 0,
  quantityClip: 0,
  quantityVideo: 0,
  price: '',
  discount: '',
});

/**
 * Crea un listino prezzi vuoto con un solo pacchetto iniziale.
 * Il listino viene aggiunto alla tab "Listini prezzi" quando l'utente
 * clicca "Aggiungi listino".
 */
export const createEmptyPriceList = (): PriceList => ({
  dateStart: '',
  dateExpiry: '',
  items: [createEmptyPriceItem()],
});

/**
 * Restituisce l'array di listini di default per un nuovo evento:
 * un singolo listino vuoto, così la tab "Listini prezzi" non è mai completamente vuota.
 */
export const getDefaultPriceLists = (): PriceList[] => [createEmptyPriceList()];

/**
 * Estrae dal formData i campi che compongono un oggetto lingua da inviare al backend.
 * L'API si aspetta un array languages; questa funzione costruisce il singolo elemento
 * che verrà poi wrappato in [buildLanguageObject(formData)].
 */
export const buildLanguageObject = (formData: EventFormData) => ({
  title: formData.title,
  location: formData.location,
  description: formData.description,
  emoji: formData.emoji,
});

/**
 * Normalizza lo slug rimuovendo il dominio dell'app se presente.
 * Caso d'uso: l'admin copia l'URL completo dal browser (es. "https://app.example.com/evento-xyz")
 * e lo incolla nel campo slug. La funzione estrae solo la parte di percorso ("evento-xyz"),
 * eliminando anche eventuali slash iniziali.
 * Se VITE_APP_DOMAIN non è configurato, rimuove comunque gli slash iniziali.
 */
const stripDomainFromSlug = (slug: string): string => {
  const rawSlug = String(slug ?? '').trim();
  const appDomain = String(import.meta.env.VITE_APP_DOMAIN ?? '').trim().replace(/\/+$/, '');

  if (!appDomain) return rawSlug.replace(/^\/+/, '');
  if (!rawSlug.startsWith(appDomain)) return rawSlug.replace(/^\/+/, '');

  return rawSlug.slice(appDomain.length).replace(/^\/+/, '');
};

/**
 * Prepara il payload per il salvataggio delle sole info evento (tab "Info evento").
 * Normalizza lo slug e ricostruisce l'array languages dal formData piatto.
 * Non include i listini prezzi, che vengono salvati separatamente.
 */
export const prepareEventInfoData = (formData: EventFormData) => ({
  ...formData,
  slug: stripDomainFromSlug(formData.slug),
  languages: [buildLanguageObject(formData)],
  verifiedAttendanceEvent: formData.verifiedAttendanceEvent,
});

/**
 * Prepara il payload completo per il salvataggio di evento + listini insieme.
 * Attualmente non utilizzato dal flusso principale (che salva info e listini
 * in due step separati), ma mantenuto per possibili usi futuri o batch save.
 */
export const prepareSubmitData = (formData: EventFormData, priceLists: PriceList[]) => ({
  ...formData,
  slug: stripDomainFromSlug(formData.slug),
  languages: [buildLanguageObject(formData)],
  lists: priceLists,
  verifiedAttendanceEvent: formData.verifiedAttendanceEvent,
});

/**
 * Valida i listini prezzi prima del salvataggio e restituisce un array di messaggi
 * di errore (uno per ogni problema trovato). Se l'array è vuoto, i listini sono validi.
 *
 * Regole verificate per ogni listino:
 * - dateStart obbligatorio
 * - dateExpiry obbligatorio
 * Per ogni pacchetto nel listino:
 * - labelId obbligatorio (deve essere selezionata una label)
 */
export const validatePriceLists = (priceLists: PriceList[]): string[] => {
  const errors: string[] = [];

  priceLists.forEach((list, listIndex) => {
    const listNum = listIndex + 1;
    if (!list.dateStart) {
      errors.push(`Listino #${listNum}: data di inizio mancante`);
    }
    if (!list.dateExpiry) {
      errors.push(`Listino #${listNum}: data di fine mancante`);
    }
    list.items.forEach((item, itemIndex) => {
      if (!item.labelId) {
        errors.push(`Listino #${listNum}, pacchetto #${itemIndex + 1}: label non selezionata`);
      }
    });
  });

  return errors;
};
