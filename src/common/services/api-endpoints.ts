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
  CONTENTS_REFINE_SEARCH: `${BASE}/contents/refine-search`,
  CONTENTS_SSE_REFINED: (searchId: number) =>
    `${BASE}/contents/sse-refined/${searchId}`,
  CONTENTS_TAG: `${BASE}/contents/tag`,

  // Selfie
  SELFIE_FORMATS: `${BASE}/contents/selfie-formats`,

  // Shop
  CONFIRM_EMAIL: `${BASE}/customer/confirm-email`,
  CHECKOUT_SESSION: `${BASE}/shop/create-checkout-session`,
  CREATE_PREORDER: `${BASE}/shop/create-preorder`,
  PURCHASED_CONTENTS: (orderId: number) =>
    `${BASE}/shop/purchased-contents/${orderId}`,

  // Assets
  PRESALE_ASSETS: (eventId: number) =>
    `${BASE}/assets/presale?event_id=${eventId}`,

  // Orders (admin)
  ORDER_SEARCH_INFO: (orderId: number) =>
    `${BASE}/orders/order/${orderId}/search-info`,
  ORDER_ITEMS: (orderId: number) => `${BASE}/orders/order/${orderId}/items`,
  ORDER_ADMIN_CREATE: `${BASE}/orders/admin/create`,

  // Contents (admin/event list)
  CONTENTS_EVENT_LIST: (eventId: string | number, lang: string) =>
    `${BASE}/contents/event-list/${eventId}/${lang}`,

  // Events (admin)
  EVENTS_FETCH: (params?: {
    dateFrom?: string;
    dateTo?: string;
    eventName?: string;
    sortOrder?: "ASC" | "DESC";
  }) => {
    const url = new URL(`${BASE}/events/fetch`);
    if (params?.dateFrom) url.searchParams.set("dateFrom", params.dateFrom);
    if (params?.dateTo) url.searchParams.set("dateTo", params.dateTo);
    if (params?.eventName) url.searchParams.set("eventName", params.eventName);
    url.searchParams.set("sortOrder", params?.sortOrder ?? "DESC");
    return url.toString();
  },
  EVENTS_CREATE: `${BASE}/events/create`,
  EVENT_BY_ID: (id: number) => `${BASE}/events/event/${id}`,
  EVENT_CURRENCIES: `${BASE}/events/currency`,
  ADMIN_EVENT_ORGANIZATIONS: `${BASE}/events/organizations`,
  EVENT_LIST_CREATE: `${BASE}/events/event-list/create`,
  EVENT_LIST_BY_ID: (id: number) => `${BASE}/events/event-list/${id}`,
  EVENT_LIST_DEFAULT: `${BASE}/events/event-list/default`,
  EVENT_LABEL_LIST_ITEM: `${BASE}/events/label/list-item`,

  // Terminal / readers
  TERMINAL_LOCATIONS: `${BASE}/terminal/locations`,
  TERMINAL_READERS: `${BASE}/terminal/readers`,
  TERMINAL_READERS_WITH_EVENTS: `${BASE}/terminal/readers/with-events`,
  TERMINAL_READERS_IMPORT: `${BASE}/terminal/readers/import`,
  TERMINAL_READER: (id: number) => `${BASE}/terminal/readers/${id}`,
  TERMINAL_READER_EVENT: (id: number) => `${BASE}/terminal/readers/${id}/event`,
  TERMINAL_READER_LABEL: (id: number) => `${BASE}/terminal/readers/${id}/label`,
} as const;
