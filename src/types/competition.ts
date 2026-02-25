import type { PriceList } from './cart';

export interface CompetitionLanguage {
  title: string;
  location: string;
  description: string;
  emoji: string;
}

export interface CompetitionTag {
  tag: string;
  bibNumber: boolean;
}

export interface Currency {
  currency: string;
  symbol: string;
}

export interface Competition {
  id: number;
  slug: string;
  tagId: number;
  backgroundColor: string;
  primaryColor: string;
  secondaryColor: string;
  logo: string;
  preOrder: boolean;
  dateEvent: string;
  dateExpiry: string;
  dateStart: string;
  datePreorderStart?: string;
  datePreorderExpiry?: string;
  pathS3?: string;
  currencyId: number;
  aspectRatio: string;
  verifiedAttendanceEvent: boolean;
  languages: CompetitionLanguage[];
  tag: CompetitionTag;
  currency: Currency;
  lists?: PriceList[];
}
