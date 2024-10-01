import { sql } from '@vercel/postgres';
import {
    CustomerField,
    CustomersTableType,
    InvoiceForm,
    UsersTable,
    LatestInvoiceRaw,
    User,
    InvoicesTable,
    GroupField,
    UsersForm,
    CustomerFilterCPF,
    CustomerFilterCNPJ,
    CustomersForm,
    FormattedContactCustomersTable,
    FormattedTypeTreatment,
    FormattedtypeReturn,
    FormattedContactCustomersHistory,
    FormattedContactCustomersHistoryContact,
    FormattedChartContact
} from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchCustomersContact() {

    noStore();
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
        await new Promise((resolve) => setTimeout(resolve, 1000));
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
        const data = await sql<FormattedContactCustomersHistory>`
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
            users.name AS name_resp
        FROM
            customers
        LEFT JOIN
            tb_costumer_contact ON customers.id = tb_costumer_contact.customer_id::uuid
        LEFT JOIN
            users ON users.id = tb_costumer_contact.id_responsavel::uuid
        WHERE customers.id = ${id}
        
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const contactCustomers = data.rows;
        return contactCustomers[0];
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchCustomersHistoryContactMessage(id: string) {

    try {
        const data = await sql<FormattedContactCustomersHistoryContact>`
       SELECT
        *
        FROM
            customer_contacts
        WHERE 
            customer_contacts.customer_id_uuid = ${id}
        
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const contactCustomersMessage = data.rows;
        return contactCustomersMessage;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchChartContact() {

    try {
        const data = await sql<FormattedChartContact>`
        SELECT 
            USERS.name AS responsavel,
            tb_treatment_type.description,
            tb_return_type.description AS desc
        FROM CUSTOMER_CONTACTS 
        INNER JOIN CUSTOMERS ON CUSTOMERS.ID = CUSTOMER_CONTACTS.customer_id_uuid
        INNER JOIN TB_COSTUMER_CONTACT ON TB_COSTUMER_CONTACT.customer_id = CUSTOMER_CONTACTS.customer_id_uuid
        INNER JOIN USERS ON USERS.id = TB_COSTUMER_CONTACT.id_responsavel::uuid
        INNER JOIN tb_treatment_type ON tb_treatment_type.treatment_type_id_uuid = CUSTOMER_CONTACTS.treatment_type::integer
        INNER JOIN tb_return_type ON tb_return_type.return_type_id_uuid = CUSTOMER_CONTACTS.return_type::integer
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const contactChart = data.rows;
        return contactChart;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all Chart.');
    }
}

