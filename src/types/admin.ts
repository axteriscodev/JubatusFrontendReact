export interface Reader {
  id: number;
  label: string;
  stripeReaderId: string;
  active: boolean;
  event: { id: number; title: string };
}

export interface Location {
  id: number;
  name: string;
}
