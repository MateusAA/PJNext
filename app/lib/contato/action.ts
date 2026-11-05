'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import path from 'path';
import { FormattedContactCustomersHistoryContact } from '@/app/lib/definitions';

export async function fetchCustomerContactHistory(customerId: string) {
    const validatedId = z.string().uuid().safeParse(customerId);
    if (!validatedId.success) {
        throw new Error('Invalid customer id.');
    }

    try {
        const [historyData, responsibleData] = await Promise.all([
            sql<FormattedContactCustomersHistoryContact>`
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
                WHERE customer_contacts.customer_id_uuid = ${validatedId.data}
                ORDER BY customer_contacts.created_at DESC
            `,
            sql`
                SELECT users.name
                FROM tb_costumer_contact
                LEFT JOIN users ON users.id = tb_costumer_contact.id_responsavel
                WHERE tb_costumer_contact.customer_id = ${validatedId.data}
                LIMIT 1
            `,
        ]);

        return {
            contacts: historyData.rows.map((contact) => ({
                ...contact,
                created_at: new Date(String(contact.created_at)).toISOString(),
            })),
            responsible: responsibleData.rows[0]?.name ?? null,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch customer contact history.');
    }
}

const veryReturn = z.object({
    id_customer: z.string(),
    typeTreatment_id: z.string().nonempty({
        message: 'Tipo de tratativa é obrigatorio.'
    }),
typeReturn_id: z.string().nonempty({
        message: 'Tipo de retorno é obrigatorio.',
    }),
    message: z.string().nonempty({ message: 'Descrição do contato é obrigatorio.' })
});

export type State = {
    errors?: {
        id_customer?: string[];
        typeTreatment_id?: string[];
        typeReturn_id?: string[];
        message?: string[];
    };
    message?: string | null;
};

export async function createReturn(prevState: State, formData: FormData) {

    const validatedFields = veryReturn.safeParse({
        typeTreatment_id: formData.get('typeTreatment_id'),
        id_customer: formData.get('id_customer'),
        typeReturn_id: formData.get('typeReturn_id'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Contact.',
        };
    }

    const { typeTreatment_id, typeReturn_id, message, id_customer } = validatedFields.data;

    try {
        await sql`
    INSERT INTO customer_contacts (message, created_at, customer_id_uuid, treatment_type, return_type)
    VALUES (${message}, NOW(), ${id_customer}, ${typeTreatment_id}, ${typeReturn_id} )
  `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Contact.'
        };
    }


    revalidatePath(`/View/dashboard/contato/${id_customer}/edit`);
    revalidatePath('/View/dashboard/contato');
    return { message: 'Retorno registrado com sucesso.' };
}




