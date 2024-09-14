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
    FormattedContactCustomersHistory
} from '@/app/lib/definitions';
import { Button } from '@/app/ui/button';
import { lusitana } from '@/app/ui/font';
import { updateInvoice } from '@/app/lib/invoices/action';

export default function ContactHistory({
    contact
}: {
        contact: FormattedContactCustomersHistory,
}) {
    return (
        <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
            <div className="flex p-4">
                {contact.cpf}
                <h3 className="ml-2 text-sm font-medium">coisas</h3>
            </div>
            <p
                className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
            >
                errei
            </p>
        </div>
    );
}

