import Image from 'next/image';
import {
    FormattedChartContact
} from '@/app/lib/definitions';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredUsers } from '@/app/lib/data';

export default async function ChartTable({
    query
}: {
    query: FormattedChartContact[];
}) {

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {query?.map((user) => (
                            <div
                                key={user.responsavel}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >

                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">
                                            {(user.responsavel)}
                                        </p>
                                        <p>{(user.desc)}</p>
                                        <p>{(user.description)}</p>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>

                                <th scope="col" className="px-3 py-5 font-medium">
                                    Nome
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Email
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Grupo
                                </th>
                                
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {query?.map((user) => (
                                <tr
                                    key={user.responsavel}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >

                                    <td className="whitespace-nowrap px-3 py-3">
                                        {(user.responsavel)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {(user.desc)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {(user.description)}
                                    </td>


                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
