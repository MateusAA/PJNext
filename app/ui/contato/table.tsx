'use client'
import Image from 'next/image';
import { lusitana } from '@/app/ui/font';
import { HistoryContact } from '@/app/ui/invoices/buttons';
import {
    CustomersTableType,
    FormattedContactCustomersTable,
    FormattedTypeTreatment,
    FormattedtypeReturn
} from '@/app/lib/definitions';
import { useState } from 'react';
import { PencilIcon, CogIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { useFormState } from 'react-dom';
import { createReturn } from '@/app/lib/contato/action';



export default function CustomersTable({
    contact, typeTreatment, typeReturn
}: {
    contact: FormattedContactCustomersTable[],
    typeTreatment: FormattedTypeTreatment[],
    typeReturn: FormattedtypeReturn[]
}) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<FormattedContactCustomersTable | null>(null);

    const openModal = (customer: FormattedContactCustomersTable) => {
        setSelectedCustomer(customer);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedCustomer(null);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Lógica para registrar o retorno do cliente
        console.log('Retorno registrado para:', selectedCustomer?.name || selectedCustomer?.nome_fantasia);
        closeModal();
    };



    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createReturn, initialState);

    return (
        <div className="mt-6 flow-root">
            <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
                        <div className="md:hidden">
                            {contact?.map((contacts) => (
                                <div
                                    key={contacts.id}
                                    className="mb-2 w-full rounded-md bg-white p-4"
                                >
                                    <div className="flex items-center justify-between border-b pb-4">
                                        <div>
                                            <div className="mb-2 flex items-center">
                                                <div className="flex items-center gap-3">
                                                    <Image
                                                        src={contacts.image_url}
                                                        className="rounded-full"
                                                        alt={`${contacts.name}'s profile picture`}
                                                        width={28}
                                                        height={28}
                                                    />
                                                    <p>{contacts.name === null ? contacts.nome_fantasia : contacts.name}</p>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500">
                                                {contacts.email}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {contacts.tel_cel}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                {contacts.contact_count}
                                            </p>
                                        </div>
                                        <button
                                            className="px-4 py-2 text-white bg-blue-600 rounded-md"
                                            onClick={() => openModal(contacts)}
                                        >
                                            Registrar Retorno
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <table className="hidden min-w-full rounded-md text-gray-900 md:table">
                            <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                                <tr>
                                    <th scope="col" className="px-4 py-5 font-medium sm:pl-6">Nome</th>
                                    <th scope="col" className="px-3 py-5 font-medium">Email</th>
                                    <th scope="col" className="px-3 py-5 font-medium">Contato</th>
                                    <th scope="col" className="px-3 py-5 font-medium">Contatos realizados</th>
                                    <th scope="col" className="px-3 py-5 font-medium">Retorno</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white">
                                {contact.map((contacts) => (
                                    <tr key={contacts.id} className="group">
                                        <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm sm:pl-6">
                                            <div className="flex items-center gap-3">
                                                <Image
                                                    src={contacts.image_url}
                                                    className="rounded-full"
                                                    alt={`${contacts.name}'s profile picture`}
                                                    width={28}
                                                    height={28}
                                                />
                                                <p>{contacts.name === null ? contacts.nome_fantasia : contacts.name}</p>
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                            {contacts.email}
                                        </td>
                                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                            {contacts.tel_cel}
                                        </td>
                                        <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                                            {contacts.contact_count}
                                        </td>
                                        <td className="whitespace-nowrap py-3 pl-6 pr-3">
                                            <div className="flex justify gap-3">
                                                <button
                                                    className="px-2 py-2 text-black rounded-md border p-2 hover:bg-yellow-100"
                                                    onClick={() => openModal(contacts)}
                                                >
                                                    <PencilIcon className="w-5" />

                                                </button>
                                                {(contacts.contact_count != '0') && (
                                                <HistoryContact id={ contacts.id}/>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && selectedCustomer && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-semibold mb-4">
                            Registrar Retorno para {selectedCustomer.name || selectedCustomer.nome_fantasia}
                        </h2>
                        <form action={dispatch}>
                            <input type="hidden" value={selectedCustomer.id} id='id_customer' name='id_customer' />
                            <div className="relative mt-2 rounded-md">
                                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                                    Tipo de tratativa
                                </label>
                                <div className="relative">
                                    <select
                                        id="typeTreatment"
                                        name="typeTreatment_id"
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        defaultValue=""
                                        aria-describedby="customer-error"
                                    >
                                        <option value="" >
                                            Selecione um tipo de tratativa
                                        </option>
                                        {typeTreatment.map((trearment) => (
                                            <option key={trearment.treatment_type_id_uuid} value={trearment.treatment_type_id_uuid}>
                                                {trearment.description}
                                            </option>
                                        ))}
                                    </select>
                                    <CogIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/1 text-gray-500" />
                                </div>
                                <div id="customer-error" aria-live="polite" aria-atomic="true">
                                    {state?.errors?.typeTreatment_id &&
                                        state.errors.typeTreatment_id.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                            <div className="relative mt-2 rounded-md">
                                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                                    Tipo de retorno do Cliente
                                </label>
                                <div className="relative">
                                    <select
                                        id="typeReturn"
                                        name="typeReturn_id"
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        defaultValue=""
                                        aria-describedby="customer-error"
                                    >
                                        <option value="" >Selecione um tipo de retorno</option>
                                        {typeReturn.map((ret) => (
                                            <option key={ret.return_type_id_uuid} value={ret.return_type_id_uuid}>
                                                {ret.description}
                                            </option>
                                        ))}
                                    </select>
                                    <UserGroupIcon className="pointer-events-none absolute left-3 top-1/3 h-[18px] w-[18px] -translate-y-1/1 text-gray-500" />
                                </div>
                                <div id="customer-error" aria-live="polite" aria-atomic="true">
                                    {state?.errors?.typeReturn_id &&
                                        state.errors.typeReturn_id.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="feedback" className="block text-sm font-medium text-gray-700">
                                    Descrição do Retorno
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    rows={3}

                                    aria-describedby="customer-error"
                                />
                                <div id="customer-error" aria-live="polite" aria-atomic="true">
                                    {state?.errors?.message &&
                                        state.errors.message.map((error: string) => (
                                            <p className="mt-2 text-sm text-red-500" key={error}>
                                                {error}
                                            </p>
                                        ))}
                                </div>
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-gray-300 rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md"
                                >
                                    Registrar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
