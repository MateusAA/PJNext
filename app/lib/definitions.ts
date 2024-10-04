// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  id_grupo: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  image_url: string;
};

export type Invoice = {
  id: string; // Will be created on the database
  customer_id: string;
  amount: number; // Stored in cents
  status: 'pending' | 'paid';
  date: string;
};

export type Revenue = {
  month: string;
  revenue: number;
  
};

export type LatestInvoice = {
  id: string;
  name: string;
  image_url: string;
  email: string;
  amount: string;
};

// The database returns a number for amount, but we later format it to a string with the formatCurrency function
export type LatestInvoiceRaw = Omit<LatestInvoice, 'amount'> & {
  amount: number;
};

export type InvoicesTable = {
  id: string;
  customer_id: string;
  name: string;
  email: string;
  image_url: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type UsersTable = {
  id: string;
  name: string;
  email: string;
  description: string;
};

export type UsersFilter = {
  id: string;
  name: string;
  email: string;
  description: string;
};

export type UsersForm = {
  id: string;
  name: string;
  email: string;
  password: string;
  description: string;
  id_grupo: string;
};

export type UsersRespon = {
  id: string;
  name: string;

};

export type CustomersTableType = {
  id: string;
  name: string;
  razao_social: string;
  email: string;
  image_url: string;
  status_id: string;
  total_invoices: number;
  total_pending: number;
  total_paid: number;
};

export type FormattedCustomersTable = {
  id: string;
  name: string;
  razao_social: string;
  email: string;
  image_url: string;
  status_id: string;
  total_invoices: number;
  total_pending: string;
  total_paid: string;
};

export type FormattedCustomersTableAp = {
  id: string;
  name: string;
  razao_social: string;
  image_url: string;
  status_id: string;
  
};

export type CustomerField = {
  id: string;
  name: string;
};
export type CustomerFilterCPF = {
  cpf: string;
};
export type CustomerFilterCNPJ = {
  cnpj: string;
};

export type GroupField = {
  id_group: string;
  description: string;
};
export type InvoiceForm = {
  id: string;
  customer_id: string;
  amount: number;
  status: 'pending' | 'paid';
};

export type CustomersForm = {
  id: string;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  cnpj: string;
  razao_social: string;
  nome_fantasia: string;
  ie: string;
  contact_id: string;
  tel_cel: string;
  andress_id : string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  id_responsavel: string;
  nameRes : string;
  image : string;
};

export type FormattedContactCustomersTable = {
  id: string;
  name: string;
  nome_fantasia: string;
  email: string;
  image_url: string;
  tel_cel: string;
  id_responsavel: string;
  message: string;
  created_at: string;
  contact_count: string;
  
};
export type FormattedTypeTreatment = {
  treatment_type_id_uuid: string;
  description: string;
};
export type FormattedtypeReturn = {
  return_type_id_uuid: string;
  description: string;
};

export type FormattedContactCustomersHistory = {
  id: string;
  name: string;
  nome_fantasia: string;
  email: string;
  image_url: string;
  tel_cel: string;
  id_responsavel: string;
  cpf: string;
  cnpj: string;
  name_resp: string;
};
export type FormattedContactCustomersHistoryContact = {
  message: string;
  created_at: string;
};

export type FormattedChartContact = {
  responsavel: string;
  desc: string;
  description: string;
};

export type FormattedChartContactTable = {
  name: string;
  nome_fantasia: string;
  id: string;
  responsavel: string;
  desc: string;
  description: string;
};
