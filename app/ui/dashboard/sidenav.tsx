import Link from 'next/link';
import NavLinks from '@/app/ui/dashboard/nav-links';
import AcmeLogo from '@/app/ui/acme-logo';
import { PowerIcon } from '@heroicons/react/24/outline';
import Sing from '@/app/ui/dashboard/sing';
import { getUser } from '@/app/lib/DAL'; 

export default async function SideNav() {
  const user = await getUser();
  return (
    <div className="flex h-full flex-col px-3 py-4 md:px-2">
      <Link
        className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-800 p-4 md:h-40"
        href="/"
      >
        <div className="w-32 text-white md:w-40">
          <div className="mb-12">
           <p> Olá, {user.name || 'Usuario' } </p>
          </div>
          <AcmeLogo />
        </div>
      </Link>
      <Sing />
    </div>
  );
}
