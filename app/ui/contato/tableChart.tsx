'use client';

import Link from 'next/link';
import { FormattedChartContact } from '@/app/lib/definitions';

type CustomerSummary = {
  customer_id: string;
  customer: string;
  responsavel: string;
  total: number;
  latestContact: string;
  returnCounts: Record<string, number>;
};

export default function ChartTable({ query }: { query: FormattedChartContact[] }) {
  const returnTypes = Array.from(new Set(query.map((item) => item.return_type)));
  const customers = new Map<string, CustomerSummary>();

  for (const item of query) {
    const summary = customers.get(item.customer_id) ?? {
      customer_id: item.customer_id,
      customer: item.customer,
      responsavel: item.responsavel,
      total: 0,
      latestContact: item.created_at,
      returnCounts: {},
    };

    summary.total += 1;
    summary.returnCounts[item.return_type] = (summary.returnCounts[item.return_type] ?? 0) + 1;
    if (new Date(item.created_at) > new Date(summary.latestContact)) {
      summary.latestContact = item.created_at;
    }
    customers.set(item.customer_id, summary);
  }

  const rows = Array.from(customers.values()).sort((a, b) => b.total - a.total);

  return (
    <section className="mt-6 flow-root">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">Resumo por cliente</h2>
      <div className="overflow-x-auto rounded-lg bg-gray-50 p-2">
        {rows.length === 0 ? (
          <p className="rounded-md bg-white px-5 py-10 text-center text-sm text-gray-500">
            Ainda não há contatos registrados no banco de dados.
          </p>
        ) : (
          <table className="min-w-full text-sm text-gray-900">
            <thead className="text-left text-gray-600">
              <tr>
                <th className="px-4 py-4 font-medium">Cliente</th>
                <th className="px-4 py-4 font-medium">Responsável</th>
                <th className="px-4 py-4 text-center font-medium">Contatos</th>
                <th className="px-4 py-4 font-medium">Último contato</th>
                {returnTypes.map((returnType) => (
                  <th key={returnType} className="px-4 py-4 text-center font-medium">
                    {returnType}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white">
              {rows.map((row) => (
                <tr key={row.customer_id} className="border-t border-gray-100">
                  <td className="whitespace-nowrap px-4 py-3 font-medium">
                    <Link className="text-blue-700 hover:underline" href={`/View/dashboard/contato/${row.customer_id}/edit`}>
                      {row.customer}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{row.responsavel}</td>
                  <td className="px-4 py-3 text-center">{row.total}</td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {new Date(row.latestContact).toLocaleDateString('pt-BR')}
                  </td>
                  {returnTypes.map((returnType) => (
                    <td key={returnType} className="px-4 py-3 text-center">
                      {row.returnCounts[returnType] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
