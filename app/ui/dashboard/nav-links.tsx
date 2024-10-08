'use client';

import {
  UserGroupIcon,
  HomeIcon,
  DocumentDuplicateIcon,
  PhoneArrowDownLeftIcon,
  BookmarkIcon,
  CheckIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { UserIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import { RectangleGroupIcon } from '@heroicons/react/24/outline';

// Definindo tipos para os links e grupos
type LinkItem = {
  name: string;
  href: string;
  icon: React.ElementType;
};

type LinkGroup = {
  title: string;
  items: LinkItem[];
};

// Map of links organized by category
const links: {
  home: LinkItem;
  faturamento: LinkGroup;
  gestaoPessoas: LinkGroup;
  CRM: LinkGroup;
} = {
  home: { name: 'Home', href: '/View/dashboard', icon: HomeIcon },
  faturamento: {
    title: 'Faturamento',
    items: [
      {
        name: 'Faturas',
        href: '/View/dashboard/invoices',
        icon: BookmarkIcon,
      },
    ],
  },
  gestaoPessoas: {
    title: 'Administração de Usuarios',
    items: [
      {
        name: 'Usuarios',
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
        name: 'Clientes',
        href: '/View/dashboard/customers',
        icon: UserGroupIcon,
      },
      {
        name: 'Aprovação',
        href: '/View/dashboard/aprovacao',
        icon: CheckIcon,
      },
      {
        name: 'Contatos',
        href: '/View/dashboard/contato',
        icon: PhoneArrowDownLeftIcon,
      },
      {
        name: 'Dash Contatos',
        href: '/View/dashboard/charContato',
        icon: ChartBarIcon,
      },
    ],
  },
};

function NavGroup({
  title,
  links,
  isOpen,
  toggleOpen,
  pathname,
}: {
  title: string;
  links: LinkItem[];
  isOpen: boolean;
  toggleOpen: () => void;
  pathname: string;
}) {
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
                    'bg-sky-100 text-blue-600': pathname === link.href,
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

  const toggleGroup = (group: keyof typeof openGroups) => {
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
        pathname={pathname}
      />
      <NavGroup
        title={links.gestaoPessoas.title}
        links={links.gestaoPessoas.items}
        isOpen={openGroups.gestaoPessoas}
        toggleOpen={() => toggleGroup('gestaoPessoas')}
        pathname={pathname}
      />
      <NavGroup
        title={links.CRM.title}
        links={links.CRM.items}
        isOpen={openGroups.CRM}
        toggleOpen={() => toggleGroup('CRM')}
        pathname={pathname}
      />
    </aside>
  );
}
