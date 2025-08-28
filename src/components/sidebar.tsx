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
    <aside className="hidden md:flex md:w-64 md:flex-col bg-[#1a1a1a]">
      {/* Logo */}
      <div className="flex items-center gap-3 text-white text-xl font-bold tracking-wide border-b border-gray-800 px-6 py-5.5">
        <Globe className="h-6 w-6 text-violet-500" />
        Panel
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-6 mt-8 px-4">
        {links.map(({ href, label, Icon }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex flex-col items-center justify-center rounded-md py-4 text-sm transition-colors relative",
                active
                  ? "bg-[#111111] text-white"
                  : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
              ].join(" ")}
            >
              {/* Icono más grande */}
              <Icon className="h-8 w-8 mb-1" />  
              {/* Texto debajo */}
              <span className="text-xs">{label}</span>  

              {/* Banda lateral violeta que se extiende a la derecha */}
              {active && (
                <span className="absolute inset-y-0 right-0 w-screen bg-[#111111] -z-10"></span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
