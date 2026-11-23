export const API_URL = (
process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

let cachedToken = null;
let cachedTokenExp = 0;

const decodeTokenExp = (token) => {
try {
const payload = JSON.parse(
atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
);
return typeof payload.exp === "number" ? payload.exp * 1000 : 0;
} catch {
return 0;
}
};

export async function getAuthToken({ forceRefresh = false } = {}) {
const now = Date.now();

if (!forceRefresh && cachedToken && now < cachedTokenExp - 30_000) {
return cachedToken;
}

// Retry up to 2 times in case the session cookie isn't ready yet
for (let attempt = 0; attempt < 2; attempt++) {
try {
const res = await fetch("/api/auth/token", {
credentials: "include",
cache: "no-store",
});

if (!res.ok) {
cachedToken = null;
cachedTokenExp = 0;
if (attempt === 0) {
await new Promise((r) => setTimeout(r, 300));
continue;
}
return null;
}

const data = await res.json().catch(() => null);
const token = data?.token || null;

if (!token && attempt === 0) {
await new Promise((r) => setTimeout(r, 300));
continue;
}

cachedToken = token;
cachedTokenExp = token
? decodeTokenExp(token) || now + 5 * 60_000
: 0;

return token;
} catch (error) {
console.error("Failed to get auth token", error);
if (attempt === 0) {
await new Promise((r) => setTimeout(r, 300));
continue;
}
return cachedToken || null;
}
}

return cachedToken || null;
}

export async function authFetch(path, options = {}) {
const doFetch = async (token) => {
const headers = {
...(options.headers || {}),
};

if (options.body && typeof options.body === "string") {
headers["Content-Type"] = headers["Content-Type"] || "application/json";
}

if (token) {
headers.Authorization = `Bearer ${token}`;
}

return fetch(`${API_URL}${path}`, {
...options,
credentials: "include",
headers,
});
};

const token = await getAuthToken();
let res = await doFetch(token);

if (res.status === 401 && token) {
const freshToken = await getAuthToken({ forceRefresh: true });
if (freshToken) {
res = await doFetch(freshToken);
}
}

return res;
}
