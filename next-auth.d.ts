// types/next-auth.d.ts
import NextAuth from 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        user: {
            id?: string;
            name?: string | null;
            email?: string | null;
        } & DefaultSession['user'];
    }

    interface Token {
        accessToken?: string;
        id?: string;
    }
}
