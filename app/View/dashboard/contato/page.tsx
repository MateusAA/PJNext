import { lusitana } from '@/app/ui/font';
import Search from '@/app/ui/search';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { PencilIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { fetchCustomersContact, fetchTreatmentType, fetchReturnType } from '@/app/lib/contato/data';
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

  const contact = await fetchCustomersContact(query);
  const typeTreatment = await fetchTreatmentType();
  const typeReturn = await fetchReturnType();

  return (
    <div className="w-full">
      <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
        Contatos
      </h1>
      <Search placeholder="Pesquisar contatos..." />
      {<Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
        <Table contact={contact} typeTreatment={typeTreatment} typeReturn={typeReturn}/>
      </Suspense>}
    </div>
  );
}