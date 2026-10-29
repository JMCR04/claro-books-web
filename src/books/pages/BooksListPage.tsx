import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import type { Book } from "../models/book";
import { bookService } from "../services/bookService";
import { useApi } from "../../shared/hooks/useApi";
import RequestState from "../../shared/components/RequestState";

const PAGE_SIZE = 9;

interface ListNavigationState {
  successMessage?: string;
  bookId?: number;
}

export default function BooksListPage() {
  const location = useLocation();
  const state = location.state as ListNavigationState | null;

  const { data, loading, error, retry } = useApi(bookService.getAll);

  const [search, setSearch] = useState(
    state?.bookId ? String(state.bookId) : "",
  );
  const [page, setPage] = useState(1);
  const [message, setMessage] = useState<string | null>(
    state?.successMessage ?? null,
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const books = data ?? [];
  const query = search.trim().toLocaleLowerCase();

  const filtered = books.filter((book) =>
    `${book.id} ${book.title ?? ""} ${book.description ?? ""}`
      .toLocaleLowerCase()
      .includes(query),
  );

  const pageCount = Math.max(
    1,
    Math.ceil(filtered.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, pageCount);

  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  async function remove(book: Book) {
    if (
      deletingId !== null ||
      !window.confirm(
        `¿Deseas eliminar el libro "${book.title || book.id}"?`,
      )
    ) {
      return;
    }

    setDeletingId(book.id);
    setActionError(null);
    setMessage(null);

    try {
      await bookService.remove(book.id);
      setMessage("Libro eliminado correctamente.");
      retry();
    } catch (cause: unknown) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "No se pudo eliminar el libro.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="page-heading">
        <span className="eyebrow">EXPLORA EL CATÁLOGO</span>
        <h1>Tu próxima lectura empieza aquí.</h1>
        <p className="text-secondary mb-0">
          Consulta los libros y descubre sus autores.
        </p>
      </div>

      {message && (
        <div
          className="alert alert-success d-flex justify-content-between align-items-center"
          role="status"
        >
          <span>{message}</span>
          <button
            className="btn-close ms-3"
            aria-label="Cerrar mensaje"
            onClick={() => setMessage(null)}
          />
        </div>
      )}

      {actionError && (
        <div className="alert alert-danger" role="alert">
          {actionError}
        </div>
      )}

      <RequestState
        loading={loading}
        error={error}
        onRetry={retry}
      />

      {!loading && !error && (
        <>
          <div className="catalog-toolbar">
            <div>
              <h2 className="h4 mb-1">Libros</h2>
              <span className="text-secondary small">
                {filtered.length} de {books.length} libros
              </span>
            </div>

            <div className="d-flex flex-wrap gap-3 align-items-center">
              <div className="search-box">
                <i className="bi bi-search" aria-hidden="true" />
                <input
                  className="form-control"
                  aria-label="Buscar libros"
                  placeholder="Buscar por título, descripción o ID"
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPage(1);
                  }}
                />
              </div>

              <Link
                className="btn btn-primary"
                to="/books/new"
              >
                <i
                  className="bi bi-plus-lg me-2"
                  aria-hidden="true"
                />
                Agregar libro
              </Link>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-search fs-1" aria-hidden="true" />
              <h2 className="h5 mt-3">No encontramos libros</h2>
              <p className="text-secondary">
                Prueba con otra búsqueda o agrega un libro.
              </p>

              {search && (
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="row g-4">
              {visible.map((book) => (
                <div
                  className="col-md-6 col-xl-4"
                  key={book.id}
                >
                  <article className="card book-card h-100">
                    <div
                      className="book-cover"
                      aria-hidden="true"
                    >
                      <i className="bi bi-book" />
                      <span>
                        LIBRO / {String(book.id).padStart(3, "0")}
                      </span>
                    </div>

                    <div className="card-body d-flex flex-column">
                      <span className="book-meta">
                        {book.pageCount} páginas
                      </span>

                      <h3 className="h5 mt-2">
                        {book.title || "Sin título"}
                      </h3>

                      <p className="book-description text-secondary">
                        {book.description ||
                          "Sin descripción disponible."}
                      </p>

                      <div className="d-flex flex-wrap gap-2 mt-auto">
                        <Link
                          className="btn btn-outline-primary"
                          to={`/books/${book.id}`}
                        >
                          Ver detalles
                        </Link>

                        <Link
                          className="btn btn-outline-secondary"
                          to={`/books/${book.id}/edit`}
                          aria-label={`Editar libro ${book.id}`}
                          title="Editar"
                        >
                          <i
                            className="bi bi-pencil"
                            aria-hidden="true"
                          />
                        </Link>

                        <button
                          className="btn btn-outline-danger"
                          disabled={deletingId !== null}
                          onClick={() => void remove(book)}
                          aria-label={`Eliminar libro ${book.id}`}
                          title="Eliminar"
                        >
                          {deletingId === book.id ? (
                            <span
                              className="spinner-border spinner-border-sm"
                              aria-hidden="true"
                            />
                          ) : (
                            <i
                              className="bi bi-trash"
                              aria-hidden="true"
                            />
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          )}

          {filtered.length > 0 && (
            <nav
              className="pagination-bar"
              aria-label="Páginas de libros"
            >
              <button
                className="btn btn-outline-secondary"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
              >
                Anterior
              </button>

              <span className="small">
                Página {currentPage} de {pageCount}
              </span>

              <button
                className="btn btn-outline-secondary"
                disabled={currentPage === pageCount}
                onClick={() => setPage(currentPage + 1)}
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </>
  );
}