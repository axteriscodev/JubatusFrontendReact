export interface Reader {
  id: number;
  label: string;
  stripeReaderId: string;
  active: boolean;
  location: Location;
  event: { id: number; title: string };
}

export interface Location {
  id: number;
  stripeLocationId: string;
  displayName: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  state: string | null | undefined;
  defaultLocation: boolean;
  active: boolean;
}

export interface StripeLocation {
  id: string;
  stripeLocationId: string;
  displayName: string;
  addressLine1: string;
  city: string;
  country: string;
  readers?: unknown[];
  isDefault: boolean;
  event: { id: number; title: string };
}
