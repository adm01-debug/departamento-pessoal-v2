import { memo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useEmpresas, type Empresa } from "@/hooks/useEmpresas";
import { useConsultaCNPJ } from "@/hooks/useConsultaCNPJ";
import { Building2, Plus, Search, Star, StarOff, Edit2, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const EmpresaModal = memo(function EmpresaModal({ open, onOpenChange }: Props) {
  const {
    userEmpresas,
    todasEmpresas,
    criarEmpresa,
    atualizarEmpresa,
    definirEmpresaPadrao,
    associarUsuario,
  } = useEmpresas();
  
  const { consultar, loading: consultandoCNPJ } = useConsultaCNPJ();
  
  const [tab, setTab] = useState<"minhas" | "criar">("minhas");
  const [editando, setEditando] = useState<Empresa | null>(null);
  const [form, setForm] = useState({
    cnpj: "",
    razao_social: "",
    nome_fantasia: "",
    inscricao_estadual: "",
    inscricao_municipal: "",
    cep: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    telefone: "",
    email: "",
  });

  const resetForm = () => {
    setForm({
      cnpj: "",
      razao_social: "",
      nome_fantasia: "",
      inscricao_estadual: "",
      inscricao_municipal: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      telefone: "",
      email: "",
    });
    setEditando(null);
  };

  const handleConsultarCNPJ = async () => {
    const dados = await consultar(form.cnpj);
    if (dados) {
      setForm({
        ...form,
        razao_social: dados.razao_social || form.razao_social,
        nome_fantasia: dados.nome_fantasia || form.nome_fantasia,
        logradouro: dados.logradouro || form.logradouro,
        numero: dados.numero || form.numero,
        complemento: dados.complemento || form.complemento,
        bairro: dados.bairro || form.bairro,
        cidade: dados.cidade || form.cidade,
        uf: dados.uf || form.uf,
        cep: dados.cep || form.cep,
        telefone: dados.telefone || form.telefone,
        email: dados.email || form.email,
      });
      toast.success("Dados do CNPJ carregados!");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.razao_social) {
      toast.error("Razão social é obrigatória");
      return;
    }

    if (editando) {
      atualizarEmpresa({ id: editando.id, dados: { ...form, logo_url: null, ativa: true } });
    } else {
      criarEmpresa({ ...form, logo_url: null, ativa: true });
    }
    
    resetForm();
    setTab("minhas");
  };

  const handleEditar = (empresa: Empresa) => {
    setEditando(empresa);
    setForm({
      cnpj: empresa.cnpj || "",
      razao_social: empresa.razao_social || "",
      nome_fantasia: empresa.nome_fantasia || "",
      inscricao_estadual: empresa.inscricao_estadual || "",
      inscricao_municipal: empresa.inscricao_municipal || "",
      cep: empresa.cep || "",
      logradouro: empresa.logradouro || "",
      numero: empresa.numero || "",
      complemento: empresa.complemento || "",
      bairro: empresa.bairro || "",
      cidade: empresa.cidade || "",
      uf: empresa.uf || "",
      telefone: empresa.telefone || "",
      email: empresa.email || "",
    });
    setTab("criar");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Gerenciar Empresas
          </DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as "minhas" | "criar")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="minhas">Minhas Empresas</TabsTrigger>
            <TabsTrigger value="criar">
              {editando ? "Editar Empresa" : "Nova Empresa"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="minhas">
            <ScrollArea className="h-[400px] pr-4">
              {!userEmpresas || userEmpresas.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Building2 className="h-12 w-12 mx-auto mb-4 opacity-30" />
                  <p>Nenhuma empresa cadastrada</p>
                  <Button
                    variant="link"
                    onClick={() => setTab("criar")}
                    className="mt-2"
                  >
                    Cadastrar primeira empresa
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {userEmpresas.map((ue) => (
                    <div
                      key={ue.id}
                      className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:border-primary/30 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium truncate">
                            {ue.empresa?.nome_fantasia || ue.empresa?.razao_social}
                          </p>
                          {ue.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Padrão
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {ue.empresa?.cnpj || "CNPJ não informado"}
                        </p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => definirEmpresaPadrao.mutate(ue.empresa_id)}
                          title={ue.is_default ? "Empresa padrão" : "Definir como padrão"}
                        >
                          {ue.is_default ? (
                            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                          ) : (
                            <StarOff className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => ue.empresa && handleEditar(ue.empresa)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
            <div className="mt-4 flex justify-end">
              <Button onClick={() => { resetForm(); setTab("criar"); }}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Empresa
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="criar">
            <form onSubmit={handleSubmit}>
              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-4">
                  {/* CNPJ com consulta */}
                  <div className="flex gap-2">
                    <div className="flex-1 space-y-2">
                      <Label>CNPJ</Label>
                      <Input
                        value={form.cnpj}
                        onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                        placeholder="00.000.000/0000-00"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-8"
                      onClick={handleConsultarCNPJ}
                      disabled={consultandoCNPJ || !form.cnpj}
                    >
                      {consultandoCNPJ ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Search className="h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Razão Social *</Label>
                      <Input
                        value={form.razao_social}
                        onChange={(e) => setForm({ ...form, razao_social: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Nome Fantasia</Label>
                      <Input
                        value={form.nome_fantasia}
                        onChange={(e) => setForm({ ...form, nome_fantasia: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Inscrição Estadual</Label>
                      <Input
                        value={form.inscricao_estadual}
                        onChange={(e) => setForm({ ...form, inscricao_estadual: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Inscrição Municipal</Label>
                      <Input
                        value={form.inscricao_municipal}
                        onChange={(e) => setForm({ ...form, inscricao_municipal: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>CEP</Label>
                      <Input
                        value={form.cep}
                        onChange={(e) => setForm({ ...form, cep: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label>Logradouro</Label>
                      <Input
                        value={form.logradouro}
                        onChange={(e) => setForm({ ...form, logradouro: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Número</Label>
                      <Input
                        value={form.numero}
                        onChange={(e) => setForm({ ...form, numero: e.target.value })}
                      />
                    </div>
                    <div className="col-span-3 space-y-2">
                      <Label>Complemento</Label>
                      <Input
                        value={form.complemento}
                        onChange={(e) => setForm({ ...form, complemento: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Bairro</Label>
                      <Input
                        value={form.bairro}
                        onChange={(e) => setForm({ ...form, bairro: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Cidade</Label>
                      <Input
                        value={form.cidade}
                        onChange={(e) => setForm({ ...form, cidade: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>UF</Label>
                      <Input
                        value={form.uf}
                        onChange={(e) => setForm({ ...form, uf: e.target.value })}
                        maxLength={2}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Telefone</Label>
                      <Input
                        value={form.telefone}
                        onChange={(e) => setForm({ ...form, telefone: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <div className="mt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => { resetForm(); setTab("minhas"); }}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={criarEmpresa.isPending || atualizarEmpresa.isPending}>
                  {editando ? "Salvar Alterações" : "Criar Empresa"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
});