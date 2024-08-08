'use client';

import { CustomerField } from '@/app/lib/definitions';
import Link from 'next/link';
import React, { useState } from 'react';
import InputMask from 'react-input-mask';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
    PowerIcon,
    BanknotesIcon,
    CogIcon
} from '@heroicons/react/24/outline';
import { Button } from '@/app/ui/button';
import { createInvoice } from '@/app/lib/actions';
import { useFormState } from 'react-dom';

export default function Form({ customers }: { customers: CustomerField[] }) {
    const initialState = { message: null, errors: {} };
    const [state, dispatch] = useFormState(createInvoice, initialState);

    const [documentType, setDocumentType] = useState('cpf');

    return (
        <form action={dispatch}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">

                {/* Document Type Selection */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label htmlFor="documentType" className="mb-2 block text-sm font-medium">
                            Document Type
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <select
                                id="documentType"
                                name="documentType"
                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                value={documentType}
                                onChange={(e) => setDocumentType(e.target.value)}
                            >
                                <option value="cpf" >CPF</option>
                                <option value="cnpj">CNPJ</option>
                            </select>
                            <CogIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />

                        </div>
                    </div>


                    {/* Conditional Document Input */}
                    <div className="flex-1">
                        {documentType === 'cpf' ? (
                            <div>
                                <label htmlFor="cpf" className="mb-2 block text-sm font-medium">
                                    CPF
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="999.999.999-99"
                                        id="cpf"
                                        name="cpf"
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        placeholder="Enter CPF"

                                    />
                                    <PowerIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="cnpj" className="mb-2 block text-sm font-medium">
                                    CNPJ
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="99.999.999/9999-99"
                                        id="cnpj"
                                        name="cnpj"
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        placeholder="Enter CNPJ"
                                    />
                                    <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    {/* Conditional Document Input */}
                    <div className="flex-1">
                        {documentType === 'cpf' ? (
                            <div>
                                <label htmlFor="cpf" className="mb-2 block text-sm font-medium">
                                    Nome
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask=""
                                        id="Nome"
                                        name="Nome"
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        placeholder="Nome"

                                    />
                                    <PowerIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col md:flex-row gap-4 mb-4">
                                <div className="flex-1">
                                    <label htmlFor="cnpj" className="mb-2 block text-sm font-medium">
                                        Razão Social
                                    </label>
                                    <div className="relative">
                                        <InputMask
                                            mask=""
                                            id="razao_social"
                                            name="razao_social"
                                            className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                            placeholder="Razão Social"
                                        />
                                        <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                    </div>
                                </div>
                                    <div className="flex-1">
                                        <label htmlFor="cnpj" className="mb-2 block text-sm font-medium">
                                            Nome Fantasia
                                        </label>
                                        <div className="relative">
                                            <InputMask
                                                mask=""
                                                id="nome_fantasia"
                                                name="nome_fantasia"
                                                className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                                placeholder="Nome Fantasia"
                                            />
                                            <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                        </div>
                                    </div>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        {documentType === 'cpf' ? (
                            <div>
                                <label htmlFor="cpf" className="mb-2 block text-sm font-medium">
                                    RG
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="99.999.999-9"
                                        id="RG"
                                        name="RG"
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        placeholder="Registro Geral"
                                    />
                                    <PowerIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <label htmlFor="cnpj" className="mb-2 block text-sm font-medium">
                                    Inscrição Estadual
                                </label>
                                <div className="relative">
                                    <InputMask
                                        mask="999.999.999.999"
                                        id="IE"
                                        name="IE"
                                        className="block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                                        placeholder="Inscrição Estadual"

                                    />

                                    <BanknotesIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>


                {/* Invoice Image */}
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1">
                        <label htmlFor="image" className="mb-2 block text-sm font-medium">
                            Upload Image (PNG)
                        </label>
                        <div className="relative mt-2 rounded-md">
                            <input
                                id="image"
                                name="image"
                                type="file"
                                accept=".png"
                                className="block w-full text-sm text-gray-500
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-gray-100 file:text-gray-700
                            hover:file:bg-gray-200"
                            />
                        </div>
                    </div>
                </div>

            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/View/dashboard/customers"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancel
                </Link>
                <Button type="submit">Create Customers</Button>
            </div>
        </form >

    );
}
