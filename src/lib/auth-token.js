
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export const getAuthToken = async () => {
  const result = await auth.api.getToken({
    headers: await headers(),
  });

  return result?.token;
};

export const autoFetch = async (api, options = {}) => {
  const token = await getAuthToken();

  return fetch(api, {
    ...options,
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });
};
