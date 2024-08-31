import Image from 'next/image';
import { lusitana } from '@/app/ui/font';
import { UpdateAprov, DeleteCustomers } from '@/app/ui/invoices/buttons';
import {
  FormattedCustomersTableAp,
  FormattedCustomersTable,
} from '@/app/lib/definitions';

export default async function CustomersTableAg({
  customers,
}: {
    customers: FormattedCustomersTableAp[];
}) {
  return (

    <div className="mt-2 flow">
      
      <div className="overflow">
        <div className="inline-block">
          <div className="rounded-md bg-gray-50 p-2">
            <div className="md:hidden ">
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
                     
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-2">
                    <UpdateAprov id={customer.id} />
                   
                  </div>
                </div>
              ))}
            </div>
            <center className='px-4 py-4 rounded-full bg-yellow-100 text-yellow-800'>Aguardando Aprovação</center>
            <table className="hidden min-w-full rounded-md text-gray-900 md:table  w-[700px]">
              <thead className="rounded-md bg-gray-50 text-left text-sm font-normal">
                <tr>
                  <th scope="col" className="px-4 py-5 font-medium sm:pl-6">
                    Name
                  </th>
                 
                  <th scope="col" className="px-4 py-5 font-medium">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white">
                {customers.some(customer => customer.status_id === '3') ? (
                  customers.filter(customer => customer.status_id === '3').map((customer) => (
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
                          <p>{customer.name === null ? customer.razao_social : customer.name}</p>
                        </div>
                      </td>
                      <td className="whitespace-nowrap py-3 pl-6 pr-3">
                        <div className="flex justify-end gap-3">
                          <UpdateAprov id={customer.id} />
                          
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={2} className="text-center py-4 text-red-800">
                      Nenhum cliente Aguardando Aprovação
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

  );
}
