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


export async function getUser(email: string) {
    try {
        const user = await sql`SELECT * FROM users WHERE email=${email}`;
        return user.rows[0] as User;
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export async function fetchFilteredUsers(
    query: string,
    currentPage: string,
) {

    try {
        const users = await sql<UsersTable>`

     SELECT
        users.id,
        users.name,
        users.email,
        user_group.description
      FROM users
      JOIN user_group ON user_group.id_group = users.id_grupo
      ORDER BY users.name DESC
    `;

        await new Promise((resolve) => setTimeout(resolve, 1000));
        return users.rows;

    } catch (error) {

        console.error('Database Error:', error);
        throw new Error('Failed to fetch users.');

    }
}

export async function fetchUsers() {
    try {
        const data = await sql<CustomerField>`
     SELECT
        users.id,
        users.name,
        users.email,
        user_group.description
      FROM users
      JOIN user_group ON user_group.id_group = users.id_grupo
      ORDER BY users.name DESC
    `;

        const user = data.rows;
        return user;
    } catch (err) {
        console.error('Database Error:', err);
        throw new Error('Failed to fetch all customers.');
    }
}


export async function fetchUsersById(id: string) {

    try {
        const data = await sql<UsersForm>`
      SELECT
        users.id,
        users.name,
        users.email,
        users.password,
        user_group.description,
        users.id_grupo
      FROM users
      JOIN user_group ON user_group.id_group = users.id_grupo
      WHERE users.id = ${id};
    `;
        await new Promise((resolve) => setTimeout(resolve, 100));
        const users = data.rows;

        console.log(users);
        return users[0];

    } catch (error) {

        console.error('Database Error:', error);
        throw new Error('Failed to fetch invoice.');

    }
}