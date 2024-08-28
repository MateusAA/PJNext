import Form from '@/app/ui/user_group/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchUsersGroupById } from '@/app/lib/users_group/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const groups = await fetchUsersGroupById(id);


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Grupo de usuários', href: '/dashboard/users_group' },
                    {
                        label: 'Editar Grupo de usuários',
                        href: `/dashboard/users/${id}/edit`,
                        active: true,
                    },
                ]}
            />
        <Form groups={groups} />
        </main>
    );
}