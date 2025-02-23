"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Pencil } from "lucide-react";

const projects = [
  {
    id: "PRJ001",
    name: "Construcción Residencial Torres del Valle",
    client: "Inmobiliaria Valle Verde",
    budget: "$850,000",
  },
  {
    id: "PRJ002",
    name: "Renovación Edificio Comercial Centro",
    client: "Comercial Plaza SA",
    budget: "$420,000",
  },
  {
    id: "PRJ003",
    name: "Infraestructura Parque Industrial",
    client: "Desarrollo Industrial Norte",
    budget: "$1,200,000",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Proyectos</h1>
        <Button>Nuevo Proyecto</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Proyecto</TableHead>
            <TableHead>Proyecto</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Monto Presupuesto</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.id}</TableCell>
              <TableCell>{project.name}</TableCell>
              <TableCell>{project.client}</TableCell>
              <TableCell>{project.budget}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}