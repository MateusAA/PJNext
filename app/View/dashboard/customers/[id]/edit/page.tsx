import Form from '@/app/ui/customers/edit-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import { fetchCustomersById } from '@/app/lib/customers/data';
import { fetchUsersByIdVendedor } from '@/app/lib/users/data';

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const customer = await fetchCustomersById(id);
    const usersVender = await fetchUsersByIdVendedor();


    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Cliente', href: '/dashboard/customers' },
                    {
                        label: 'Editar Cliente',
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form customer={customer} usersVender={usersVender} />
        </main>
    );
}

