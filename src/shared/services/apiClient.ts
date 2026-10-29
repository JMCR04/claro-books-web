interface ApiProblem {
  title?: string;
  detail?: string;
  errors?: Record<string, string[]>;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");

  if (!baseUrl) {
    throw new Error("Falta configurar VITE_API_BASE_URL en el archivo .env.");
  }

  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");

  if (options.body !== undefined && options.body !== null) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(
      `${baseUrl}/${endpoint.replace(/^\/+/, "")}`,
      {
        ...options,
        headers,
      },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "No se pudo conectar con la API. Comprueba que el backend esté ejecutándose.",
    );
  }

  if (!response.ok) {
    const problem = await response.json().catch(() => null) as ApiProblem | null;

    const validationMessages = Object.values(
      problem?.errors ?? {},
    ).flat();

    const message = validationMessages.length > 0
      ? validationMessages.join(" ")
      : problem?.detail
        ?? problem?.title
        ?? `La solicitud falló con el código ${response.status}.`;

    throw new ApiError(message, response.status);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return await response.json() as T;
}