import type { Book, SaveBookRequest } from "../models/book";
import type { Author } from "../../authors/models/author";
import { apiRequest } from "../../shared/services/apiClient";

export const bookService = {
  getAll(signal?: AbortSignal): Promise<Book[]> {
    return apiRequest<Book[]>("books", {
      signal: signal ?? null,
    });
  },

  getById(id: number, signal?: AbortSignal): Promise<Book> {
    return apiRequest<Book>(`books/${id}`, {
      signal: signal ?? null,
    });
  },

  getAuthors(id: number, signal?: AbortSignal): Promise<Author[]> {
    return apiRequest<Author[]>(`books/${id}/authors`, {
      signal: signal ?? null,
    });
  },

  create(request: SaveBookRequest): Promise<Book> {
    return apiRequest<Book>("books", {
      method: "POST",
      body: JSON.stringify(request),
    });
  },

  update(id: number, request: SaveBookRequest): Promise<Book> {
    return apiRequest<Book>(`books/${id}`, {
      method: "PUT",
      body: JSON.stringify(request),
    });
  },

  remove(id: number): Promise<void> {
    return apiRequest<void>(`books/${id}`, {
      method: "DELETE",
    });
  },
};