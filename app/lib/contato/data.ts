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
    FormattedContactCustomersTable,
    FormattedTypeTreatment,
    FormattedtypeReturn
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
            COUNT(customer_contacts .customer_id_uuid) AS contact_count
        FROM
            customers
        LEFT JOIN
            tb_costumer_contact ON customers.id = tb_costumer_contact.customer_id
        LEFT JOIN
            customer_contacts ON customers.id = customer_contacts .customer_id_uuid
        WHERE 
            customers.status_id = '1'
        GROUP BY
            customers.name,
            customers.nome_fantasia,
            customers.id,
            customers.image_url,
            tb_costumer_contact.id_responsavel,
            tb_costumer_contact.tel_cel,
            tb_costumer_contact.email

    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const contactCustomers = data.rows;
        return contactCustomers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchTreatmentType() {

    try {
        const data = await sql<FormattedTypeTreatment>`
        SELECT
         *
        FROM
           tb_treatment_type
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const typeTreatment = data.rows;
        return typeTreatment;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchReturnType() {

    try {
        const data = await sql<FormattedtypeReturn>`
        SELECT
         *
        FROM
           tb_return_type
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const typeReturn = data.rows;
        return typeReturn;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}


export async function fetchCustomersHistoryContact(id: string) {

    try {
        const data = await sql<FormattedContactCustomersTable>`
       SELECT
            customers.name,
            customers.cpf,
            customers.nome_fantasia,
            customers.cnpj,
            customers.id,
            customers.image_url,
            tb_costumer_contact.id_responsavel,
            tb_costumer_contact.tel_cel,
            tb_costumer_contact.email,
            customer_contacts.*,
            users.name AS name_resp
        FROM
            customers
        LEFT JOIN
            tb_costumer_contact ON customers.id = tb_costumer_contact.customer_id::uuid
        LEFT JOIN
            customer_contacts ON customers.id = customer_contacts .customer_id_uuid
        LEFT JOIN
            users ON users.id = tb_costumer_contact.id_responsavel::uuid
        WHERE 
            customers.status_id = '1' AND customers.id = ${id}
        
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const contactCustomers = data.rows;
        return contactCustomers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

