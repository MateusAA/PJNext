"use client";
import Image from 'next/image';
import {
    FormattedChartContactTable
} from '@/app/lib/definitions';
import InvoiceStatus from '@/app/ui/invoices/status';
import Link from 'next/link';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredUsers } from '@/app/lib/data';
import { useState, useEffect } from 'react';

export default function ChartTable({
    query
}: {
    query: FormattedChartContactTable[];
}) {
    // Usar reduce para consolidar os dados
    const consolidatedData = query.reduce((acc, curr) => {
        const key = curr.name || curr.nome_fantasia || 'N/A';
        if (!acc[key]) {
            acc[key] = {
                name: key,
                id: curr.id,
                responsavel: curr.responsavel,
                Positivo: 0,
                Neutro: 0,
                Negativo: 0,
            };
        }
        acc[key][curr.desc] += 1;
        return acc;
    }, {} as Record<string, any>);

    const resultArray = Object.values(consolidatedData);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <table className="min-w-full text-gray-900">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-3 py-5 font-medium">Cliente</th>
                                <th scope="col" className="px-3 py-5 font-medium">Responsável</th>
                                <th scope="col" className="px-3 py-5 font-medium">Positivo</th>
                                <th scope="col" className="px-3 py-5 font-medium">Neutro</th>
                                <th scope="col" className="px-3 py-5 font-medium">Negativo</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {resultArray.map((user, index) => (
                                <tr
                                    key={index}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >

                                    <td className="whitespace-nowrap px-3 py-3"><Link href={`/View/dashboard/contato/${user.id}/edit`}>{user.name} </Link></td>
                                    <td className="whitespace-nowrap px-3 py-3"><Link href={`/View/dashboard/contato/${user.id}/edit`}>{user.responsavel}</Link></td>
                                    <td className="whitespace-nowrap px-3 py-3"><Link href={`/View/dashboard/contato/${user.id}/edit`} title='Ver contatos'>{user.Positivo}</Link></td>
                                    <td className="whitespace-nowrap px-3 py-3"><Link href={`/View/dashboard/contato/${user.id}/edit`} title='Ver contatos'>{user.Neutro}</Link></td>
                                    <td className="whitespace-nowrap px-3 py-3"><Link href={`/View/dashboard/contato/${user.id}/edit`} title='Ver contatos'>{user.Negativo}</Link></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}