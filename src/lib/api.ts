export type Customer = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  emailVerified: boolean;
  authProvider?: string;
  status?: string;
  createdAt?: string;
};

export type ApiError = {
  message: string;
  status: number;
  errors?: unknown[];
};

const TOKEN_KEY = "rnb_customer_token";
const CUSTOMER_KEY = "rnb_customer";

export function getApiBase(): string {
  const base =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
    "https://rnb-backend.vercel.app/api";
  return base;
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export function getCachedCustomer(): Customer | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CUSTOMER_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Customer;
  } catch {
    return null;
  }
}

export function setCachedCustomer(customer: Customer | null) {
  if (typeof window === "undefined") return;
  if (customer) localStorage.setItem(CUSTOMER_KEY, JSON.stringify(customer));
  else localStorage.removeItem(CUSTOMER_KEY);
}

export function clearCustomerSession() {
  setToken(null);
  setCachedCustomer(null);
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = path.startsWith("http")
    ? path
    : `${getApiBase()}${path.startsWith("/") ? "" : "/"}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.auth !== false) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    method: options.method || (options.body ? "POST" : "GET"),
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let payload: {
    success?: boolean;
    data?: T;
    message?: string;
    errors?: unknown[];
  } = {};

  try {
    payload = (await response.json()) as typeof payload;
  } catch {
    payload = {};
  }

  if (response.status === 401) {
    clearCustomerSession();
    onUnauthorized?.();
  }

  if (!response.ok || payload.success === false) {
    const error: ApiError = {
      message: payload.message || "Something went wrong",
      status: response.status,
      errors: payload.errors,
    };
    throw error;
  }

  return (payload.data ?? payload) as T;
}
