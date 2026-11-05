import Pagination from '@/app/ui/invoices/pagination';
import Table from '@/app/ui/user_group/table';
import { CreateUserGroup } from '@/app/ui/invoices/buttons';
import { lusitana } from '@/app/ui/font';
import { InvoicesTableSkeleton } from '@/app/ui/skeletons';
import { Suspense } from 'react';
import { fetchFilteredGroups, fetchGroupsPages } from '@/app/lib/users_group/data';
import { Metadata } from 'next';
import Search from '@/app/ui/search';


export const metadata: Metadata = {
    title: 'Users Groups',
};


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

    const [totalPages, groups] = await Promise.all([
        fetchGroupsPages(query),
        fetchFilteredGroups(query, currentPage),
    ]);

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between">
                <h1 className={`${lusitana.className} text-2xl`}>Grupo de usuários</h1>
            </div>
            <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                <div className="w-full max-w-md">
                    <Search placeholder="Pesquisar grupos..." />
                </div>
                <CreateUserGroup />
            </div>
            {<Suspense key={query + currentPage} fallback={<InvoicesTableSkeleton />}>
                <Table groups={groups} />
            </Suspense>}
            <div className="mt-5 flex w-full justify-center">
                {<Pagination totalPages={totalPages} />}
            </div>
        </div>
    );
}
