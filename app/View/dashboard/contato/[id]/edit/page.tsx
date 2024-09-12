import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomersById } from '@/app/lib/customers/data';
import { fetchUsersByIdVendedor } from '@/app/lib/users/data';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
   

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
          
        </main>
    );
}

