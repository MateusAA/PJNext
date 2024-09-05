import { sql } from '@vercel/postgres';
import {
    CustomerField,
    CustomersTableType,
    InvoiceForm,
    UsersTable,
    LatestInvoiceRaw,
    User,
    Revenue,
    InvoicesTable,
    GroupField,
    UsersForm,
    CustomerFilterCPF,
    CustomerFilterCNPJ,
    CustomersForm,
    FormattedContactCustomersTable
} from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchCustomersContact() {
    
    try {
        const data = await sql<FormattedContactCustomersTable>`
        SELECT
            customers.name,
            customers.nome_fantasia,
            customers.id,
            customers.image_url,
            tb_costumer_contact.id_responsavel,
            tb_costumer_contact.tel_cel,
            tb_costumer_contact.email,
            customer_contacts.message,
            customer_contacts.created_at,
            customer_contacts.customer_id_uuid
        FROM
            customers
        LEFT JOIN
            customer_contacts ON customers.id = customer_contacts.customer_id_uuid
        LEFT JOIN
            tb_costumer_contact ON customers.id = tb_costumer_contact.customer_id
        WHERE 
            customers.status_id = '1'
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const contactCustomers = data.rows;
        return contactCustomers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}
