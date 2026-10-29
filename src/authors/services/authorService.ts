import type { Author, SaveAuthorRequest } from "../models/author";
import { apiRequest } from "../../shared/services/apiClient";

export const authorService = {
  getAll(signal?: AbortSignal): Promise<Author[]> {
    return apiRequest<Author[]>("authors", {
      signal: signal ?? null,
    });
  },

  getById(id: number, signal?: AbortSignal): Promise<Author> {
    return apiRequest<Author>(`authors/${id}`, {
      signal: signal ?? null,
    });
  },

  create(request: SaveAuthorRequest): Promise<Author> {
    return apiRequest<Author>("authors", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  update(id: number, request: SaveAuthorRequest): Promise<Author> {
    return apiRequest<Author>(`authors/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    });
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`authors/${id}`, {
      method: "DELETE",
    });
  },
};