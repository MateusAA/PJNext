import { Card } from '@/app/ui/dashboard/cards';
import ContatoChart from '@/app/ui/contato/chart-contact-resp';
import ResultsCardWrapper from '@/app/ui/contato/card-contact';
import ContatoChartResp from '@/app/ui/contato/chart-contact';
import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/font';
import { fetchChartContact } from '@/app/lib/contato/data';
import { Suspense } from 'react';
import CardWrapper from '@/app/ui/dashboard/cards';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';

export default async function Page() {

    const chart = await fetchChartContact();
    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Suspense fallback={<CardsSkeleton />}>
                    <ResultsCardWrapper data={chart} />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                {/* { <RevenueChart revenue={revenue}  /> } */}
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <ContatoChart chart={chart} />
                </Suspense>
                <Suspense fallback={<LatestInvoicesSkeleton />}>
                    <ContatoChartResp chart={chart} />
                </Suspense>
            </div>
        </main>
    );
}