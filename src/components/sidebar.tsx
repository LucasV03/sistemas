'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Globe, Home, Car, Route, User, User2Icon, Users2Icon, Wrench, Paperclip, UserCheck2 } from 'lucide-react';

const links = [
  { href: '/',          label: 'Home',        Icon: Home },
  { href: '/usuarios',  label: 'Usuarios',    Icon: User },
  { href: '/empleados', label: 'Empleados',   Icon: User2Icon },
  { href: '/vehiculos', label: 'Vehículos',   Icon: Car },
  { href: '/viajes',    label: 'Viajes',      Icon: Route },
  { href: '/repuestos', label: 'Repuestos',   Icon: Wrench },
  { href: '/reportes',  label: 'Reportes',    Icon: Paperclip },
  { href: '/proveedores', label: 'Proveedores', Icon: Users2Icon },
  { href: '/clientes',  label: 'Clientes',    Icon: UserCheck2 },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col bg-[#1a1a1a] text-gray-300">
      {/* Logo */}
      <div className="flex items-center justify-center p-6 border-b border-gray-700">
        <Globe className="h-6 w-6 text-violet-500" />
        <span className="ml-2 text-lg font-bold text-white">Panel</span>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-6 mt-8 px-4">
        {links.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
  key={href}
  href={href}
  className={`flex flex-col items-center justify-center relative transition-colors 
    ${active ? 'text-white' : 'text-gray-400 hover:text-white'}`}
>
  {/* Icono más grande */}
  <Icon className="h-10 w-10" />  

  {/* Texto más grande */}
  <span className="text-base mt-2">{label}</span>  
</Link>

          );
        })}
      </nav>
    </aside>
  );
}
