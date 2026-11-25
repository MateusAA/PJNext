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
        emailStatus?: string;
    };
}) {
    const query = searchParams?.query || '';
    const currentPage = Number(searchParams?.page) || 1;
    const notificationMessages: Record<string, string> = {
        sent: 'Decisão registrada e e-mail enviado ao cliente.',
        not_configured: 'Decisão registrada, mas o e-mail não foi enviado. Configure RESEND_API_KEY e EMAIL_FROM na Vercel.',
        failed: 'Decisão registrada, mas o provedor não conseguiu enviar o e-mail. Verifique a configuração e os logs.',
        no_email: 'Decisão registrada, mas o cadastro não tem um e-mail para contato.',
        invalid_transition: 'O status deste cliente mudou. Atualize a tela antes de tentar novamente.',
        update_failed: 'Não foi possível atualizar o status do cliente.',
    };
    const notificationMessage = searchParams?.emailStatus
        ? notificationMessages[searchParams.emailStatus]
        : undefined;

    const customers = await fetchFilteredCustomersAprov(query);

    return (
        <div className="w-full">
            <h1 className={`${lusitana.className} mb-8 text-xl md:text-2xl`}>
                Aprovação de Clientes
            </h1>
            {notificationMessage && (
                <p role="status" className={`mb-4 rounded-lg border p-4 text-sm ${searchParams?.emailStatus === 'sent' ? 'border-green-200 bg-green-50 text-green-900' : 'border-amber-200 bg-amber-50 text-amber-900'}`}>
                    {notificationMessage}
                </p>
            )}

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
