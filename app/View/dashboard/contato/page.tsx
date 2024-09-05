import { lusitana } from '@/app/ui/font';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { fetchCustomersContact } from '@/app/lib/contato/data';
import  Table  from '@/app/ui/contato/table';


export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || '';
  const currentPage = Number(searchParams?.page) || 1;

  const contact = await fetchCustomersContact();

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Contatos
      </h1>
      {<Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table contact={contact} />
      </Suspense>}
    </div>
  );
}