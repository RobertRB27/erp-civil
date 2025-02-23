"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HomeIcon, HistoryIcon, CalculatorIcon, FolderIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar className="w-64" />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}

function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className={cn("border-r bg-gray-100/40", className)}>
      <div className="flex h-full flex-col">
        <div className="flex h-14 items-center border-b px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
            <HomeIcon className="h-6 w-6" />
            <span>Dashboard</span>
          </Link>
        </div>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-2 p-4">
            <Button
              variant={pathname === "/dashboard" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/dashboard">
                <HomeIcon className="h-4 w-4" />
                Inicio
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/historico" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/dashboard/historico">
                <HistoryIcon className="h-4 w-4" />
                Histórico de Proyectos
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/cotizador" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/dashboard/cotizador">
                <CalculatorIcon className="h-4 w-4" />
                Cotizador
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/rubros" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/dashboard/rubros">
                <FolderIcon className="h-4 w-4" />
                Rubros
              </Link>
            </Button>
            <Button
              variant={pathname === "/dashboard/precios" ? "secondary" : "ghost"}
              className="w-full justify-start gap-2"
              asChild
            >
              <Link href="/dashboard/precios">
                <DollarSignIcon className="h-4 w-4" />
                Precios
              </Link>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}