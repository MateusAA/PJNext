import { sql } from '@vercel/postgres';
import {
    FormattedContactCustomersTable,
    FormattedTypeTreatment,
    FormattedtypeReturn,
    FormattedContactCustomersHistory,
    FormattedContactCustomersHistoryContact,
    FormattedChartContact
} from '@/app/lib/definitions';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchCustomersContact(query: string) {

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
            customers.status_id = '1' AND (
            customers.name ILIKE ${`%${query}%`} OR
            customers.email ILIKE ${`%${query}%`}
    )
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
            customer_contacts.message,
            customer_contacts.created_at,
            tb_treatment_type.description AS treatment_description,
            tb_return_type.description AS return_description
        FROM customer_contacts
        INNER JOIN tb_treatment_type
            ON tb_treatment_type.treatment_type_id_uuid = customer_contacts.treatment_type
        INNER JOIN tb_return_type
            ON tb_return_type.return_type_id_uuid = customer_contacts.return_type
        WHERE customer_contacts.customer_id_uuid = ${id}
        ORDER BY customer_contacts.created_at DESC
        
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
    noStore();
    try {
        const data = await sql<FormattedChartContact>`
            SELECT
                customer_contacts.customer_id_uuid AS customer_id,
                COALESCE(customers.name, customers.nome_fantasia, 'Cliente') AS customer,
                COALESCE((
                    SELECT users.name
                    FROM tb_costumer_contact
                    LEFT JOIN users ON users.id = tb_costumer_contact.id_responsavel
                    WHERE tb_costumer_contact.customer_id = customer_contacts.customer_id_uuid
                    LIMIT 1
                ), 'Sem responsável') AS responsavel,
                tb_treatment_type.description AS treatment,
                tb_return_type.description AS return_type,
                customer_contacts.created_at
            FROM customer_contacts
            INNER JOIN customers ON customers.id = customer_contacts.customer_id_uuid
            INNER JOIN tb_treatment_type
                ON tb_treatment_type.treatment_type_id_uuid = customer_contacts.treatment_type
            INNER JOIN tb_return_type
                ON tb_return_type.return_type_id_uuid = customer_contacts.return_type
            ORDER BY customer_contacts.created_at DESC
        `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        return data.rows.map((contact) => ({
            ...contact,
            created_at: new Date(String(contact.created_at)).toISOString(),
        }));
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all Chart.');
    }
}
