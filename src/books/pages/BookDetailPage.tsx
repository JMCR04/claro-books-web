import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { bookService } from "../services/bookService";
import { useApi } from "../../shared/hooks/useApi";
import RequestState from "../../shared/components/RequestState";

export default function BookDetailPage() {
  const { id } = useParams();
  const bookId = Number(id);

  const load = useCallback(
    async (signal?: AbortSignal) => {
      if (
        !Number.isInteger(bookId) ||
        bookId < 1 ||
        bookId > 2147483647
      ) {
        throw new Error("El ID del libro no es válido.");
      }

      const [book, authors] = await Promise.all([
        bookService.getById(bookId, signal),
        bookService.getAuthors(bookId, signal),
      ]);

      return { book, authors };
    },
    [bookId],
  );

  const { data, loading, error, retry } = useApi(load);

  const publishDate = data
    ? new Date(data.book.publishDate)
    : null;

  const formattedDate =
    publishDate && !Number.isNaN(publishDate.getTime())
      ? publishDate.toLocaleDateString("es-DO", {
          dateStyle: "long",
          timeZone: "UTC",
        })
      : "No disponible";

  return (
    <>
      <Link className="back-link" to="/books">
        <i
          className="bi bi-arrow-left me-2"
          aria-hidden="true"
        />
        Volver a libros
      </Link>

      <RequestState
        loading={loading}
        error={error}
        onRetry={retry}
      />

      {data && !loading && !error && (
        <>
          <div className="page-heading">
            <span className="eyebrow">
              DETALLE DEL LIBRO / {data.book.id}
            </span>

            <h1>{data.book.title || "Sin título"}</h1>

            <div className="d-flex flex-wrap gap-3 text-secondary">
              <span>
                <i
                  className="bi bi-file-earmark-text me-2"
                  aria-hidden="true"
                />
                {data.book.pageCount} páginas
              </span>

              <span>
                <i
                  className="bi bi-calendar3 me-2"
                  aria-hidden="true"
                />
                {formattedDate}
              </span>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-8">
              <section className="content-panel mb-4">
                <h2 className="h5">Descripción</h2>

                <p className="reading-text mb-0">
                  {data.book.description ||
                    "Sin descripción disponible."}
                </p>
              </section>

              <section className="content-panel">
                <h2 className="h5">Extracto</h2>

                <p className="reading-text mb-0">
                  {data.book.excerpt ||
                    "Sin extracto disponible."}
                </p>
              </section>
            </div>

            <div className="col-lg-4">
              <section className="content-panel">
                <h2 className="h5 mb-3">
                  Autores relacionados
                </h2>

                {data.authors.length === 0 ? (
                  <p className="text-secondary mb-0">
                    Este libro no tiene autores asociados.
                  </p>
                ) : (
                  <ul className="list-unstyled mb-0">
                    {data.authors.map((author) => (
                      <li
                        className="author-item"
                        key={author.id}
                      >
                        <span
                          className="author-avatar"
                          aria-hidden="true"
                        >
                          <i className="bi bi-person" />
                        </span>

                        <div>
                          <strong>
                            {`${author.firstName ?? ""} ${
                              author.lastName ?? ""
                            }`.trim() || "Sin nombre"}
                          </strong>

                          <small className="d-block text-secondary">
                            Autor #{author.id}
                          </small>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </div>
          </div>
        </>
      )}
    </>
  );
}