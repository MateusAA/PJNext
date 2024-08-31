import { PrismaClient } from '@prisma/client';
const db = new PrismaClient();
import 'server-only'

import { cookies } from 'next/headers';
import { cache } from '@/app/lib/cacheModule';
import { SignJWT, jwtVerify } from 'jose'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)

export async function encrypt(payload) {
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(encodedKey)
}


export async function decrypt(session: string | undefined = '') {
    try {
        const { payload } = await jwtVerify(session, encodedKey, {
            algorithms: ['HS256'],
        })
        return payload
    } catch (error) {
        console.log('Failed to verify session')
    }
}

export async function createSession(userId: string, name: string) {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    const session = await encrypt({ userId, name , expiresAt })

    cookies().set('session', session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: 'lax',
        path: '/',
    })
}

export async function updateSession() {
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


export const verifySession = cache(async () => {
    const cookie = cookies().get('session').value
    const session = await decrypt(cookie)

    if (!session.userId) {
        redirect('/login')
    }

    return { isAuth: true, userId: session.userId, name: session.name }
})

export async function getUser() {
    const session = await verifySession(); // Função para verificar a sessão
    if (!session || !session.userId) return null;



    if (session) {
        const user =
        {
            id: session.userId, // Passando o número inteiro
            name: session.name

        }
        return user;
    } else {
        console.log('Failed to fetch user:');
        return null;
    }
}
