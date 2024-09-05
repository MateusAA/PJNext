import NextAuth from 'next-auth'; // Importa o módulo NextAuth para autenticação
import { authConfig } from './auth.config'; // Importa a configuração de autenticação personalizada
import Credentials from 'next-auth/providers/credentials'; // Importa o provedor de credenciais para autenticação personalizada
import { z } from 'zod'; // Importa a biblioteca zod para validação de esquemas
import { sql } from '@vercel/postgres'; // Importa a função sql da biblioteca @vercel/postgres para consultas ao banco de dados
import type { User } from '@/app/lib/definitions'; // Importa o tipo User para tipagem estática
import bcrypt from 'bcrypt'; // Importa a biblioteca bcrypt para hashing e comparação de senhas
import { createSession } from '@/app/API/session'

// Função assíncrona que busca um usuário pelo email no banco de dados
async function getUser(email: string): Promise<User | undefined> {
    try {
        // Realiza a consulta ao banco de dados para encontrar o usuário com o email fornecido
        const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
        // Retorna o primeiro usuário encontrado (ou undefined se nenhum usuário foi encontrado)
        return user.rows[0];
    } catch (error) {
        // Loga o erro no console e lança uma nova exceção
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

// Exporta a configuração de autenticação do NextAuth, incluindo a função de autenticação, login e logout
export const { auth, signIn, signOut } = NextAuth({
    ...authConfig, // Espalha a configuração de autenticação personalizada
    providers: [
        // Define o provedor de credenciais para autenticação
        Credentials({
            // Função de autorização que valida as credenciais fornecidas
            async authorize(credentials) {
                // Valida as credenciais fornecidas usando zod
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                // Se a validação for bem-sucedida
                if (parsedCredentials.success) {
                    // Extrai o email e a senha das credenciais validadas
                    const { email, password } = parsedCredentials.data;
                    // Busca o usuário pelo email no banco de dados
                    const user = await getUser(email);
                    // Se nenhum usuário for encontrado, retorna null
                    if (!user) return null;
                    // Compara a senha fornecida com a senha armazenada no banco de dados
                    const passwordsMatch = await bcrypt.compare(password, user.password);


                    await createSession(user.id, user.name, user.id_grupo)
                    // Se as senhas coincidem, retorna o usuário
                    if (passwordsMatch) return user;

                }

                // Loga uma mensagem de erro no console e retorna null se as credenciais forem inválidas
                console.log('Invalid credentials');
                return null;
            },
        }),
    ],
});
