import Form from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchUsers } from '@/app/lib/data';

export default async function Page() {
    const users = await fetchUsers();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Invoices', href: 'View/dashboard/users' },
                    {
                        label: 'Create User',
                        href: 'View/dashboard/users/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}