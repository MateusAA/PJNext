import Form from '@/app/ui/customers/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomers } from '@/app/lib/customers/data';
import { fetchUsersByIdVendedor } from '@/app/lib/users/data';

export default async function Page() {
    const customers = await fetchCustomers();
    const usersVender = await fetchUsersByIdVendedor();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Customers', href: 'View/dashboard/customers' },
                    {
                        label: 'Create Customers',
                        href: 'View/dashboard/customers/create',
                        active: true,
                    },
                ]}
            />
            <Form  usersVender={usersVender} />
        </main>
    );
}

