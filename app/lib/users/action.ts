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
const CreateUsers = z.object({
    name: z.string().nonempty({ message: 'Nome é obrigatório.' }),
    email: z.string().email({ message: 'Email inválido.' }),
    id_grupo: z.string().nonempty({ message: 'Informe um grupo.' }),
    password: z.string().min(6, { message: 'Senha deve ter pelo menos 6 caracteres.' }),
});

const UpdateUsers = z.object({
    id: z.string(),
    name: z.string().nonempty({ message: 'Nome é obrigatório.' }),
    email: z.string().email({ message: 'Email inválido.' }),
    id_grupo: z.string().nonempty({ message: 'Informe um grupo.' }),
    password: z.string(),
});
export type formData = {
    errors?: {
        name?: string[];
        email?: string[];
        password?: string[];
        grupo?: string[];
    };
    message?: string | null;
};

export async function createUser(formData: FormData) {
    // Extraindo os dados do FormData
    const name = formData.get('name');
    const email = formData.get('email');
    const id_grupo = formData.get('grupo');
    const password = formData.get('password');

    // Log dos dados recebidos para depuração
    console.log('Dados recebidos:', { name, email, id_grupo, password });

    // Validando os campos
    const validatedFields = CreateUsers.safeParse({
        name,
        email,
        id_grupo,
        password,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }


    const { name: validatedName, email: validatedEmail, password: validatedPassword, id_grupo: validatedGroup } = validatedFields.data;

    // Gerando um salt e hash para a senha
    const saltRounds = 10; // Fator de custo do bcrypt
    const hashedPassword = await bcrypt.hash(validatedPassword, saltRounds);

    // Tentando inserir os dados no banco de dados
    try {
        await sql`
            INSERT INTO users (name, email, password, id_grupo)
            VALUES (${validatedName}, ${validatedEmail}, ${hashedPassword}, ${validatedGroup})
        `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Create User.'
        };
    }

    revalidatePath('/View/dashboard/users');
    redirect('/View/dashboard/users');
}

export async function updateUser(formData: FormData) {
    // Extraindo os dados do FormData
    const id = formData.get('id');
    const name = formData.get('name');
    const email = formData.get('email');
    const id_grupo = formData.get('grupo');
    const password = formData.get('password');


    console.log('Dados recebidos:', { id, name, email, id_grupo, password });

    // Validando os campos
    const validatedUp = UpdateUsers.safeParse({
        id,
        name,
        email,
        id_grupo,
        password,
    });

    if (!validatedUp.success) {
        return {
            errors: validatedUp.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }

    const { id: validatedId, name: validatedName, email: validatedEmail, password: validatedPassword, id_grupo: validatedGroup } = validatedUp.data;

    if (validatedPassword != '') {

        // Gerando um salt e hash para a senha
        const saltRounds = 10; // Fator de custo do bcrypt
        const hashedPassword = await bcrypt.hash(validatedPassword, saltRounds);

        try {
            await sql`
            UPDATE users
            SET name = ${validatedName}, email = ${validatedEmail}, password = ${hashedPassword}, id_grupo = ${validatedGroup}
            WHERE id = ${validatedId}
      `;
        } catch (errors) {
            return {
                message: 'Database Error: Failed to Update Invoice.'
            };
        }
    } else {
        try {
            await sql`
    UPDATE users
    SET name = ${validatedName}, email = ${validatedEmail}, id_grupo = ${validatedGroup}
    WHERE id = ${validatedId}
  `;
        } catch (errors) {
            return {
                message: 'Database Error: Failed to Update Invoice.'
            };
        }
    }

    revalidatePath('/View/dashboard/users');
    redirect('/View/dashboard/users');
}