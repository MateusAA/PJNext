"use client";

import { ChartBarIcon, TagIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { FormattedChartContact } from '@/app/lib/definitions';

export default function ResultsCardWrapper({ data }: { data: FormattedChartContact[] }) {
  const customerCount = new Set(data.map((item) => item.customer_id)).size;
  const returnTypeCount = new Set(data.map((item) => item.return_type)).size;

  return (
    <>
      <SummaryCard title="Contatos registrados" value={data.length} icon={ChartBarIcon} />
      <SummaryCard title="Clientes contatados" value={customerCount} icon={UserGroupIcon} />
      <SummaryCard title="Tipos de retorno" value={returnTypeCount} icon={TagIcon} />
    </>
  );
}

function SummaryCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: typeof ChartBarIcon;
}) {
  return (
    <section className="rounded-xl bg-gray-50 p-4 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Icon className="h-6 w-6 text-gray-700" aria-hidden="true" />
        <h2 className="text-sm font-medium text-gray-700">{title}</h2>
      </div>
      <p className="rounded-xl bg-white px-4 py-6 text-center text-3xl font-semibold text-gray-900">
        {value}
      </p>
    </section>
  );
}
