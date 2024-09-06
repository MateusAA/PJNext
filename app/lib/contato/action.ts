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
    typeTreatment: z.string().nonempty({ message: 'Tipo de tratativa é obrigatorio.' }),
    typeReturn: z.string().nonempty({ message: 'Tipo de retorno é obrigatório.' }),
    message: z.string().nonempty({ message: 'Descrição do contato é obrigatorio.' }),
    id_customer: z.string()

});

export type State = {
    errors?: {
        id_customer?: string[];
        typeTreatment?: string[];
        typeReturn?: string[];
        message?: string[];
    };
    message?: string | null;
};

export async function createReturn(prevState: State, formData: FormData) {

    const validatedFields = veryReturn.safeParse({
        typeTreatment: formData.get('typeTreatment'),
        id_customer: formData.get('id_customer'),
        typeReturn: formData.get('typeReturn'),
        message: formData.get('message'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Contact.',
        };
    }

    const { typeTreatment, typeReturn, message, id_customer } = validatedFields.data;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
    INSERT INTO customer_contacts (message, created_at, customer_id_uuid, treatment_type, return_type)
    VALUES (${message}, NOW(), ${id_customer}, ${typeTreatment}, ${typeReturn} )
  `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create Contact.'
        };
    }


    revalidatePath('/View/dashboard/contato');
    redirect('/View/dashboard/contato');
}



