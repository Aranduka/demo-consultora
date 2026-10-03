export async function api<T = any>(url: string, init?: { method?: string; body?: unknown }): Promise<T> {
  const res = await fetch(url, {
    method: init?.method ?? (init?.body ? "POST" : "GET"),
    headers: init?.body ? { "Content-Type": "application/json" } : undefined,
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err: any = new Error(json?.error?.message ?? "Error de red");
    err.fields = json?.error?.fields;
    err.status = res.status;
    throw err;
  }
  return json.data as T;
}
