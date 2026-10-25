const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://windscope-0o47.onrender.com";

class APIError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "APIError";
  }
}

export async function apiFetch<T>(endpoint: string): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));

    throw new APIError(
      response.status,
      body.detail ?? `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}
