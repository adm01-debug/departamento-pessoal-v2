// V14-049: PerfilForm.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera } from "lucide-react";

const perfilSchema = z.object({
  nome: z.string().min(2, "Nome obrigatório"),
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
  cargo: z.string().optional(),
  avatarUrl: z.string().optional(),
});

type PerfilFormData = z.infer<typeof perfilSchema>;

interface PerfilFormProps {
  defaultValues?: Partial<PerfilFormData>;
  onSubmit: (data: PerfilFormData) => void;
  onAvatarChange?: (file: File) => void;
  isLoading?: boolean;
}

export function PerfilForm({ defaultValues, onSubmit, onAvatarChange, isLoading }: PerfilFormProps) {
  const form = useForm<PerfilFormData>({
    resolver: zodResolver(perfilSchema),
    defaultValues: { nome: "", email: "", telefone: "", cargo: "", avatarUrl: "", ...defaultValues },
  });

  const initials = (form.watch("nome") || "U").split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onAvatarChange?.(file);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Foto de Perfil</CardTitle></CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={form.watch("avatarUrl")} />
                <AvatarFallback className="text-xl">{initials}</AvatarFallback>
              </Avatar>
              <label className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full cursor-pointer hover:bg-primary/90 transition-colors">
                <Camera className="h-4 w-4 text-primary-foreground" />
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Formatos: JPG, PNG ou GIF</p>
              <p>Tamanho máximo: 2MB</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Informações Pessoais</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <FormField control={form.control} name="nome" render={({ field }) => (
              <FormItem><FormLabel>Nome Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
            )} />
            <div className="grid grid-cols-2 gap-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="telefone" render={({ field }) => (
                <FormItem><FormLabel>Telefone</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <FormField control={form.control} name="cargo" render={({ field }) => (
              <FormItem><FormLabel>Cargo</FormLabel><FormControl><Input disabled {...field} /></FormControl><FormMessage /></FormItem>
            )} />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isLoading}>{isLoading ? "Salvando..." : "Salvar Alterações"}</Button>
        </div>
      </form>
    </Form>
  );
}

