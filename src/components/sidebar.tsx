'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Home, Car, Route, Users2Icon, UsersIcon, User } from 'lucide-react';

const links = [
  { href: '/',          label: 'Home',      Icon: Home },
  { href: '/usuarios',          label: 'Usuarios',      Icon: User },
  { href: '/vehiculos', label: 'Vehículos', Icon: Car },
  { href: '/viajes',    label: 'Viajes',    Icon: Route },
  // { href: '/usuarios',  label: 'Usuarios',  Icon: Users },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className=" hidden md:flex md:w-64 md:flex-col  bg-white rounded-xl">
      {/* Logo / marca */}
      <div className="p-4">
        <div className="flex items-center gap-3 rounded-lg bg-blue-600 text-white p-4">
          <Globe className="h-6 w-6" />
          <span className="text-xl font-semibold">Panel</span>
        </div>
      </div>

      {/* Navegación */}
      <nav className="px-2 space-y-2">
        {links.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                  : 'text-slate-800 hover:bg-slate-400',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
