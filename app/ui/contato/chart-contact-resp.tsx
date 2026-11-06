'use client';

import { FormattedChartContact } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/font';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';
import { BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip } from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const colors = [
  'rgba(37, 99, 235, 0.65)',
  'rgba(16, 185, 129, 0.65)',
  'rgba(245, 158, 11, 0.65)',
  'rgba(139, 92, 246, 0.65)',
  'rgba(239, 68, 68, 0.65)',
  'rgba(20, 184, 166, 0.65)',
];

export default function ContatoChartResp({ chart }: { chart: FormattedChartContact[] }) {
  const responsaveis = Array.from(new Set(chart.map((item) => item.responsavel)));
  const returnTypes = Array.from(new Set(chart.map((item) => item.return_type)));

  const data = {
    labels: responsaveis,
    datasets: returnTypes.map((returnType, index) => ({
      label: returnType,
      data: responsaveis.map((responsavel) =>
        chart.filter((item) => item.responsavel === responsavel && item.return_type === returnType).length,
      ),
      backgroundColor: colors[index % colors.length],
    })),
  };

  return (
    <section className="w-full md:col-span-4">
      <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>Retornos por responsável</h2>
      <div className="rounded-xl bg-gray-50 p-4">
        {chart.length === 0 ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-md bg-white px-6 text-center text-sm text-gray-500">
            Os dados aparecerão aqui quando houver contatos registrados.
          </div>
        ) : (
          <div className="rounded-md bg-white p-4">
            <Bar
              data={data}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'top' } },
                scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
              }}
              height={280}
            />
          </div>
        )}
      </div>
    </section>
  );
}
