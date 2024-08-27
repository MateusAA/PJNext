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


export async function AprovCustomer(id: string, status_id: string) {

    try {
        await sql`UPDATE customers
        SET status_id = ${status_id}
        WHERE id = ${id}`;
        
    } catch (error) {
        return {
            message: 'Database Error: Failed to Aprovação Custoemr.'
        };
    }

    revalidatePath('/View/dashboard/aprovacao');
    redirect('/View/dashboard/aprovacao');
}