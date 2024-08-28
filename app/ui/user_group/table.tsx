import Image from 'next/image';
import { UpdateUsersGroup, DeleteGroupUsers } from '@/app/ui/invoices/buttons';
import InvoiceStatus from '@/app/ui/invoices/status';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchGroup } from '@/app/lib/data';

export default async function UsersGroupTable() {
    const groups = await fetchGroup();

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div className="md:hidden">
                        {groups?.map((group) => (
                            <div
                                key={group.id_group}
                                className="mb-2 w-full rounded-md bg-white p-4"
                            >

                                <div className="flex w-full items-center justify-between pt-4">
                                    <div>
                                        <p className="text-xl font-medium">
                                            {(group.description)}
                                        </p>
                                        
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        <UpdateUsersGroup id={group.id_group} />
                                        <DeleteGroupUsers id={group.id_group} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <table className="hidden min-w-full text-gray-900 md:table">
                        <thead className="rounded-lg text-left text-sm font-normal">
                            <tr>

                                <th scope="col" className="px-3 py-5 font-medium">
                                    Descrição
                                </th>
                              
                                <th scope="col" className="relative py-3 pl-6 pr-3">
                                    <span className="sr-only">Editar</span>
                                    <span className="sr-only">Delete</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white">
                            {groups?.map((group) => (
                                <tr
                                    key={group.description}
                                    className="w-full border-b py-3 text-sm last-of-type:border-none [&:first-child>td:first-child]:rounded-tl-lg [&:first-child>td:last-child]:rounded-tr-lg [&:last-child>td:first-child]:rounded-bl-lg [&:last-child>td:last-child]:rounded-br-lg"
                                >
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        {(group.description)}
                                    </td>
                                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                        <div className="flex justify-end gap-3">
                                            <UpdateUsersGroup id={group.id_group} />
                                            <DeleteGroupUsers id={group.id_group}/>
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
