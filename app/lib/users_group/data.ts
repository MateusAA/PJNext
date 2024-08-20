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
} from '@/app/lib/definitions';
import { formatCurrency } from '@/app/lib/utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchGroup() {
    try {
        const data = await sql<GroupField>`
     SELECT
        user_group.id_group,
        user_group.description
      FROM user_group
      ORDER BY user_group.description
    `;

        const group = data.rows;
        console.log(group);
        return group;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all group.');
    }
}


export async function fetchUsersGroupById(id: string) {

    try {
        const data = await sql<GroupField>`
     SELECT
        user_group.id_group,
        user_group.description
      FROM user_group
      WHERE user_group.id_group = ${id};
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const group = data.rows;

        console.log(group);
        return group[0];

    } catch (error) {

        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');

    }
}

