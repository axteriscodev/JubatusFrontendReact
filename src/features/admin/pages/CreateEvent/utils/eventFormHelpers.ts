import type { Competition } from '@/types/competition';
import type { PriceItem, PriceList } from '@/types/cart';

export interface EventFormData {
  id?: number;
  slug: string;
  pathS3: string;
  emoji: string;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string | File;
  dateEvent: string;
  dateExpiry: string;
  dateStart: string;
  datePreorderStart: string;
  datePreorderExpiry: string;
  title: string;
  location: string;
  description: string;
  tag: string;
  tagId: number;
  currencyId: number;
  verifiedAttendanceEvent: boolean;
}

export const getDefaultFormData = (): EventFormData => ({
  slug: '',
  pathS3: '',
  emoji: '',
  backgroundColor: '#000000',
  primaryColor: '#000000',
  secondaryColor: '#000000',
  logo: '',
  dateEvent: '',
  dateExpiry: '',
  dateStart: '',
  datePreorderStart: '',
  datePreorderExpiry: '',
  title: '',
  location: '',
  description: '',
  tag: '',
  tagId: 0,
  currencyId: 0,
  verifiedAttendanceEvent: false,
});

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
  };
};

export const createEmptyPriceItem = (): PriceItem => ({
  labelId: null,
  bestOffer: false,
  quantityPhoto: '',
  quantityClip: '',
  quantityVideo: '',
  price: '',
  discount: '',
});

export const createEmptyPriceList = (): PriceList => ({
  dateStart: '',
  dateExpiry: '',
  items: [createEmptyPriceItem()],
});

export const getDefaultPriceLists = (): PriceList[] => [createEmptyPriceList()];

export const buildLanguageObject = (formData: EventFormData) => ({
  title: formData.title,
  location: formData.location,
  description: formData.description,
  emoji: formData.emoji,
});

export const prepareEventInfoData = (formData: EventFormData) => ({
  ...formData,
  languages: [buildLanguageObject(formData)],
  verifiedAttendanceEvent: formData.verifiedAttendanceEvent,
});

export const prepareSubmitData = (formData: EventFormData, priceLists: PriceList[]) => ({
  ...formData,
  languages: [buildLanguageObject(formData)],
  lists: priceLists,
  verifiedAttendanceEvent: formData.verifiedAttendanceEvent,
});
