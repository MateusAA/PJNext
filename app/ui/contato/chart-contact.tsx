"use client"; // Para garantir que o componente funcione no lado do cliente
import { FormattedChartContact } from '@/app/lib/definitions';
import { lusitana } from '@/app/ui/font';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';

Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ContatoChartResp({ chart }: { chart: FormattedChartContact[] }) {
    // O array de contatos recebidos
    const contato = chart;

    const results = ['Positivo', 'Neutro', 'Negativo'];
    const responsaveis = Array.from(new Set(contato.map((item) => item.responsavel)));

    const datasets = results.map((result) => ({
        label: result,
        data: responsaveis.map((resp) =>
            contato.filter(
                (item) => item.responsavel === resp && item.desc === result
            ).length
        ),
        backgroundColor:
            result === 'Positivo'
                ? 'rgba(45, 111, 161, 0.5)'
                : result === 'Neutro'
                    ? 'rgba(23, 111, 99, 0.6)'
                    : 'rgba(123, 99, 188, 0.6)',
    }));

    const chartData = {
        labels: responsaveis,
        datasets: datasets,
    };

    return (
        <div className="w-full md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Resultados por Responsável
            </h2>
            <div className="rounded-xl bg-gray-50 p-4">
                <div className="sm:grid-cols-13 mt-0 grid grid-cols-12 items-end gap-2 rounded-md bg-white p-4 md:gap-4">
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            plugins: {
                                legend: {
                                    position: 'top',
                                },
                                title: {
                                    display: true,
                                    text: 'Resultados por Responsável',
                                },
                            },
                        }}
                    />
                </div>
                <div className="flex items-center pb-2 pt-6">
                    <ArrowPathIcon className="h-5 w-5 text-gray-500" />
                    <h3 className="ml-2 text-sm text-gray-500">Atualizado agora há pouco</h3>
                </div>
            </div>
        </div>
    );
}
