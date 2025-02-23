"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  unit: z.string().min(1, "La unidad es requerida"),
  price: z.number().min(0.01, "El precio debe ser mayor a 0"),
});

// Available units for the select field
const units = [
  { value: "m2", label: "Metro cuadrado (m²)" },
  { value: "m3", label: "Metro cúbico (m³)" },
  { value: "ml", label: "Metro lineal (ml)" },
  { value: "kg", label: "Kilogramo (kg)" },
  { value: "un", label: "Unidad (un)" },
];

interface Rubro {
  id: number;
  name: string;
  unit: string;
  price: number;
  createdAt: Date;
}

export default function RubrosPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [rubros, setRubros] = useState<Rubro[]>([
    {
      id: 1,
      name: "Excavación",
      unit: "m3",
      price: 150,
      createdAt: new Date("2024-03-01"),
    },
    {
      id: 2,
      name: "Hormigón",
      unit: "m3",
      price: 200,
      createdAt: new Date("2024-03-02"),
    },
    {
      id: 3,
      name: "Encofrado",
      unit: "m2",
      price: 80,
      createdAt: new Date("2024-03-03"),
    },
  ]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      unit: "",
      price: 0,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newRubro: Rubro = {
      id: rubros.length + 1,
      name: values.name,
      unit: values.unit,
      price: values.price,
      createdAt: new Date(),
    };
    setRubros([...rubros, newRubro]);
    form.reset();
    setIsOpen(false);
  }

  const filteredRubros = rubros.filter((rubro) =>
    rubro.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleDelete(id: number) {
    if (confirm("¿Está seguro que desea eliminar este rubro?")) {
      setRubros(rubros.filter((rubro) => rubro.id !== id));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Rubros</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Rubro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Nuevo Rubro</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre del rubro" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidad</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccione una unidad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Ingrese el precio"
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Guardar</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Buscar rubros..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Unidad</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Fecha Creada</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRubros.map((rubro) => (
              <TableRow key={rubro.id}>
                <TableCell className="font-medium">{rubro.name}</TableCell>
                <TableCell>{rubro.unit}</TableCell>
                <TableCell>${rubro.price.toFixed(2)}</TableCell>
                <TableCell>{format(rubro.createdAt, "dd/MM/yyyy")}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(rubro.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}