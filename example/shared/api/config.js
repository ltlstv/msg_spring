export const API_BASE_URL =
  import.meta.env.PUBLIC_API_BASE_URL ?? 'http://localhost:8080';

export const WS_URL =
  import.meta.env.PUBLIC_WS_URL ?? `${API_BASE_URL}/websocket`;
