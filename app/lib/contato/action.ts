'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import bcrypt from 'bcrypt';
import { promises as fs } from 'fs';
import path from 'path';

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
    const date = new Date().toISOString().split('T')[0];

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


    revalidatePath('/View/dashboard/contato');
    redirect('/View/dashboard/contato');
}




