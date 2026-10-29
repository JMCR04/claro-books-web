import { useState } from "react";
import type { FormEvent } from "react";
import type { SaveBookRequest } from "../models/book";

interface BookFormProps {
  initialValues: SaveBookRequest;
  editing: boolean;
  onSave: (request: SaveBookRequest) => Promise<void>;
  onCancel: () => void;
}

export default function BookForm({
  initialValues,
  editing,
  onSave,
  onCancel,
}: BookFormProps) {
  const [values, setValues] = useState(initialValues);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof SaveBookRequest>(
    field: K,
    value: SaveBookRequest[K],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (saving) return;

    setError(null);

    if (!values.title.trim() || !values.description.trim()) {
      setError("El título y la descripción son obligatorios.");
      return;
    }

    if (
      !Number.isInteger(values.id) ||
      values.id < 1 ||
      values.id > 2147483647 ||
      !Number.isInteger(values.pageCount) ||
      values.pageCount < 1 ||
      values.pageCount > 2147483647
    ) {
      setError(
        "El ID y las páginas deben ser números enteros positivos válidos.",
      );
      return;
    }

    const date = values.publishDate.slice(0, 10);

    if (!date || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
      setError("Selecciona una fecha de publicación válida.");
      return;
    }

    setSaving(true);

    try {
      await onSave({
        ...values,
        title: values.title.trim(),
        description: values.description.trim(),
        excerpt: values.excerpt?.trim() || null,
        publishDate: `${date}T00:00:00Z`,
      });
    } catch (cause: unknown) {
      setError(
        cause instanceof Error
          ? cause.message
          : "No se pudo guardar el libro.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      className="content-panel mx-auto"
      style={{ maxWidth: 820 }}
      onSubmit={handleSubmit}
      aria-busy={saving}
    >
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <fieldset disabled={saving}>
        <div className="row g-4">
          <div className="col-md-4">
            <label className="form-label" htmlFor="book-id">
              ID del libro
            </label>
            <input
              id="book-id"
              className="form-control"
              type="number"
              min="1"
              max="2147483647"
              step="1"
              required
              readOnly={editing}
              value={values.id || ""}
              onChange={(e) => update("id", Number(e.target.value))}
            />
            <div className="form-text">
              Identificador único del libro.
            </div>
          </div>

          <div className="col-md-8">
            <label className="form-label" htmlFor="book-title">
              Título
            </label>
            <input
              id="book-title"
              className="form-control"
              required
              maxLength={200}
              value={values.title}
              onChange={(e) => update("title", e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="book-description">
              Descripción
            </label>
            <textarea
              id="book-description"
              className="form-control"
              rows={4}
              required
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="book-pages">
              Cantidad de páginas
            </label>
            <input
              id="book-pages"
              className="form-control"
              type="number"
              min="1"
              max="2147483647"
              step="1"
              required
              value={values.pageCount || ""}
              onChange={(e) =>
                update("pageCount", Number(e.target.value))
              }
            />
          </div>

          <div className="col-md-6">
            <label className="form-label" htmlFor="book-date">
              Fecha de publicación
            </label>
            <input
              id="book-date"
              className="form-control"
              type="date"
              required
              value={values.publishDate.slice(0, 10)}
              onChange={(e) => update("publishDate", e.target.value)}
            />
          </div>

          <div className="col-12">
            <label className="form-label" htmlFor="book-excerpt">
              Extracto (opcional)
            </label>
            <textarea
              id="book-excerpt"
              className="form-control"
              rows={5}
              value={values.excerpt ?? ""}
              onChange={(e) => update("excerpt", e.target.value)}
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top">
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={onCancel}
          >
            Cancelar
          </button>

          <button className="btn btn-primary" type="submit">
            {saving
              ? "Guardando..."
              : editing
                ? "Guardar cambios"
                : "Crear libro"}
          </button>
        </div>
      </fieldset>
    </form>
  );
}