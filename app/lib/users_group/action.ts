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

// Validando formato dos campos
const CreateUsersGroups = z.object({
    description: z.string().nonempty({ message: 'Descrição é obrigatório.' }),

});


export type formDataGroup = {
    errors?: {
        description?: string[];
    };
    message?: string | null;
};

const UpdateUsersGroups = z.object({
    id_group: z.string(),
    description: z.string().nonempty({ message: 'Descrição é obrigatório.' }),

});

export async function createUserGroups(prevError: formDataGroup, formDataGroup: FormData) {
    // Extraindo os dados do FormData
    const description = formDataGroup.get('description')


    // Log dos dados recebidos para depuração
    console.log('Dados recebidos:', { description });

    // Validando os campos
    const validatedFields = CreateUsersGroups.safeParse({
        description
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }


    const { description: validatedDescription } = validatedFields.data;


    // Tentando inserir os dados no banco de dados
    try {
        await sql`
            INSERT INTO user_group (description)
            VALUES (${validatedDescription})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create User.'
        };
    }

    revalidatePath('/View/dashboard/users_group');
    redirect('/View/dashboard/users_group');
}

export async function updateUserGroup(prevError: formDataGroup, formData: FormData) {
    // Extraindo os dados do FormData
    const id_group = formData.get('id_group');
    const description = formData.get('description');


    console.log('Dados recebidos:', { id_group, description });

    // Validando os campos
    const validatedUp = UpdateUsersGroups.safeParse({
        id_group,
        description
    });

    if (!validatedUp.success) {
        return {
            errors: validatedUp.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }

    const { id_group: validatedId, description: validatedDescription } = validatedUp.data;


    try {
        await sql`
            UPDATE user_group
            SET  description = ${validatedDescription}
            WHERE id_group = ${validatedId}
      `;
    } catch (errors) {
        return {
            message: 'Database Error: Failed to Update User Group.'
        };
    }


    revalidatePath('/View/dashboard/users_group');
    redirect('/View/dashboard/users_group');
}

export async function deleteGroupUsers(id: string) {

    try {
        await sql`DELETE FROM user_group WHERE id_group = ${id}`;
        revalidatePath('/View/dashboard/users_group');
        return { message: 'Deleted Group.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Group.'
        };
    }
}
