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

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

const FormSchema = z.object({
    id: z.string(),
    customerId: z.string({
        invalid_type_error: 'Please select a customer.',
    }),
    amount: z.coerce.number().gt(
        0, { message: 'Please enter an amount greater than $0.' }
    ),
    status: z.enum(['pending', 'paid'], { invalid_type_error: 'Please select an invoice status.', }),
    date: z.string(),
});

// Use Zod to update the expected types
const UpdateInvoice = FormSchema.omit({ id: true, date: true });
const CreateInvoice = FormSchema.omit({ id: true, date: true });



export type State = {
    errors?: {
        customerId?: string[];
        amount?: string[];
        status?: string[];
    };
    message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
    const validatedFields = CreateInvoice.safeParse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create Invoice.',
        };
    }

    const { customerId, amount, status } = validatedFields.data;
    const amountInCents = amount * 100;
    const date = new Date().toISOString().split('T')[0];

    try {
        await sql`
    INSERT INTO invoices (customer_id, amount, status, date)
    VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
  `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.'
        };
    }


    revalidatePath('/View/dashboard/invoices');
    redirect('/View/dashboard/invoices');
}

export async function updateInvoice(id: string, formData: FormData) {
    const { customerId, amount, status } = UpdateInvoice.parse({
        customerId: formData.get('customerId'),
        amount: formData.get('amount'),
        status: formData.get('status'),
    });

    const amountInCents = amount * 100;
    try {
        await sql`
    UPDATE invoices
    SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
    WHERE id = ${id}
  `;
    } catch (error) {
        return {
            message: 'Database Error: Failed to Update Invoice.'
        };
    }

    revalidatePath('/View/dashboard/invoices');
    redirect('/View/dashboard/invoices');
}

export async function deleteInvoice(id: string) {

    try {
        await sql`DELETE FROM invoices WHERE id = ${id}`;
        revalidatePath('/View/dashboard/invoices');
        return { message: 'Deleted Invoice.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Invoice.'
        };
    }
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

export async function createUserGroups(formDataGroup: FormData) {
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

export async function updateUserGroup(formData: FormData) {
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

// Validando formato dos campos
const CreateCustomer = z.object({
    cpf: z.string(),
    cnpj: z.string(),
    nome: z.string(),
    razao_social: z.string(),
    nome_fantasia: z.string(),
    rg: z.string(),
    ie: z.string(),
    image: z.string(),
});

export type formDataCustomer = {
    errors?: {
        cpf?: string[];
        cnpj?: string[];
        razao_social?: string[];
        nome_fantasia?: string[];
        rg?: string[];
        ie?: string[];
        image?: File[];
    };
    message?: string | null;
};

const CreateAndress = z.object({
    id: z.number(),
    rua: z.string(),
    numero: z.string(),
    cep: z.string(),
    bairro: z.string(),
    cidade: z.string(),
    uf: z.string(),
});

const CreateContact = z.object({
    id: z.number(),
    id_resposavel: z.number(),
    tel_cel: z.string(),
    email: z.string(),
});
export async function createCustomer(formDataCustomer: FormData, formDataAndress: FormData, formDataContact: FormData) {
    // Extraindo os dados do FormData e garantindo que são strings
    const cpf = formDataCustomer.get('cpf') as string | null;
    const cnpj = formDataCustomer.get('cnpj') as string | null;
    const nome = formDataCustomer.get('nome') as string | null;
    const razao_social = formDataCustomer.get('razao_social') as string | null;
    const nome_fantasia = formDataCustomer.get('nome_fantasia') as string | null;
    const rg = formDataCustomer.get('rg') as string | null;
    const ie = formDataCustomer.get('ie') as string | null;
    const image = formDataCustomer.get('image')

    // Removendo pontos e traços do CPF e RG, se forem strings
    const sanitizedCPF = cpf ? cpf.replace(/[.-]/g, '') : '';
    const sanitizedRG = rg ? rg.replace(/[.-]/g, '') : '';

    // Se houver uma imagem, salve-a na pasta 'uploads/images'
    let imagePath = null;
    if (image) {
        const imageName = `${Date.now()}-${image}`;
        const imageDir = path.join(process.cwd(), 'public/customers');
        const fullImagePath = path.join(imageDir, imageName);

        // Certifique-se de que o diretório existe
        await fs.mkdir(imageDir, { recursive: true });

        // Ler o arquivo e salvá-lo no diretório
        const buffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(fullImagePath, buffer);

        // Definindo o caminho para salvar no banco
        imagePath = `/customers/${imageName}`;
    }

    // Validando os campos
    const validatedFields = CreateCustomer.safeParse({
        cnpj,
        cpf: sanitizedCPF,
        razao_social,
        nome_fantasia,
        nome,
        ie,
        rg: sanitizedRG,
        image: imagePath,
    });

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: 'Missing Fields. Failed to Create User.',
        };
    }


    const {
        cnpj: validatedCNPJ,
        cpf: validatedCPF,
        nome: validatedName,
        razao_social: validatedRazao,
        nome_fantasia: validatedFantasia,
        ie: validatedIE,
        rg: validatedRG,
        image: validatedImage
    } = validatedFields.data;

    if (validatedCPF == '' && validatedCNPJ != '') {

        try {
            await sql`
            INSERT INTO customers (cnpj, razao_social, nome_fantasia, ie, image_url)
            VALUES ( ${validatedCNPJ}, ${validatedRazao}, ${validatedFantasia}, ${validatedIE}, ${validatedImage})
        `;

        

        } catch (error) {

            return {
                message: 'Database Error: Failed to Create Customer.'
            };

        }

    } else {

        try {

            await sql`
            INSERT INTO customers (name, cpf, rg, image_url)
            VALUES (${validatedName}, ${validatedCPF}, ${validatedRG}, ${validatedImage})`
       
        } catch (error) {

            return {
                message: 'Database Error: Failed to Create Customer.'
            };

        }
    }

    revalidatePath('/View/dashboard/customers');
    redirect('/View/dashboard/customers');
}