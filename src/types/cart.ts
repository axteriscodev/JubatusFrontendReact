export interface PriceItem {
  id?: number;
  labelId: number | null;
  bestOffer: boolean;
  quantityPhoto: number | '';
  quantityClip: number | '';
  quantityVideo: number | '';
  price: number | '';
  discount: number | '';
}

export interface PriceList {
  id?: number;
  dateStart: string;
  dateExpiry: string;
  items: PriceItem[];
}

export interface CartProduct {
  keyPreview: string;
  keyOriginal: string;
  keyThumbnail: string;
  keyCover?: string;
  fileTypeId: 1 | 2 | 3; // 1=foto, 2=video, 3=clip
  purchased?: boolean;
}

export interface CartItem {
  keyPreview: string;
  keyOriginal: string;
  keyThumbnail: string;
  keyCover: string;
  fileTypeId: 1 | 2 | 3;
}

export interface PreorderPack {
  id?: number;
  quantityPhoto: number;
  quantityVideo: number;
  quantityClip: number;
  price: number;
  discount?: number | null;
}

export interface CartState {
  id: number;
  userEmail: string;
  fullName: string;
  userId: number;
  eventId: number;
  searchId: number;
  products: CartProduct[];
  items: CartItem[];
  prices: PriceItem[];
  purchased: CartProduct[];
  totalQuantity: number;
  totalPrice: number; // sempre number — usare .toFixed(2) solo alla visualizzazione
  usedPriceItems: PriceItem[];
  selectedPreorder: PreorderPack | null;
  alertPack: boolean;
  hasPhoto: boolean;
  hasVideo: boolean;
  hasClip: boolean;
  allPhotos: boolean;
  allClips: boolean;
  video: boolean;
  previousAllPhotosPurchase: boolean;
}
