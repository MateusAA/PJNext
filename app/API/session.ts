import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();

import 'server-only'

import { cookies } from 'next/headers';

import { cache, cacheMap } from '@/app/lib/cacheModule';
import { redirect } from 'next/navigation';
import { SignJWT, jwtVerify, JWTPayload as JoseJWTPayload } from 'jose'
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

interface MyJWTPayload extends JoseJWTPayload {
    name: string;
    userId: string;
    expiresAt: Date;

}

export async function encrypt(payload: MyJWTPayload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('2m')
        .sign(encodedKey);
}


export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })

        const expiresAt = payload.expiresAt;

        // Garantir que expiresAt é do tipo correto (string ou number)
        if (typeof expiresAt !== 'string' && typeof expiresAt !== 'number') {
            throw new Error('Invalid expiresAt format');
        }

        const now = Date.now();
        const expiresTime = new Date(expiresAt).getTime();

        // Verifica se o token já expirou
        if (now > expiresTime) {
            console.log('Session expired');
            clearSession(); // Função para limpar cookies e sessão
            return null;
        }

        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}

export async function createSession(userId: string, name: string, id_grupo: string) {
    cookies().set('session', '', {
        expires: new Date(0),
        path: '/',
    });
    cacheMap.clear();

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, name, id_grupo, expiresAt })

    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function updateSession() {

    cookies().set('session', '', {
        expires: new Date(0),
        path: '/',
    });

    const session = cookies().get('session')?.value
    const payload = await decrypt(session)

    if (!session || !payload) {
        return null
    }

    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expires,
        sameSite: 'lax',
        path: '/',
    })
}

// Função para limpar a sessão e redirecionar para o login
export function clearSession() {
    // Remove o cookie da sessão
    cookies().set('session', '', {
        expires: new Date(0),
        path: '/',
    });

    cacheMap.clear();

    // Redireciona para a página de login
    redirect('View/login');
}   

