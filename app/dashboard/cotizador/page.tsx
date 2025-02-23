"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Plus, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for rubros - this would come from your database
const rubros = [
  { id: 1, name: "Excavación", unit: "m³", price: 150 },
  { id: 2, name: "Hormigón", unit: "m³", price: 200 },
  { id: 3, name: "Encofrado", unit: "m²", price: 80 },
];

const projectFormSchema = z.object({
  projectName: z.string().min(1, "El nombre del proyecto es requerido"),
  client: z.string().min(1, "El cliente es requerido"),
  estimatedDate: z.string().min(1, "La fecha estimada es requerida"),
  location: z.string().min(1, "La ubicación es requerida"),
});

const itemFormSchema = z.object({
  stage: z.string().min(1, "La etapa es requerida"),
  rubro: z.string().min(1, "El rubro es requerido"),
  quantity: z.number().min(0.01, "La cantidad debe ser mayor a 0"),
});

type ProjectForm = z.infer<typeof projectFormSchema>;
type ItemForm = z.infer<typeof itemFormSchema>;

interface StageItem extends ItemForm {
  unit: string;
  price: number;
  rubroName: string;
  total: number;
}

interface Stage {
  name: string;
  items: StageItem[];
  total: number;
}

export default function CotizadorPage() {
  const [step, setStep] = useState<"project" | "items">("project");
  const [selectedRubro, setSelectedRubro] = useState<typeof rubros[0] | null>(null);
  const [currentItems, setCurrentItems] = useState<StageItem[]>([]);
  const [stages, setStages] = useState<Stage[]>([]);
  const [projectData, setProjectData] = useState<ProjectForm | null>(null);

  const projectForm = useForm<ProjectForm>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      projectName: "",
      client: "",
      estimatedDate: "",
      location: "",
    },
  });

  const itemForm = useForm<ItemForm>({
    resolver: zodResolver(itemFormSchema),
    defaultValues: {
      stage: "",
      rubro: "",
      quantity: 0,
    },
  });

  function onProjectSubmit(data: ProjectForm) {
    setProjectData(data);
    setStep("items");
  }

  function onItemSubmit(data: ItemForm) {
    if (selectedRubro) {
      const newItem: StageItem = {
        ...data,
        unit: selectedRubro.unit,
        price: selectedRubro.price,
        rubroName: selectedRubro.name,
        total: data.quantity * selectedRubro.price,
      };
      setCurrentItems([...currentItems, newItem]);
      itemForm.reset({
        ...itemForm.getValues(),
        rubro: "",
        quantity: 0,
      });
      setSelectedRubro(null);
    }
  }

  function onRubroChange(rubroId: string) {
    const rubro = rubros.find((r) => r.id.toString() === rubroId);
    setSelectedRubro(rubro || null);
  }

  function saveStage() {
    if (currentItems.length > 0) {
      const stageName = currentItems[0].stage;
      const stageTotal = currentItems.reduce((sum, item) => sum + item.total, 0);
      
      setStages([...stages, {
        name: stageName,
        items: currentItems,
        total: stageTotal,
      }]);
      
      setCurrentItems([]);
      itemForm.reset();
    }
  }

  const totalBudget = stages.reduce((sum, stage) => sum + stage.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Cotizador</h1>
      
      {step === "project" ? (
        <Card>
          <CardHeader>
            <CardTitle>Información del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...projectForm}>
              <form onSubmit={projectForm.handleSubmit(onProjectSubmit)} className="space-y-4">
                <FormField
                  control={projectForm.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Proyecto</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre del proyecto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={projectForm.control}
                  name="client"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese el nombre del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={projectForm.control}
                  name="estimatedDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha Estimada</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={projectForm.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ubicación</FormLabel>
                      <FormControl>
                        <Input placeholder="Ingrese la ubicación" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">Siguiente</Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {projectData && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Proyecto</p>
                    <p className="font-medium">{projectData.projectName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cliente</p>
                    <p className="font-medium">{projectData.client}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fecha Estimada</p>
                    <p className="font-medium">{projectData.estimatedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ubicación</p>
                    <p className="font-medium">{projectData.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Agregar Rubros</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...itemForm}>
                <form onSubmit={itemForm.handleSubmit(onItemSubmit)} className="space-y-4">
                  <FormField
                    control={itemForm.control}
                    name="stage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Etapa</FormLabel>
                        <FormControl>
                          <Input placeholder="Ingrese la etapa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={itemForm.control}
                    name="rubro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Rubro</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          onRubroChange(value);
                        }}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione un rubro" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {rubros.map((rubro) => (
                              <SelectItem key={rubro.id} value={rubro.id.toString()}>
                                {rubro.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={itemForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cantidad</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01"
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                            value={field.value}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>Unidad</FormLabel>
                      <Input 
                        value={selectedRubro?.unit || ""} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                    <div>
                      <FormLabel>Precio</FormLabel>
                      <Input 
                        value={selectedRubro?.price || ""} 
                        disabled 
                        className="bg-gray-50"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Button type="submit" className="flex-1">
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar Rubro
                    </Button>
                    {currentItems.length > 0 && (
                      <Button type="button" onClick={saveStage} variant="secondary" className="flex-1">
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Etapa
                      </Button>
                    )}
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>

          {currentItems.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Rubros de la Etapa Actual</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rubro</TableHead>
                      <TableHead>Cantidad</TableHead>
                      <TableHead>Unidad</TableHead>
                      <TableHead>Precio Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentItems.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.rubroName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell>${item.price}</TableCell>
                        <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}

          {stages.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Presupuesto</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {stages.map((stage, index) => (
                    <div key={index} className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Etapa: {stage.name}</h3>
                        <p className="text-lg font-semibold">Total: ${stage.total.toFixed(2)}</p>
                      </div>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Rubro</TableHead>
                            <TableHead>Cantidad</TableHead>
                            <TableHead>Unidad</TableHead>
                            <TableHead>Precio Unit.</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {stage.items.map((item, itemIndex) => (
                            <TableRow key={itemIndex}>
                              <TableCell>{item.rubroName}</TableCell>
                              <TableCell>{item.quantity}</TableCell>
                              <TableCell>{item.unit}</TableCell>
                              <TableCell>${item.price}</TableCell>
                              <TableCell className="text-right">${item.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ))}
                  <div className="pt-6 border-t">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-bold">Presupuesto Total</h3>
                      <p className="text-xl font-bold">${totalBudget.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}