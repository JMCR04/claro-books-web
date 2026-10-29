import { lazy, Suspense } from "react";
import {
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

const BooksListPage = lazy(
  () => import("./books/pages/BooksListPage"),
);

const BookDetailPage = lazy(
  () => import("./books/pages/BookDetailPage"),
);

const BookFormPage = lazy(
  () => import("./books/pages/BookFormPage"),
);

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="container d-flex align-items-center justify-content-between py-3">
          <Link className="brand" to="/books">
            <span className="brand-icon">
              <i className="bi bi-book-half" aria-hidden="true" />
            </span>
            <span>
              Biblioteca<span className="brand-dot">.</span>
            </span>
          </Link>

          <nav aria-label="Navegación principal">
            <NavLink className="nav-item-link" to="/books">
              Libros
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="container app-content">
        <Suspense
          fallback={
            <p className="text-center py-5" role="status">
              Cargando página...
            </p>
          }
        >
          <Routes>
            <Route
              path="/"
              element={<Navigate to="/books" replace />}
            />

            <Route
              path="/books"
              element={<BooksListPage />}
            />

            <Route
              path="/books/new"
              element={<BookFormPage key="new" />}
            />

            <Route
              path="/books/:id/edit"
              element={<BookFormPage key="edit" />}
            />

            <Route
              path="/books/:id"
              element={<BookDetailPage />}
            />

            <Route
              path="*"
              element={
                <div className="empty-state">
                  <h1 className="h3">Página no encontrada</h1>
                  <Link
                    className="btn btn-primary mt-3"
                    to="/books"
                  >
                    Ir al catálogo
                  </Link>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </main>

      <footer className="app-footer">
        <div className="container">
          Biblioteca · Catálogo de libros y autores
        </div>
      </footer>
    </>
  );
}