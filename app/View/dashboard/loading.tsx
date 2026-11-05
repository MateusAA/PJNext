import { InvoicesTableSkeleton } from '@/app/ui/skeletons';

const shimmer =
  'relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent';

export default function Loading() {
  return (
    <div role="status" aria-label="Carregando tela">
      <div className={`${shimmer} mb-8 h-8 w-48 rounded-md bg-gray-100`} />
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className={`${shimmer} h-10 w-full max-w-md rounded-md bg-gray-100`} />
        <div className={`${shimmer} h-10 w-36 rounded-md bg-gray-100`} />
      </div>
      <InvoicesTableSkeleton />
    </div>
  );
}
