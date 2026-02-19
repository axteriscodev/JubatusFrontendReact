export interface Reader {
  id: number;
  label: string;
  stripeReaderId: string;
  active: boolean;
  events?: Array<{ id: number; slug: string }>;
}

export interface Location {
  id: number;
  name: string;
}
