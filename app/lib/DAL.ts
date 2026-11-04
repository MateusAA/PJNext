import 'server-only'
    
import { cookies } from 'next/headers';
import { decrypt } from '@/app/api/session';
import { redirect } from 'next/navigation';

export async function verifySession() {
    const cookie = cookies().get('session')
    // Verifica se o cookie existe antes de acessar seu valor
    
    if (!cookie) {
        redirect('/View/login');
        return { isAuth: false };
    }

    const session = await decrypt(cookie.value);

    // Verifica se o objeto session tem userId
    if (!session || !session.userId) {
        redirect('/View/login');
        return { isAuth: false };
    }

    return { isAuth: true, userId: session.userId, name: session.name, id_grupo: session.id_grupo }
}




export async function getUser() {
    const session = await verifySession()
    if (!session) return null

    if(session.isAuth){
        
        const user = {
            id: session.userId,
            name: session.name,
            id_grupo: session.id_grupo
        }

        return user;
    }else{
        console.error('Failed to fetch user');
        return null;
    }
}

