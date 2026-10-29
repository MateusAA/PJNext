# PjNext

Aplicação Next.js para gestão de clientes, faturamento, usuários e histórico de contatos.

## Banco de dados

O projeto usa PostgreSQL. O schema versionado em `schema.prisma` mapeia as tabelas legadas consultadas pela aplicação. A migration inicial está em `migrations/20261028120000_rebuild_application_schema`.

Para preparar um banco PostgreSQL **novo e vazio**:

1. Configure `DATABASE_URL` no ambiente local com a URL de conexão do banco. Não compartilhe esse valor nem o envie para o repositório.
2. Instale as dependências com `npm install`.
3. Aplique as migrations com `npx prisma migrate deploy`.
4. Gere o Prisma Client com `npx prisma generate`.
5. Inicie o projeto com `npm run dev`.

O restante da aplicação ainda executa consultas SQL via `@vercel/postgres`. Em produção, configure também as variáveis de conexão Vercel Postgres que o SDK espera. O Prisma e o SDK devem apontar para o mesmo banco.

Para inserir dados de demonstração em um banco vazio, use `npm run seed:demo`. O script cria uma conta administrativa com senha aleatória, clientes, faturas, receita e histórico de contatos. Ele cancela sem gravar se alguma tabela de destino já tiver dados e mostra a senha temporária uma única vez no terminal. Guarde-a em local seguro.

O script legado `npm run seed` contém credenciais fixas do tutorial; prefira `npm run seed:demo`.

## Recuperação de dados

Migrations recriam estrutura, não registros apagados. Para recuperar dados antigos, é necessário um backup/exportação do PostgreSQL ou outra cópia dos dados. O repositório não contém um dump do banco.
