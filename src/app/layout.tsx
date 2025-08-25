import type { Metadata } from "next";
import "./globals.css";
import ConvexClientProvider from "./providers/convex-provider";
import Sidebar from "@/components/sidebar";

export const metadata: Metadata = {
  title: "Gestión Transporte",
  description: "Sistema de transporte con Next.js + Convex",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className="bg-slate-50">
      <body className="text-slate-950">
        <ConvexClientProvider>
          <div className="min-h-screen p-3 md:flex">
            <Sidebar />

            <div className="flex-2 bg-slate-800 ml-2 rounded-xl">
              <header className="p-2 ">
                <h1 className="  text-3xl font-bold mb-2 mt-4 pl-150 text-white">🚍 Sistema de Transporte 🚍</h1>  
              </header>

              <main className="px-6 pb-12">
                {children}
              </main>

              
            </div>
          </div>
        </ConvexClientProvider>
      </body>
    </html>
  );
}


