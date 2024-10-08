import ContactHistory from '@/app/ui/contato/history';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomersHistoryContact, fetchCustomersHistoryContactMessage } from '@/app/lib/contato/data';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const contact = await fetchCustomersHistoryContact(id);
    const contactMessage = await fetchCustomersHistoryContactMessage(id);


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[  
                    { label: 'Contato', href: '/dashboard/contato' },
                    {
                        label: 'Historico de Contato',
                        href: `/dashboard/contato/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <ContactHistory contact={contact} contactMessage={contactMessage}/>
        </main>
    );
}

