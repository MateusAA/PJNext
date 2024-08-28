import Form from '@/app/ui/aprovacao/form-ap';
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
                    { label: 'Aprovação de Cliente', href: '/dashboard/customers' },
                    {
                        label: 'Aprovar x Reprovar',
                        href: `/dashboard/customers/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <Form customer={customer} usersVender={usersVender} />
        </main>
    );
}

