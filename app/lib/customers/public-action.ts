'use server';

import { z } from 'zod';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

const leadSchema = z.object({
    documentType: z.enum(['cpf', 'cnpj']),
    name: z.string().trim().max(160).optional(),
    cpf: z.string().optional(),
    rg: z.string().trim().max(30).optional(),
    razao_social: z.string().trim().max(200).optional(),
    nome_fantasia: z.string().trim().max(200).optional(),
    cnpj: z.string().optional(),
    ie: z.string().trim().max(30).optional(),
    email: z.string().trim().email('Informe um e-mail válido.').max(254),
    tel_cel: z.string().trim().min(8, 'Informe um telefone válido.').max(30),
    cep: z.string().trim().min(8, 'Informe o CEP.'),
    rua: z.string().trim().min(1, 'Informe a rua.').max(200),
    numero: z.string().trim().min(1, 'Informe o número.').max(30),
    bairro: z.string().trim().min(1, 'Informe o bairro.').max(120),
    cidade: z.string().trim().min(1, 'Informe a cidade.').max(120),
    uf: z.string().trim().length(2, 'Informe a UF com duas letras.'),
    website: z.string().optional(),
});

function field(formData: FormData, name: string) {
    const value = formData.get(name);
    return typeof value === 'string' ? value : '';
}

export async function submitCustomerLead(formData: FormData) {
    const parsed = leadSchema.safeParse({
        documentType: field(formData, 'documentType'),
        name: field(formData, 'name'),
        cpf: field(formData, 'cpf').replace(/\D/g, ''),
        rg: field(formData, 'rg'),
        razao_social: field(formData, 'razao_social'),
        nome_fantasia: field(formData, 'nome_fantasia'),
        cnpj: field(formData, 'cnpj').replace(/\D/g, ''),
        ie: field(formData, 'ie'),
        email: field(formData, 'email'),
        tel_cel: field(formData, 'tel_cel'),
        cep: field(formData, 'cep').replace(/\D/g, ''),
        rua: field(formData, 'rua'),
        numero: field(formData, 'numero'),
        bairro: field(formData, 'bairro'),
        cidade: field(formData, 'cidade'),
        uf: field(formData, 'uf').toUpperCase(),
        website: field(formData, 'website'),
    });

    if (!parsed.success) {
        return { success: false, message: parsed.error.issues[0]?.message ?? 'Confira os dados informados.' };
    }

    const values = parsed.data;
    if (values.website) return { success: true };

    const isCpf = values.documentType === 'cpf';
    const document = (isCpf ? values.cpf : values.cnpj) ?? '';
    if (document.length !== (isCpf ? 11 : 14)) {
        return { success: false, message: isCpf ? 'Informe um CPF válido.' : 'Informe um CNPJ válido.' };
    }
    if (isCpf && !values.name) return { success: false, message: 'Informe seu nome completo.' };
    if (!isCpf && (!values.razao_social || !values.nome_fantasia)) {
        return { success: false, message: 'Informe a razão social e o nome fantasia.' };
    }

    try {
        if (isCpf) {
            const existing = await sql`SELECT 1 FROM customers WHERE cpf = ${values.cpf} LIMIT 1`;
            if (existing.rowCount) return { success: false, message: 'Já existe um cadastro com este CPF.' };
        } else {
            const existing = await sql`SELECT 1 FROM customers WHERE cnpj = ${values.cnpj} LIMIT 1`;
            if (existing.rowCount) return { success: false, message: 'Já existe um cadastro com este CNPJ.' };
        }

        await sql`
            WITH new_customer AS (
                INSERT INTO customers (name, email, cpf, rg, cnpj, razao_social, nome_fantasia, ie, status_id)
                VALUES (
                    ${isCpf ? values.name : null}, ${values.email}, ${isCpf ? values.cpf : null},
                    ${isCpf ? (values.rg || null) : null}, ${isCpf ? null : values.cnpj},
                    ${isCpf ? null : values.razao_social}, ${isCpf ? null : values.nome_fantasia},
                    ${isCpf ? null : (values.ie || null)}, '3'
                )
                RETURNING id
            ), new_address AS (
                INSERT INTO tb_costumer_andress (customer_id, rua, numero, cidade, uf, cep, bairro)
                SELECT id, ${values.rua}, ${values.numero}, ${values.cidade}, ${values.uf}, ${values.cep}, ${values.bairro}
                FROM new_customer
            ), new_contact AS (
                INSERT INTO tb_costumer_contact (customer_id, id_responsavel, tel_cel, email)
                SELECT id, NULL, ${values.tel_cel.replace(/[^\d+]/g, '')}, ${values.email}
                FROM new_customer
            )
            SELECT id FROM new_customer
        `;

        revalidatePath('/View/dashboard/aprovacao');
        revalidatePath('/View/dashboard/customers');
        return { success: true };
    } catch (error) {
        console.error('Failed to submit public customer form:', error);
        return { success: false, message: 'Não foi possível enviar o cadastro agora. Tente novamente.' };
    }
}
