type JSONValue =
  | string
  | number
  | boolean
  | null
  | JSONValue[]
  | { [k: string]: JSONValue };
type JSONObject = { [k: string]: JSONValue };

const base = process.env.NEXT_PUBLIC_API_BASE ?? "";

export const api = {
  get<T = unknown>(path: string, init?: RequestInit) {
    return fetch(`${base}${path}`, { credentials: "include", ...init }).then(
      (r) => r.json() as Promise<T>
    );
  },
  post<TRes = unknown>(path: string, data: JSONObject, init?: RequestInit) {
    return fetch(`${base}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
      ...init,
    }).then((r) => r.json() as Promise<TRes>);
  },
};
