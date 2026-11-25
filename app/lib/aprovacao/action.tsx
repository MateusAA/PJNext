'use server';

import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { sendCustomerDecisionEmail } from '@/app/lib/customer-decision-email';

type CustomerDecisionRecord = {
    name: string | null;
    razao_social: string | null;
    nome_fantasia: string | null;
    email: string | null;
    status_id: string;
};

export async function AprovCustomer(id: string, status_id: string) {
    if (!['1', '2', '3'].includes(status_id)) {
        redirect('/View/dashboard/aprovacao?emailStatus=invalid_transition');
    }

    let notificationStatus = 'not_applicable';

    try {
        const result = await sql<CustomerDecisionRecord>`
            SELECT name, razao_social, nome_fantasia, email, status_id
            FROM customers
            WHERE id = ${id}
            LIMIT 1
        `;
        const customer = result.rows[0];

        if (!customer) {
            notificationStatus = 'update_failed';
        } else {
            const isDecision = status_id === '1' || status_id === '2';
            const isValidTransition = isDecision
                ? customer.status_id === '3'
                : customer.status_id === '2';

            if (!isValidTransition) {
                notificationStatus = 'invalid_transition';
            } else {
                const updated = await sql`
                    UPDATE customers
                    SET status_id = ${status_id}
                    WHERE id = ${id} AND status_id = ${customer.status_id}
                    RETURNING id
                `;

                if (!updated.rowCount) {
                    notificationStatus = 'update_failed';
                } else if (isDecision) {
                    if (!customer.email) {
                        notificationStatus = 'no_email';
                    } else {
                        const emailResult = await sendCustomerDecisionEmail({
                            to: customer.email,
                            customerName: customer.name || customer.razao_social || customer.nome_fantasia || 'cliente',
                            decision: status_id === '1' ? 'approved' : 'rejected',
                        });
                        notificationStatus = emailResult === 'sent'
                            ? 'sent'
                            : emailResult === 'not_configured'
                                ? 'not_configured'
                                : 'failed';
                    }
                }
            }
        }
    } catch (error) {
        console.error('Failed to update customer decision:', error);
        notificationStatus = 'update_failed';
    }

    revalidatePath('/View/dashboard/aprovacao');
    revalidatePath('/View/dashboard/customers');
    redirect(`/View/dashboard/aprovacao?emailStatus=${notificationStatus}`);
}
