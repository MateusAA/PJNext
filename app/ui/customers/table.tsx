import Image from 'next/image';
import { lusitana } from '@/app/ui/font';
import { UpdateCustomers, DeleteCustomers } from '@/app/ui/invoices/buttons';
import {
  CustomersTableType,
  FormattedCustomersTable,
} from '@/app/lib/definitions';

export default function CustomersTable({
  customers,
}: {
  customers: FormattedCustomersTable[];
}) {
  return (

    <div className="mt-6 flow-root">
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden rounded-md bg-gray-50 p-2 md:pt-0">
            <div className="md:hidden">
              {customers?.map((customer) => (
                <div
                  key={customer.id}
                  className="mb-2 w-full rounded-md bg-white p-4"
                >
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <div className="mb-2 flex items-center">
                        <div className="flex items-center gap-3">
                          <Image
                            src={customer.image_url}
                            className="rounded-full"
                            alt={`${customer.name}'s profile picture`}
                            width={28}
                            height={28}
                          />
                          <p>{customer.name}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">
                        {customer.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {customer.status_id}
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-center justify-between border-b py-5">
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Pendente</p>
                      <p className="font-medium">{customer.total_pending}</p>
                    </div>
                    <div className="flex w-1/2 flex-col">
                      <p className="text-xs">Pago</p>
                      <p className="font-medium">{customer.total_paid}</p>
                    </div>
                  </div>
                  <div className="pt-4 text-sm">
                    <p>{customer.total_invoices} invoices</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <UpdateCustomers id={customer.id} />
                    <DeleteCustomers id={customer.id} />
                  </div>
                </div>
              ))}
            </div>
            <table className="hidden min-w-full rounded-md text-gray-900 md:table">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Nome
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Email
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Total de faturas
                  </th>
                  <th scope="col" className="px-3 py-5 font-medium">
                    Total pendente
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    Total pago
                  </th>
                  <th scope="col" className="px-4 py-5 font-medium">
                    <span className="sr-only">Editar</span>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {customers.map((customer) => (
                  <tr key={customer.id} className="group">
                    <td className="whitespace-nowrap bg-white py-5 pl-4 pr-3 text-sm text-black group-first-of-type:rounded-md group-last-of-type:rounded-md sm:pl-6">
                      <div className="flex items-center gap-3">
                        <Image
                          src={customer.image_url}
                          className="rounded-full"
                          alt={`${customer.name}'s profile picture`}
                          width={28}
                          height={28}
                        />
                        <p>{customer.name === null ? customer.razao_social : customer.name} </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {customer.email}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      <span
                        className={`px-4 py-4 rounded-full ${customer.status_id === '1'
                          ? 'bg-green-100 text-green-800'   
                          : customer.status_id === '2'
                            ? 'bg-red-100 text-red-800'       
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                      >
                        {customer.status_id === '1'
                          ? 'Aprovado'
                          : customer.status_id === '2'
                            ? 'Reprovado'
                            : 'Aguardando Aprovação'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {customer.total_invoices}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm">
                      {customer.total_pending}
                    </td>
                    <td className="whitespace-nowrap bg-white px-4 py-5 text-sm group-first-of-type:rounded-md group-last-of-type:rounded-md">
                      {customer.total_paid}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-6 pr-3">
                      <div className="flex justify-end gap-3">
                        <UpdateCustomers id={customer.id} />
                        <DeleteCustomers id={customer.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
}
