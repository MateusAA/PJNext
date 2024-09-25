import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';
import { cache, cacheMap } from '@/app/lib/cacheModule';

import { cookies } from 'next/headers';

const redirectWithRemovedCookie = (url: URL, cookieName: string) => {
    const response = NextResponse.redirect(url);

    // Define uma data no passado para garantir que o cookie seja removido
    response.cookies.set(cookieName, '', {
        expires: new Date(0), // Define a expiração no passado
        path: '/', // Defina o caminho correto conforme necessário
        // domain: process.env.COOKIE_DOMAIN, // Defina o domínio se necessário
    });

    return response;
};

export const authConfig = {
    pages: {
        signIn: '/View/login',
    },
    callbacks: {
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnDashboard = nextUrl.pathname.startsWith('/View/dashboard');
            if (isOnDashboard) {
                if (isLoggedIn) return true;
         
                // Redireciona para a página de login e remove o cookie
                return redirectWithRemovedCookie(new URL('/View/login', nextUrl), 'session');
                
            } else if (isLoggedIn) {
                return NextResponse.redirect(new URL('/View/dashboard', nextUrl));
            }
            return true;
        },
        
    },
    providers: [], // Adicione os provedores conforme necessário
} satisfies NextAuthConfig;
