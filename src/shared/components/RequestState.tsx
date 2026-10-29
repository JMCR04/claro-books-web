interface RequestStateProps {
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

export default function RequestState({
  loading,
  error,
  onRetry,
}: RequestStateProps) {
  if (loading) {
    return (
      <div className="text-center py-5" role="status">
        <div
          className="spinner-border text-danger mb-3"
          aria-hidden="true"
        />
        <p className="text-secondary">Cargando información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger" role="alert">
        <p className="mb-3">{error}</p>

        <button
          className="btn btn-outline-danger"
          onClick={onRetry}
        >
          Reintentar
        </button>
      </div>
    );
  }

  return null;
}