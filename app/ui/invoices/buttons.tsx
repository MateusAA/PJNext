import { PencilIcon, PlusIcon, TrashIcon, CheckIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { deleteInvoice } from '@/app/lib/invoices/action';
import { deleteGroupUsers } from '@/app/lib/users_group/action'
import { deleteCustomer } from '@/app/lib/customers/action'
import { AprovCustomer } from '@/app/lib/aprovacao/action'

export function CreateInvoice() {
  return (
    <Link
      href="invoices/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Invoice</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function UpdateInvoice({ id }: { id: string }) {
  return (
    <Link
      href={`/View/dashboard/invoices/${id}/edit`}
      className="rounded-md border p-2 hover:bg-green-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function UpdateUsers({ id }: { id: string }) {
  return (
    <Link
      href={`/View/dashboard/users/${id}/edit`}
      className="rounded-md border p-2 hover:bg-green-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function DeleteInvoice({ id }: { id: string }) {
  const deleteInvoiceWithId = deleteInvoice.bind(null, id);
  return (
    <form action={deleteInvoiceWithId}>
      <button className="rounded-md border p-2 hover:bg-red-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}


export function CreateUser() {
  return (
    <Link
      href="users/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create User</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}
export function CreateUserGroup() {
  return (
    <Link
      href="users_group/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create User Group</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function DeleteGroupUsers({ id }: { id: string }) {
  const deleteGroupWithId = deleteGroupUsers.bind(null, id);
  return (
    <form action={deleteGroupWithId}>
      <button className="rounded-md border p-2 hover:bg-red-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
export function UpdateUsersGroup({ id }: { id: string }) {
  return (
    <Link
      href={`/View/dashboard/users_group/${id}/edit`}
      className="rounded-md border p-2 hover:bg-green-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}

export function CreateCustomers() {
  return (
    <Link
      href="customers/create"
      className="flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
    >
      <span className="hidden md:block">Create Customers</span>{' '}
      <PlusIcon className="h-5 md:ml-4" />
    </Link>
  );
}

export function DeleteCustomers({ id }: { id: string }) {
  const deleteCustomerWithId = deleteCustomer.bind(null, id);
  return (
    <form action={deleteCustomerWithId}>
      <button className="rounded-md border p-2 hover:bg-red-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}
export function UpdateCustomers({ id }: { id: string }) {
  return (
    <Link
      href={`/View/dashboard/customers/${id}/edit`}
      className="rounded-md border p-2 hover:bg-green-100"
    >
      <PencilIcon className="w-5" />
    </Link>
  );
}
export function UpdateAprov({ id }: { id: string }) {
  return (
    <Link
      href={`/View/dashboard/aprovacao/${id}/edit`}
      className="rounded-md border p-2 hover:bg-green-100"
    >
      <CheckIcon className="w-5" />
    </Link>
  );
}

export function AprovCustomers({ id, status_id }: { id: string, status_id: string }) {
  const AprovCustomerWithId = AprovCustomer.bind(null, id, status_id);
  return (
    <form action={AprovCustomerWithId}>
      <button className="rounded-md border p-2 bg-green-100 text-green-800 hover:bg-green-300 w-50">
        Aprovar
       
      </button>
    </form>
  );
}

export function ReprovCustomers({ id, status_id }: { id: string, status_id: string }) {
  const AprovCustomerWithId = AprovCustomer.bind(null, id, status_id);
  return (
    <form action={AprovCustomerWithId}>
      <button className="rounded-md border p-2 bg-red-100 text-red-800 hover:bg-red-300">
        Reprovar
      </button>
    </form>
  );
}

export function AgApCustomers({ id, status_id }: { id: string, status_id: string }) {
  const AprovCustomerWithId = AprovCustomer.bind(null, id, status_id);
  return (
    <form action={AprovCustomerWithId}>
      <button className="rounded-md border p-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-300">
        <ArrowLeftIcon className="w-5" />
      </button>
    </form>
  );
}