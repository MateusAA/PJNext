import Form from '@/app/ui/user_group/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchGroup } from '@/app/lib/data';

export default async function Page() {

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Users', href: 'View/dashboard/users_group' },
                    {
                        label: 'Create User Group',
                        href: 'View/dashboard/users_group/create',
                        active: true,
                    },
                ]}
            />
            <Form />
        </main>
    );
}