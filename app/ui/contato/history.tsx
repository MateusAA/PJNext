'use client';

import { CustomerField, InvoiceForm } from '@/app/lib/definitions';
import {
    CheckIcon,
    ClockIcon,
    CurrencyDollarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
    FormattedContactCustomersHistory,
    FormattedContactCustomersHistoryContact
} from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/font';
import { updateInvoice } from '@/app/lib/invoices/action';
import Image from 'next/image';

export default function ContactHistory({
    contact,
    contactMessage
}: {
    contact: FormattedContactCustomersHistory,
    contactMessage: FormattedContactCustomersHistoryContact[]
}) {
    return (
        <div>
            <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
                <div className="flex p-4">
                    {/* Div para a imagem do contato */}
                    <div className="mr-14">
                        <Image
                            src={contact.image_url}
                            className="rounded-full"
                            width={45}
                            height={45}
                            alt={`${contact.name}'s profile picture`}
                        />
                    </div>

                    {/* Div para o nome do contato */}
                    <div className="mr-14">
                        <h6 className="font-medium">
                            {contact.name === null ? contact.nome_fantasia : contact.name}
                        </h6>
                        <p className='text-sm'>{contact.cpf === null ? contact.cnpj.replace(/(\d{2})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1.$2')
                            .replace(/(\d{3})(\d)/, '$1/$2')
                            .replace(/(\d{2})$/, '-$1')
                            : contact.cpf.replace(/(\d{3})(\d)/, '$1.$2')
                                .replace(/(\d{3})(\d)/, '$1.$2')
                                .replace(/(\d{2})$/, '-$1')}
                        </p>
                        <p className='text-sm'>Responsavel: {contact.name_resp}</p>
                    </div>

                    {/* Div para o telefone e e-mail do contato */}
                    <div className="ml-12">
                        <h6 className="font-medium">{contact.tel_cel.replace(/(\d{1})(\d)/, '($1$2) ').replace(/(\d{5})(\d)/, '$1-$2').replace(/(\d{4})(\d)/, '$1$2')}</h6>
                        <p className='text-sm'>{contact.email}</p>
                    </div>
                </div>
                <br />
                {contactMessage.map((msg, index) => {
                    // Tente criar um objeto Date a partir de msg.created_at
                    const createdAt = new Date(msg.created_at);

                    return (
                        <div
                            key={index}
                            className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-1 text-1xl border border-gray-300 mb-4`}
                        >
                            <div className="flex p-4">
                                {/* Div para a mensagem do contato */}
                                <div className="mr-14">
                                    {msg.message} {/* Substitua "msg.message" pela propriedade correta */}
                                </div>
                                {/* Div para a data e hora de criação */}
                                <div className="ml-auto">
                                    {createdAt instanceof Date && !isNaN(createdAt.getTime())
                                        ? createdAt.toLocaleString() // Exibe data e hora
                                        : 'Data inválida'}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Link
                    href="/View/dashboard/contato"
                    className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
                >
                    Cancelar
                </Link>
            </div>
        </div>
    );
}
