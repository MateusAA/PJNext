'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  PhoneArrowDownLeftIcon,
  BookmarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { userAgentFromString } from 'next/server';
import { RectangleGroupIcon } from '@heroicons/react/24/outline';

// Map of links organized by category
const links = {
  home: { name: 'Home', href: '/View/dashboard', icon: HomeIcon },
  faturamento: {
    title: 'Faturamento',
    items: [
      {
        name: 'Invoices',
        href: '/View/dashboard/invoices',
        icon: BookmarkIcon,
      },
    ],
  },
  gestaoPessoas: {
    title: 'Administração de Usuarios',
    items: [
      {
        name: 'Users',
        href: '/View/dashboard/users',
        icon: UserIcon,
      },
      {
        name: 'Grupo de Usuarios',
        href: '/View/dashboard/users_group',
        icon: RectangleGroupIcon,
      },
    ],
  },
  CRM: {
    title: 'CRM',
    items: [
      {
        name: 'Customers',
        href: '/View/dashboard/customers',
        icon: UserGroupIcon,
      },
      {
        name: 'Contatos',
        href: '/View/dashboard/contato',
        icon: PhoneArrowDownLeftIcon,
      },
      {
        name: 'Aprovação',
        href: '/View/dashboard/aprovacao',
        icon: CheckIcon,
      },
    ],
  },
};

function NavGroup({ title, links, isOpen, toggleOpen }) {
  return (
    <div className="mb-4">
      <button
        onClick={toggleOpen}
        className="flex items-center justify-between w-full text-left p-3 text-sm font-medium text-gray-700 hover:bg-sky-100 hover:text-blue-600"
      >
        <span>{title}</span>
        <span>{isOpen ? '−' : '+'}</span>
      </button>
      {isOpen && (
        <div className="pl-4">
          {links.map((link) => {
            const LinkIcon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={clsx(
                  'flex items-center gap-2 p-2 text-sm font-medium hover:bg-sky-100 hover:text-blue-600',
                  {
                    'bg-sky-100 text-blue-600': usePathname() === link.href,
                  }
                )}
              >
                <LinkIcon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function NavLinks() {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState({
    faturamento: false,
    gestaoPessoas: false,
    CRM: false,
  });

  const toggleGroup = (group) => {
    setOpenGroups((prevState) => ({
      ...prevState,
      [group]: !prevState[group],
    }));
  };

  return (
    <aside className="w-64 p-4 bg-white border-r border-gray-200 h-full">
      {/* Home link */}
      <div className="mb-4">
        <Link
          href={links.home.href}
          className={clsx(
            'flex items-center gap-2 p-3 text-sm font-medium text-gray-700 hover:bg-sky-100 hover:text-blue-600',
            {
              'bg-sky-100 text-blue-600': pathname === links.home.href,
            }
          )}
        >
          <HomeIcon className="w-5 h-5" />
          <span>Home</span>
        </Link>
      </div>

      {/* Navigation groups */}
      <NavGroup
        title={links.faturamento.title}
        links={links.faturamento.items}
        isOpen={openGroups.faturamento}
        toggleOpen={() => toggleGroup('faturamento')}
      />
      <NavGroup
        title={links.gestaoPessoas.title}
        links={links.gestaoPessoas.items}
        isOpen={openGroups.gestaoPessoas}
        toggleOpen={() => toggleGroup('gestaoPessoas')}
      />
      <NavGroup
        title={links.CRM.title}
        links={links.CRM.items}
        isOpen={openGroups.CRM}
        toggleOpen={() => toggleGroup('CRM')}
      />
    </aside>
  );
}
