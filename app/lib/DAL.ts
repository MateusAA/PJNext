import 'server-only'
    
import { cookies } from 'next/headers';
import { decrypt } from '@/app/API/session';
import { cache } from '@/app/lib/cacheModule';
import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

export const verifySession = cache(async () => {
    const cookie = cookies().get('session').value
    const session = await decrypt(cookie)

    if (!session.userId) {
        redirect('/login')
    }

    return { isAuth: true, userId: session.userId, name: session.name }
})



export const getUser = cache(async () => {
    const session = await verifySession()
    if (!session) return null

    if(session.isAuth){
        
        const user = {
            id: session.userId,
            name: session.name
        }

        return user;
    }else{
        console.error('Failed to fetch user');
        return null;
    }
})

