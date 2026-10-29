-- Rebuild the schema expected by the application's existing SQL queries.
CREATE TABLE "user_group" (
    "id_group" SERIAL PRIMARY KEY,
    "description" TEXT NOT NULL
);

CREATE TABLE "users" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "password" TEXT NOT NULL,
    "id_grupo" INTEGER REFERENCES "user_group"("id_group") ON DELETE SET NULL
);

CREATE TABLE "customers" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" TEXT,
    "email" TEXT,
    "image_url" TEXT,
    "cpf" TEXT UNIQUE,
    "rg" TEXT,
    "cnpj" TEXT UNIQUE,
    "razao_social" TEXT,
    "nome_fantasia" TEXT,
    "ie" TEXT,
    "status_id" TEXT NOT NULL DEFAULT '3'
);

CREATE TABLE "invoices" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "customer_id" UUID NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "date" DATE NOT NULL DEFAULT CURRENT_DATE
);
CREATE INDEX "invoices_customer_id_idx" ON "invoices"("customer_id");

CREATE TABLE "revenue" (
    "month" VARCHAR(4) PRIMARY KEY,
    "revenue" INTEGER NOT NULL
);

CREATE TABLE "tb_costumer_andress" (
    "id" SERIAL PRIMARY KEY,
    "customer_id" UUID NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
    "rua" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" VARCHAR(2) NOT NULL,
    "cep" TEXT NOT NULL,
    "bairro" TEXT NOT NULL
);
CREATE INDEX "tb_costumer_andress_customer_id_idx" ON "tb_costumer_andress"("customer_id");

CREATE TABLE "tb_costumer_contact" (
    "id" SERIAL PRIMARY KEY,
    "customer_id" UUID NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
    "id_responsavel" UUID NOT NULL REFERENCES "users"("id"),
    "tel_cel" TEXT NOT NULL,
    "email" TEXT NOT NULL
);
CREATE INDEX "tb_costumer_contact_customer_id_idx" ON "tb_costumer_contact"("customer_id");

CREATE TABLE "tb_treatment_type" (
    "treatment_type_id_uuid" SERIAL PRIMARY KEY,
    "description" TEXT NOT NULL
);

CREATE TABLE "tb_return_type" (
    "return_type_id_uuid" SERIAL PRIMARY KEY,
    "description" TEXT NOT NULL
);

CREATE TABLE "customer_contacts" (
    "id" SERIAL PRIMARY KEY,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "customer_id_uuid" UUID NOT NULL REFERENCES "customers"("id") ON DELETE CASCADE,
    "treatment_type" INTEGER NOT NULL REFERENCES "tb_treatment_type"("treatment_type_id_uuid"),
    "return_type" INTEGER NOT NULL REFERENCES "tb_return_type"("return_type_id_uuid")
);
CREATE INDEX "customer_contacts_customer_id_uuid_idx" ON "customer_contacts"("customer_id_uuid");
