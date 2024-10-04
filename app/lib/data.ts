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
} from './definitions';
import { formatCurrency } from './utils';
import { unstable_noStore as noStore } from 'next/cache';

export async function fetchRevenue() {
  // Add noStore() here to prevent the response from being cached.
  // This is equivalent to in fetch(..., {cache: 'no-store'}).


  try {
    // Artificially delay a response for demo purposes.
    // Don't do this in production :)

    console.log('Fetching revenue data...');

    const data = await sql<Revenue>`
    SELECT 
      amount AS revenue, 
      TO_CHAR(date, 'Mon') AS month
    FROM invoices
    JOIN customers ON customers.id = invoices.customer_id
    WHERE status_id = '1';
    `;

    console.log('Data fetch completed after 3 seconds.');
    // Agrupar receitas por mês
    const revenueByMonth: { [key: string]: number } = {};

    data.rows.forEach((entry: { month: string; revenue: number }) => {
      if (revenueByMonth[entry.month]) {
        // Se o mês já existir, somar os valores
        revenueByMonth[entry.month] += entry.revenue;
      } else {
        // Caso contrário, criar a entrada para o mês
        revenueByMonth[entry.month] = entry.revenue;
      }
    });

    // Montar o array final no formato que você quer, com os meses somados
    const aggregatedRevenue = Object.keys(revenueByMonth).map((month) => ({
      month,
      revenue: revenueByMonth[month],
    }));

    return aggregatedRevenue; // Retorna os valores agregados
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch revenue data.');
  }
}

export async function fetchLatestInvoices() {
  noStore();
  try {

    const data = await sql<LatestInvoiceRaw>`
  SELECT invoices.amount, customers.name, customers.image_url, customers.email
  FROM invoices
  JOIN customers ON invoices.customer_id = customers.id
  WHERE status_id = '1'
  ORDER BY invoices.date DESC
  LIMIT 5`;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));

    return latestInvoices;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch the latest invoices.');
  }
}

export async function fetchCardData() {
  noStore();
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`
    SELECT 
      COUNT(*) 
    FROM invoices 
    JOIN customers ON customers.id = invoices.customer_id 
    WHERE status_id = '1'`;
    const customerCountPromise = sql`
      SELECT 
        COUNT(*) 
      FROM customers 
      WHERE status_id = '1'
    `;
    const invoiceStatusPromise = sql`
        SELECT
            SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
            SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices
         JOIN customers ON customers.id = invoices.customer_id WHERE status_id = '1'
         `;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? '0');
    const numberOfCustomers = Number(data[1].rows[0].count ?? '0');
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? '0');
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? '0');

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch card data.');
  }
}

const ITEMS_PER_PAGE = 10;

export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    await new Promise((resolve) => setTimeout(resolve, 1000));
    return invoices.rows;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoices.');
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch total number of invoices.');
  }
}

export async function fetchInvoiceById(id: string) {

  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;
    await new Promise((resolve) => setTimeout(resolve, 100));
    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    console.log(invoice);
    return invoice[0];

  } catch (error) {

    console.error('Database Error:', error);
    throw new Error('Failed to fetch invoice.');

  }
}



export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch all customers.');
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error('Database Error:', err);
    throw new Error('Failed to fetch customer table.');
  }
}

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

