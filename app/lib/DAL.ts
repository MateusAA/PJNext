import 'server-only'
    
import { cookies } from 'next/headers';
import { decrypt } from '@/app/api/session';
import { redirect } from 'next/navigation';

type VerifiedSession = {
    isAuth: true;
    userId: string;
    name: string;
    id_grupo: string | null;
};

export async function verifySession(): Promise<VerifiedSession> {
    const cookie = cookies().get('session')
    // Verifica se o cookie existe antes de acessar seu valor
    
    if (!cookie) {
        redirect('/View/login');
    }

    const session = await decrypt(cookie.value);

    // Verifica se o objeto session tem userId
    if (
        !session ||
        typeof session.userId !== 'string' ||
        typeof session.name !== 'string' ||
        (session.id_grupo !== null && typeof session.id_grupo !== 'string')
    ) {
        redirect('/View/login');
    }

    return {
        isAuth: true,
        userId: session.userId,
        name: session.name,
        id_grupo: session.id_grupo,
    };
}




export async function getUser() {
    const session = await verifySession()
    return {
        id: session.userId,
        name: session.name,
        id_grupo: session.id_grupo,
    };
}

