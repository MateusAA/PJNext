import Form from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/data';

export default async function Page() {
    const customers = await fetchCustomers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: 'View/dashboard/users' },
                    {
                        label: 'Create Invoice',
                        href: 'View/dashboard/users/create',
                        active: true,
                    },
                ]}
            />
            <Form customers={customers} />
        </main>
    );
}