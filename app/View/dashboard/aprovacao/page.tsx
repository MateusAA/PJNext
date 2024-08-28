import Pagination from '@/app/ui/invoices/pagination';
import Search from '@/app/ui/search';
import CustomersTableAg from '@/app/ui/aprovacao/tableAg';
import CustomersTableRep from '@/app/ui/aprovacao/tableRep';
import { CreateCustomers } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/font';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredCustomersAprov } from '@/app/lib/aprovacao/data';
import { Metadata } from 'next';

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

    const customers = await fetchFilteredCustomersAprov(query);

    return (
        <div className="w-full">
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Aprovação de Clientes
            </h1>

            {<Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <div className='flex'>
                    <div className='w-1/2 p-5'>
                        <CustomersTableAg customers={customers} />
                    </div>
                    <div className='w-1/2 p-5'>
                        <CustomersTableRep customers={customers} />
                    </div>
                </div>
            </Suspense>}
        </div>
    );
}