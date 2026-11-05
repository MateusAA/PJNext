export default function Loading() {
  return (
    <div
      className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-sm text-gray-600"
      role="status"
      aria-live="polite"
    >
      <span
        className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-700"
        aria-hidden="true"
      />
      <span>Carregando tela...</span>
    </div>
  );
}
