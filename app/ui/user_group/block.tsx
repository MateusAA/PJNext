import { useEffect, useState } from 'react';
import { fetchGroup } from '@/app/lib/data';

export default async function UsersGroupBlock({
    query,
    currentPage,
}: {
    query: string;
    currentPage: number;
}) {
    const invoices = await fetchGroup();
    
    return (
        <div>
           
        </div>
    );
}
