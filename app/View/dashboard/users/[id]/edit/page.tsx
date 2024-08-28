import Form from '@/app/ui/users/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchUsersById } from '@/app/lib/users/data';
import { fetchGroup } from '@/app/lib/users_group/data';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [user, groups] = await Promise.all([
        fetchUsersById(id),
        fetchGroup(),
    ]);

    if (!user) {
        notFound();
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Usuarios', href: '/dashboard/users' },
                    {
                        label: 'Editar Usuario',
                        href: `/dashboard/users/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form user={user} groups={groups} />
        </main>
    );
}