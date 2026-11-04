import type { NextAuthConfig } from 'next-auth';
import { NextResponse } from 'next/server';

export const authConfig = {
    pages: {
        signIn: '/View/login',
    },
    callbacks: {
        async authorized({ request: { nextUrl, cookies } }) {
            const hasAppSession = Boolean(cookies.get('session')?.value);
            const isOnDashboard = nextUrl.pathname.startsWith('/View/dashboard');

            if (isOnDashboard && !hasAppSession) {
                return NextResponse.redirect(new URL('/View/login', nextUrl));
            }

            return true;
        },
    },
    providers: [], // Adicione os provedores conforme necessário
} satisfies NextAuthConfig;
