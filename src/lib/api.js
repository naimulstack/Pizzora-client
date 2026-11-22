
export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

export async function getAuthToken() {
  const res = await fetch(`${API_URL}/api/auth/token`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;

  const data = await res.json();
  return data.token || null;
}

export async function authFetch(path, options = {}) {
  const token = await getAuthToken();

  return fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
}
