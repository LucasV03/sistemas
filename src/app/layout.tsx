import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "./providers/convex-provider";
import Sidebar from "../components/sidebar"; // Asegurate del casing del archivo

export const metadata: Metadata = {
  title: "Gestión de Transportes",
  description: "Sistema de transporte con Next.js + Convex",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-slate-50">
      <body className="text-slate-950 antialiased">
        <ConvexClientProvider>
          {/* Grid responsiva: 1 col en mobile, 16rem + 1fr en md+ */}
          <div className="min-h-screen grid grid-cols-1 md:grid-cols-[16rem_1fr] gap-3 p-3">
            <Sidebar />

            <div className="rounded-xl bg-blue-200  ring-slate-200 shadow-xl/100">
              <header className="rounded-t-xl bg-blue-600 px-6 py-4 text-white ">
                <h1 className="text-2xl md:text-3xl font-bold">
                  🚍 Sistema de Transporte 🚍
                </h1>
          
              </header>

              <main className="p-4 md:p-6">
                {children}
              </main>
            </div>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
