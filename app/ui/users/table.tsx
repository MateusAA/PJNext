import Image from 'next/image';
import { UpdateUsers, DeleteInvoice } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredUsers } from '@/app/lib/data';

export default async function InvoicesTable({
    query,
    currentPage,
}: {
    query: string;
    currentPage: string;
}) {
    const users = await fetchFilteredUsers(query, currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {users?.map((user) => (
                            <div
                                key={user.id}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >
                                
                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">
                                            {(user.name)}
                                        </p>
                                        <p>{(user.email)}</p>
                                        <p>{(user.description)}</p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <UpdateUsers id={user.id} />
                                        <DeleteInvoice id={user.id} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>
                                <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                                    Id
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Name
                                </th>
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Email
                                <th scope="col" className="px-3 py-5 font-medium">
                                    Grupo
                                </th>
                                </th>
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Edit</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {users?.map((user) => (
                                <tr
                                    key={user.id}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {user.id}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {(user.name)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {(user.email)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-3">
                                        {(user.description)}
                                    </td>
                                   
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateUsers id={user.id} />
                                        </div>
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
