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
import { fetchCPForCNPJ } from './data';



// Validando formato dos campos
const CreateCustomerCPF = z.object({
    cpf: z.string().nonempty({ message: 'CPF é obrigatorio.' }),
    nome: z.string().nonempty({ message: 'Nome é obrigatório.' }),
    rg: z.string().nonempty({ message: 'RG é obrigatorio.' }),
    image: z.string().optional(),
    emailtwo: z.string(),

});
const CreateCustomerCNPJ = z.object({
    cnpj: z.string().nonempty({ message: 'CNPJ é obrigatorio.' }),
    razao_social: z.string().nonempty({ message: 'Razão Social é obrigatorio.' }),
    nome_fantasia: z.string().nonempty({ message: 'Nome Fantasia é obrigatorio.' }),
    ie: z.string().nonempty({ message: 'Inscrição estadual é obrigatorio.' }),
    image: z.string().optional(),
    emailtwo: z.string(),
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
    rua: z.string().nonempty({ message: 'Rua é obrigatorio.' }),
    numero: z.string().nonempty({ message: 'Numero é obrigatorio.' }),
    cep: z.string().nonempty({ message: 'CEP é obrigatorio.' }),
    bairro: z.string().nonempty({ message: 'Bairro é obrigatorio.' }),
    cidade: z.string().nonempty({ message: 'Cidade é obrigatorio.' }),
    uf: z.string().nonempty({ message: 'UF é obrigatorio.' }),
});

const CreateContact = z.object({
    id_responsavel: z.string().nonempty({ message: 'Responsavel pelo contato é obrigatorio.' }),
    tel_cel: z.string().nonempty({ message: 'Telefone  é obrigatorio.' }),
    email: z.string().nonempty({ message: 'Email é obrigatorio.' }),
});



export async function CreateCustomer(formInput: FormData, formDataCustomer: FormData, formDataAndress: FormData, formDataContact: FormData) {
    const input = formInput.get('documentType') as string | null;
    // Extraindo os dados do FormData e garantindo que são strings
    const cpf = formDataCustomer.get('cpf') as string | null;
    const cnpj = formDataCustomer.get('cnpj') as string | null;
    const nome = formDataCustomer.get('nome') as string | null;
    const razao_social = formDataCustomer.get('razao_social') as string | null;
    const nome_fantasia = formDataCustomer.get('nome_fantasia') as string | null;
    const rg = formDataCustomer.get('rg') as string | null;
    const ie = formDataCustomer.get('ie') as string | null;
    const image = formDataCustomer.get('image') as File | null;
    const emailtwo = formDataContact.get('email') as string | null;

    // Removendo pontos e traços do CPF e RG, se forem strings
    const sanitizedCPF = cpf ? cpf.replace(/[.-]/g, '') : '';
    const sanitizedRG = rg ? rg.replace(/[.-]/g, '') : '';

    // Se houver uma imagem, salve-a na pasta 'uploads/images'
    let imagePath = null;
    if (image) {
        const imageName = `${image.name}`; // Nome do arquivo com timestamp para evitar conflitos
        const imageDir = path.join(process.cwd(), 'public/customers');
        const fullImagePath = path.join(imageDir, imageName);

        // Certifique-se de que o diretório existe
        await fs.mkdir(imageDir, { recursive: true });

        // Salvar o arquivo diretamente no diretório
        const buffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(fullImagePath, buffer);

        // Definindo o caminho para salvar no banco
        imagePath = `/customers/${imageName}`;

    }

    let validatedImage = null;
    let validatedCPF: string | null = null;
    let validatedRG: string | null = null;
    let validatedCNPJ = null;
    let validatedRazao: string | null = null;
    let validatedFantasia: string | null = null;
    let validatedIE: string | null = null;
    let validatedName: string | null = null;
    let validatedMail: string | null = null;
    let validatedImageEmp = null;
    let validatedFields = null;
    let insertedId = null;

    //Inicio - validnando campos dados do cliente
    if (input === 'cpf') {
        // Validando os campos CPF
        validatedFields = CreateCustomerCPF.safeParse({
            cpf: sanitizedCPF,
            nome,
            rg: sanitizedRG,
            image: imagePath || '',
            emailtwo,
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }
        ({
            cpf: validatedCPF,
            nome: validatedName,
            rg: validatedRG,
            image: validatedImage,
            emailtwo: validatedMail,
        } = validatedFields.data);

    } else {
        // Validando os campos CNPJ
        validatedFields = CreateCustomerCNPJ.safeParse({
            cnpj,
            razao_social,
            nome_fantasia,
            ie,
            image: imagePath,
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        ({
            cnpj: validatedCNPJ,
            razao_social: validatedRazao,
            nome_fantasia: validatedFantasia,
            ie: validatedIE,
            image: validatedImageEmp
        } = validatedFields.data);

    }





    //Fim - validnando campos dados do cliente

    //Inicio - validnando campos endereço do cliente

    const cep = formDataAndress.get('cep') as string | null;
    const rua = formDataAndress.get('rua') as string | null;
    const numero = formDataAndress.get('numero') as string | null;
    const bairro = formDataAndress.get('bairro') as string | null;
    const cidade = formDataAndress.get('cidade') as string | null;
    const uf = formDataAndress.get('uf') as string | null;

    const sanitizedCEP = cep ? cep.replace(/[.-]/g, '') : '';

    const validatedFieldAndress = CreateAndress.safeParse({
        cep: sanitizedCEP,
        rua,
        numero,
        bairro,
        cidade,
        uf
    });

    if (!validatedFieldAndress.success) {
        return {
            errors: validatedFieldAndress.error.flatten().fieldErrors,
        };
    }
    const {
        cep: validatedCEP,
        rua: validatedRua,
        numero: validatedN,
        bairro: validatedBairro,
        cidade: validatedCidade,
        uf: validatedUF,
    } = validatedFieldAndress.data;
    //Fim - validnando campos endereço do cliente

    //Inicio - validnando campos contato do cliente
    const id_responsavel = formDataContact.get('responsavel') as string | null;
    const tel_cel = formDataContact.get('tel_cel') as string | null;
    const email = formDataContact.get('email') as string | null;

    const sanitizedTEL = tel_cel ? tel_cel.replace(/[() .-]/g, '') : '';

    const validatedFieldContact =   CreateContact.safeParse({
        tel_cel: sanitizedTEL,
        id_responsavel,
        email
    });

    if (!validatedFieldContact.success) {
        return {
            errors: validatedFieldContact.error.flatten().fieldErrors,
        };
    }
    const {
        tel_cel: validatedTel,
        id_responsavel: validatedResponsavel,
        email: validatedEmail,

    } = validatedFieldContact.data;
    //Fim - validnando campos contato do cliente

    if (input === 'cpf') {


        const resul = await fetchCPForCNPJ(validatedCPF, input);



        if (resul.length > 0) {
            return {
                message: 'CPF já cadastrado.',
            };
        } else {
            try {


                // Inserindo com CPF
                const result = await sql`
            INSERT INTO customers (name, email, cpf, rg, image_url)
            VALUES (${validatedName}, ${validatedMail}, ${validatedCPF}, ${validatedRG}, ${validatedImage})
            RETURNING id`;

                insertedId = result.rows[0].id;


            } catch (error) {
                return {
                    message: 'Database Error: Failed to Create Customer.'
                };
            }
        }
    } else {

        const cn = 'cnpj';

        const resul = await fetchCPForCNPJ(validatedCNPJ, cn);



        if (resul.length > 0) {
            return {
                message: 'CNPJ já cadastrado.',
            };
        } else {



            try {

                // Inserindo com CNPJ
                const result = await sql`
            INSERT INTO customers (cnpj, razao_social, nome_fantasia, ie, image_url)
            VALUES (${validatedCNPJ}, ${validatedRazao}, ${validatedFantasia}, ${validatedIE}, ${validatedImageEmp})
            RETURNING id`;

                insertedId = result.rows[0].id;


            } catch (error) {
                return {
                    message: 'Database Error: Failed to Create Customer.'
                };
            }
        }
    }

    insertedId


    try {

        // Inserindo endereço do cliente
        await sql`
            INSERT INTO tb_costumer_andress (customer_id, rua, numero, cidade, uf, cep, bairro)
            VALUES (${insertedId}, ${validatedRua}, ${validatedN}, ${validatedCidade}, ${validatedUF}, ${validatedCEP}, ${validatedBairro} )`;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Insert Andress.'
        };
    }



    try {

        // Inserindo endereço do cliente
        await sql`
            INSERT INTO tb_costumer_contact (customer_id, id_responsavel, tel_cel, email)
            VALUES (${insertedId}, ${validatedResponsavel}, ${validatedTel}, ${validatedEmail})`;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Insert Contact.'
        };
    }


    revalidatePath('/View/dashboard/customers');
    redirect('/View/dashboard/customers');
}

export async function deleteCustomer(id: string) {

    try {
        await sql`DELETE FROM customers WHERE id = ${id}`;
        await sql`DELETE FROM tb_costumer_andress WHERE customer_id = ${id}`;
        await sql`DELETE FROM tb_costumer_contact WHERE customer_id = ${id}`;
        revalidatePath('/View/dashboard/customers');
        return { message: 'Deleted Customer.' };
    } catch (error) {
        return {
            message: 'Database Error: Failed to Delete Group.'
        };
    }
}


export async function UpdateCustomer(formInput: FormData, formDataCustomer: FormData, formDataAndress: FormData, formDataContact: FormData, id: string) {
    const input = formInput.get('documentType') as string | null;
    // Extraindo os dados do FormData e garantindo que são strings
    const cpf = formDataCustomer.get('cpf') as string | null;
    const cnpj = formDataCustomer.get('cnpj') as string | null;
    const nome = formDataCustomer.get('nome') as string | null;
    const razao_social = formDataCustomer.get('razao_social') as string | null;
    const nome_fantasia = formDataCustomer.get('nome_fantasia') as string | null;
    const rg = formDataCustomer.get('rg') as string | null;
    const ie = formDataCustomer.get('ie') as string | null;
    const image = formDataCustomer.get('image') as File | null;
    const emailtwo = formDataContact.get('email') as string | null;

    // Removendo pontos e traços do CPF e RG, se forem strings
    const sanitizedCPF = cpf ? cpf.replace(/[.-]/g, '') : '';
    const sanitizedRG = rg ? rg.replace(/[.-]/g, '') : '';

    // Se houver uma imagem, salve-a na pasta 'uploads/images'
    let imagePath = null;
    if (image) {
        const imageName = `${image.name}`; // Nome do arquivo com timestamp para evitar conflitos
        const imageDir = path.join(process.cwd(), 'public/customers');
        const fullImagePath = path.join(imageDir, imageName);

        // Certifique-se de que o diretório existe
        await fs.mkdir(imageDir, { recursive: true });

        // Salvar o arquivo diretamente no diretório
        const buffer = Buffer.from(await image.arrayBuffer());
        await fs.writeFile(fullImagePath, buffer);

        // Definindo o caminho para salvar no banco
        imagePath = `/customers/${imageName}`;

    }

    let validatedImage = null;
    let validatedCPF: string | null = null;
    let validatedRG: string | null = null;
    let validatedCNPJ = null;
    let validatedRazao: string | null = null;
    let validatedFantasia: string | null = null;
    let validatedIE: string | null = null;
    let validatedName: string | null = null;
    let validatedMail: string | null = null;
    let validatedImageEmp = null;
    let validatedFields = null;
    let insertedId = null;

    //Inicio - validnando campos dados do cliente
    if (input === 'cpf') {
        // Validando os campos CPF
        validatedFields = CreateCustomerCPF.safeParse({
            cpf: sanitizedCPF,
            nome,
            rg: sanitizedRG,
            image: imagePath || '',
            emailtwo,
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }
        ({
            cpf: validatedCPF,
            nome: validatedName,
            rg: validatedRG,
            image: validatedImage,
            emailtwo: validatedMail,
        } = validatedFields.data);

    } else {
        // Validando os campos CNPJ
        validatedFields = CreateCustomerCNPJ.safeParse({
            cnpj,
            razao_social,
            nome_fantasia,
            ie,
            image: imagePath,
        });

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
            };
        }

        ({
            cnpj: validatedCNPJ,
            razao_social: validatedRazao,
            nome_fantasia: validatedFantasia,
            ie: validatedIE,
            image: validatedImageEmp
        } = validatedFields.data);

    }





    //Fim - validnando campos dados do cliente

    //Inicio - validnando campos endereço do cliente

    const cep = formDataAndress.get('cep') as string | null;
    const rua = formDataAndress.get('rua') as string | null;
    const numero = formDataAndress.get('numero') as string | null;
    const bairro = formDataAndress.get('bairro') as string | null;
    const cidade = formDataAndress.get('cidade') as string | null;
    const uf = formDataAndress.get('uf') as string | null;

    const sanitizedCEP = cep ? cep.replace(/[.-]/g, '') : '';

    const validatedFieldAndress = CreateAndress.safeParse({
        cep: sanitizedCEP,
        rua,
        numero,
        bairro,
        cidade,
        uf
    });

    if (!validatedFieldAndress.success) {
        return {
            errors: validatedFieldAndress.error.flatten().fieldErrors,
        };
    }
    const {
        cep: validatedCEP,
        rua: validatedRua,
        numero: validatedN,
        bairro: validatedBairro,
        cidade: validatedCidade,
        uf: validatedUF,
    } = validatedFieldAndress.data;
    //Fim - validnando campos endereço do cliente

    //Inicio - validnando campos contato do cliente
    const id_responsavel = formDataContact.get('responsavel') as string | null;
    const tel_cel = formDataContact.get('tel_cel') as string | null;
    const email = formDataContact.get('email') as string | null;

    const sanitizedTEL = tel_cel ? tel_cel.replace(/[() .-]/g, '') : '';

    const validatedFieldContact = CreateContact.safeParse({
        tel_cel: sanitizedTEL,
        id_responsavel,
        email
    });

    if (!validatedFieldContact.success) {
        return {
            errors: validatedFieldContact.error.flatten().fieldErrors,
        };
    }
    const {
        tel_cel: validatedTel,
        id_responsavel: validatedResponsavel,
        email: validatedEmail,

    } = validatedFieldContact.data;
    //Fim - validnando campos contato do cliente

    if (input === 'cpf') {


        const resul = await fetchCPForCNPJ(validatedCPF, input);



        if (resul.length > 0) {
            return {
                message: 'CPF já cadastrado.',
            };
        } else {
            try {


                // Inserindo com CPF
                const result = await sql`
            INSERT INTO customers (name, email, cpf, rg, image_url)
            VALUES (${validatedName}, ${validatedMail}, ${validatedCPF}, ${validatedRG}, ${validatedImage})
            RETURNING id`;

                insertedId = result.rows[0].id;


            } catch (error) {
                return {
                    message: 'Database Error: Failed to Create Customer.'
                };
            }
        }
    } else {

        const cn = 'cnpj';

        const resul = await fetchCPForCNPJ(validatedCNPJ, cn);



        if (resul.length > 0) {
            return {
                message: 'CNPJ já cadastrado.',
            };
        } else {



            try {

                // Inserindo com CNPJ
                const result = await sql`
            INSERT INTO customers (cnpj, razao_social, nome_fantasia, ie, image_url)
            VALUES (${validatedCNPJ}, ${validatedRazao}, ${validatedFantasia}, ${validatedIE}, ${validatedImageEmp})
            RETURNING id`;

                insertedId = result.rows[0].id;


            } catch (error) {
                return {
                    message: 'Database Error: Failed to Create Customer.'
                };
            }
        }
    }

    insertedId


    try {

        // Inserindo endereço do cliente
        await sql`
            INSERT INTO tb_costumer_andress (customer_id, rua, numero, cidade, uf, cep, bairro)
            VALUES (${insertedId}, ${validatedRua}, ${validatedN}, ${validatedCidade}, ${validatedUF}, ${validatedCEP}, ${validatedBairro} )`;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Insert Andress.'
        };
    }



    try {

        // Inserindo endereço do cliente
        await sql`
            INSERT INTO tb_costumer_contact (customer_id, id_responsavel, tel_cel, email)
            VALUES (${insertedId}, ${validatedResponsavel}, ${validatedTel}, ${validatedEmail})`;

    } catch (error) {
        return {
            message: 'Database Error: Failed to Insert Contact.'
        };
    }


    revalidatePath('/View/dashboard/customers');
    redirect('/View/dashboard/customers');
}