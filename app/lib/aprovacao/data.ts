import { sql } from '@vercel/postgres';
import {
    CustomerField,
    CustomersTableType,
    InvoiceForm,
    UsersTable,
    LatestInvoiceRaw,
    User,
    Revenue,
    InvoicesTable,
    GroupField,
    UsersForm,
    CustomerFilterCPF,
    CustomerFilterCNPJ,
    CustomersForm,
    FormattedCustomersTableAp
} from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';




export async function fetchCustomers() {
    try {
        const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const customers = data.rows;
        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchFilteredCustomersAprov(query: string) {
    try {
        const data = await sql<FormattedCustomersTableAp>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.razao_social,
		  customers.image_url,
		  customers.status_id
		FROM customers
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const customers = data.rows;
        return customers;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch customer table.');
    }
}

export async function fetchCPForCNPJ(id: string, type: string) {
    try {

        if (type === 'cpf') {

            const data = await sql`
          SELECT
            cpf
          FROM customers
          WHERE cpf = ${id}
        `;
            const customers = data.rows;
            return customers;
        } else {
            const data = await sql`
          SELECT
            cnpj
          FROM customers
          WHERE cnpj = ${id}
        `;
            const customers = data.rows;
            return customers;
        }

    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}

export async function fetchCustomersById(id: string) {

    try {
        const data = await sql<CustomersForm>`
     SELECT tca.customer_id,
            tca.rua,
            tca.numero,
            tca.bairro,
            tca.cidade,
            tca.uf,
            tca.cep,
            cus.id,
            cus.name,
            cus.email,
            cus.cpf,
            cus.cnpj,
            cus.razao_social,
            cus.nome_fantasia,
            cus.ie,
            cus.rg,
            tcc.customer_id,
            tcc.tel_cel,
            tcc.id_responsavel,
            us.name AS nameRes
            FROM customers cus
            INNER JOIN tb_costumer_andress tca ON cus.id::UUID = tca.customer_id::UUID
            INNER JOIN tb_costumer_contact tcc ON cus.id::UUID = tcc.customer_id::UUID
            INNER JOIN users us ON us.id::UUID = tcc.id_responsavel::UUID
            WHERE cus.id = ${id}
 
    `;
        await new Promise((resolve) => setTimeout(resolve, 10));
        const customer = data.rows;

        console.log(customer);
        return customer[0];

    } catch (error) {

        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');

    }
}