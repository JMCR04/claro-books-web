import { useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type { SaveBookRequest } from "../models/book";
import { bookService } from "../services/bookService";
import BookForm from "../components/BookForm";
import { useApi } from "../../shared/hooks/useApi";
import RequestState from "../../shared/components/RequestState";

export default function BookFormPage() {
  const { id } = useParams();
  const editing = id !== undefined;
  const navigate = useNavigate();

  const load = useCallback(
    async (signal?: AbortSignal): Promise<SaveBookRequest> => {
      if (id !== undefined) {
        const bookId = Number(id);

        if (
          !Number.isInteger(bookId) ||
          bookId < 1 ||
          bookId > 2147483647
        ) {
          throw new Error("El ID del libro no es válido.");
        }

        const book = await bookService.getById(bookId, signal);

        return {
          ...book,
          title: book.title ?? "",
          description: book.description ?? "",
        };
      }

      const books = await bookService.getAll(signal);

      const nextId =
        books.reduce(
          (maximum, book) => Math.max(maximum, book.id),
          0,
        ) + 1;

      if (nextId > 2147483647) {
        throw new Error(
          "No se pudo generar un ID válido para el nuevo libro.",
        );
      }

      return {
        id: nextId,
        title: "",
        description: "",
        pageCount: 1,
        excerpt: null,
        publishDate: new Date().toISOString().slice(0, 10),
      };
    },
    [id],
  );

  const { data, loading, error, retry } = useApi(load);

  async function save(request: SaveBookRequest) {
    const saved = editing
      ? await bookService.update(request.id, request)
      : await bookService.create(request);

    navigate("/books", {
      state: {
        successMessage: editing
          ? "Libro actualizado correctamente."
          : "Libro creado correctamente.",
        bookId: saved.id,
      },
    });
  }

  return (
    <>
      <Link className="back-link" to="/books">
        <i className="bi bi-arrow-left me-2" aria-hidden="true" />
        Volver a libros
      </Link>

      <div className="page-heading">
        <span className="eyebrow">GESTIÓN DEL CATÁLOGO</span>
        <h1>{editing ? "Editar libro" : "Agregar un libro"}</h1>
        <p className="text-secondary mb-0">
          Completa los datos del libro. El extracto es opcional.
        </p>
      </div>

      <RequestState
        loading={loading}
        error={error}
        onRetry={retry}
      />

      {data && !loading && !error && (
        <BookForm
          key={`${editing}-${data.id}`}
          initialValues={data}
          editing={editing}
          onSave={save}
          onCancel={() => navigate("/books")}
        />
      )}
    </>
  );
}