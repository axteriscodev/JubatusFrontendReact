const BASE = import.meta.env.VITE_API_URL as string;

export const API = {
  // Auth
  AUTH_SIGNIN: `${BASE}/auth/signin`,
  AUTH_VALIDATE: `${BASE}/auth/validate`,

  // Library (user personal area)
  LIBRARY: `${BASE}/library/fetch`,
  LIBRARY_EVENT: (slug: string) => `${BASE}/library/fetch/${slug}`,

  // Contents / search
  CONTENTS_FETCH: `${BASE}/contents/fetch`,
  CONTENTS_FETCH_HASH: `${BASE}/contents/fetch-hash`,
  CONTENTS_SSE: (searchId: string) => `${BASE}/contents/sse/${searchId}`,
  CONTENTS_TAG: `${BASE}/contents/tag`,

  // Shop
  CONFIRM_EMAIL: `${BASE}/customer/confirm-email`,
  CHECKOUT_SESSION: `${BASE}/shop/create-checkout-session`,
  PURCHASED_CONTENTS: (orderId: number) => `${BASE}/shop/purchased-contents/${orderId}`,

  // Assets
  PRESALE_ASSETS: (eventId: number) => `${BASE}/assets/presale?event_id=${eventId}`,

  // Events (admin)
  EVENTS_FETCH: `${BASE}/events/fetch`,
  EVENTS_CREATE: `${BASE}/events/create`,
  EVENT_BY_ID: (id: number) => `${BASE}/events/event/${id}`,
  EVENT_CURRENCIES: `${BASE}/events/currency`,
  EVENT_LIST_CREATE: `${BASE}/events/event-list/create`,
  EVENT_LIST_BY_ID: (id: number) => `${BASE}/events/event-list/${id}`,

  // Terminal / readers
  TERMINAL_LOCATIONS: `${BASE}/terminal/locations`,
  TERMINAL_READERS: `${BASE}/terminal/readers`,
  TERMINAL_READERS_WITH_EVENTS: `${BASE}/terminal/readers/with-events`,
  TERMINAL_READERS_IMPORT: `${BASE}/terminal/readers/import`,
  TERMINAL_READER: (id: number) => `${BASE}/terminal/readers/${id}`,
  TERMINAL_READER_EVENT: (id: number) => `${BASE}/terminal/readers/${id}/event`,
  TERMINAL_READER_LABEL: (id: number) => `${BASE}/terminal/readers/${id}/label`,
} as const;
