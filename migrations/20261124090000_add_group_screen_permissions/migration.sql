ALTER TABLE "user_group"
ADD COLUMN "screen_permissions" TEXT[] NOT NULL DEFAULT ARRAY[
    '/View/dashboard',
    '/View/dashboard/invoices',
    '/View/dashboard/users',
    '/View/dashboard/users_group',
    '/View/dashboard/customers',
    '/View/dashboard/aprovacao',
    '/View/dashboard/contato',
    '/View/dashboard/charContato'
];
