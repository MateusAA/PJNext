import Form from '@/app/ui/users/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchGroup } from '@/app/lib/users_group/data';

export default async function Page() {
    const groups = await fetchGroup();

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Usuarios', href: 'View/dashboard/users' },
                    {
                        label: 'Criar Usuario',
                        href: 'View/dashboard/users/create',
                        active: true,
                    },
                ]}
            />
            <Form groups={groups} />
        </main>
    );
}