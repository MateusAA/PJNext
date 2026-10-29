require('dotenv').config();

const { randomBytes } = require('node:crypto');
const bcrypt = require('bcrypt');
const { Prisma, PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const adminEmail = 'admin.teste@pjnext.test';
const adminName = 'Administrador de Teste';
const temporaryPassword = randomBytes(18).toString('base64url');

const customers = [
  {
    name: 'Ana Lima (Teste)',
    email: 'ana.lima@exemplo.test',
    image_url: '/customers/delba-de-oliveira.png',
    status_id: '1',
  },
  {
    name: 'Bruno Costa (Teste)',
    email: 'bruno.costa@exemplo.test',
    image_url: '/customers/lee-robinson.png',
    status_id: '1',
  },
  {
    name: 'Empresa Horizonte (Teste)',
    email: 'contato@horizonte.exemplo.test',
    razao_social: 'Empresa Horizonte de Teste Ltda.',
    nome_fantasia: 'Horizonte Teste',
    image_url: '/customers/steven-tey.png',
    status_id: '1',
  },
  {
    name: 'Comercial Modelo (Teste)',
    email: 'contato@modelo.exemplo.test',
    razao_social: 'Comercial Modelo de Teste Ltda.',
    nome_fantasia: 'Modelo Teste',
    image_url: '/customers/steph-dietz.png',
    status_id: '1',
  },
  {
    name: 'Cliente Pendente (Teste)',
    email: 'pendente@exemplo.test',
    image_url: '/customers/michael-novotny.png',
    status_id: '3',
  },
];

const revenue = [
  ['Jan', 2000], ['Feb', 1800], ['Mar', 2200], ['Apr', 2500],
  ['May', 2300], ['Jun', 3200], ['Jul', 3500], ['Aug', 3700],
  ['Sep', 2500], ['Oct', 2800], ['Nov', 3000], ['Dec', 4800],
];

async function main() {
  const passwordHash = await bcrypt.hash(temporaryPassword, 12);

  await prisma.$transaction(async (tx) => {
    const counts = await Promise.all([
      tx.user.count(),
      tx.userGroup.count(),
      tx.customer.count(),
      tx.invoice.count(),
      tx.revenue.count(),
      tx.customerAddress.count(),
      tx.customerContactInfo.count(),
      tx.treatmentType.count(),
      tx.returnType.count(),
      tx.customerHistoryContact.count(),
    ]);

    if (counts.some((count) => count > 0)) {
      throw new Error(
        'Seed cancelado: pelo menos uma tabela de destino já contém dados.',
      );
    }

    const group = await tx.userGroup.create({
      data: { description: 'Administrador' },
    });
    const admin = await tx.user.create({
      data: {
        name: adminName,
        email: adminEmail,
        password: passwordHash,
        id_grupo: group.id_group,
      },
    });

    const insertedCustomers = [];
    for (const customer of customers) {
      insertedCustomers.push(await tx.customer.create({ data: customer }));
    }

    const invoiceRows = [
      [0, 84500, 'paid', '2026-10-12'],
      [1, 120000, 'pending', '2026-10-17'],
      [2, 259900, 'paid', '2026-10-20'],
      [3, 64900, 'pending', '2026-10-24'],
      [0, 39900, 'paid', '2026-10-26'],
    ];
    for (const [customerIndex, amount, status, date] of invoiceRows) {
      await tx.invoice.create({
        data: {
          customer_id: insertedCustomers[customerIndex].id,
          amount,
          status,
          date: new Date(date + 'T12:00:00.000Z'),
        },
      });
    }

    await tx.revenue.createMany({
      data: revenue.map(([month, amount]) => ({ month, revenue: amount })),
    });

    for (const customer of insertedCustomers.slice(0, 4)) {
      await tx.customerAddress.create({
        data: {
          customer_id: customer.id,
          rua: 'Rua de Teste',
          numero: '100',
          cidade: 'São Paulo',
          uf: 'SP',
          cep: '01001000',
          bairro: 'Centro',
        },
      });
      await tx.customerContactInfo.create({
        data: {
          customer_id: customer.id,
          id_responsavel: admin.id,
          tel_cel: '11999990000',
          email: customer.email,
        },
      });
    }

    const treatments = await Promise.all([
      tx.treatmentType.create({ data: { description: 'Contato inicial (Teste)' } }),
      tx.treatmentType.create({ data: { description: 'Proposta enviada (Teste)' } }),
      tx.treatmentType.create({ data: { description: 'Acompanhamento (Teste)' } }),
    ]);
    const returns = await Promise.all([
      tx.returnType.create({ data: { description: 'Aguardando resposta (Teste)' } }),
      tx.returnType.create({ data: { description: 'Interessado (Teste)' } }),
      tx.returnType.create({ data: { description: 'Retorno agendado (Teste)' } }),
    ]);

    for (let index = 0; index < 3; index += 1) {
      await tx.customerHistoryContact.create({
        data: {
          message: 'Registro de demonstração para validar o histórico.',
          customer_id_uuid: insertedCustomers[index].id,
          treatment_type: treatments[index].treatment_type_id_uuid,
          return_type: returns[index].return_type_id_uuid,
        },
      });
    }
  }, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    maxWait: 30000,
    timeout: 60000,
  });

  console.log(JSON.stringify({
    result: 'Dados de demonstração inseridos.',
    adminEmail,
    temporaryPassword,
    customers: customers.length,
    invoices: 5,
    revenueMonths: revenue.length,
    historyEntries: 3,
  }));
}

main()
  .catch((error) => {
    console.error(error.message || 'Falha ao inserir dados de demonstração.');
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
