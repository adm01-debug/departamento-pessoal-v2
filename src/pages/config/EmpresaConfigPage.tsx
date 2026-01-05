import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/ui/page-header";
import { Save, Building2 } from "lucide-react";
export function EmpresaConfigPage() {
  return (<div className="space-y-6"><PageHeader title="Configurações da Empresa" description="Dados cadastrais e parâmetros"><Button><Save className="h-4 w-4 mr-2" />Salvar</Button></PageHeader><div className="grid gap-6"><Card><CardHeader><CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Dados Cadastrais</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-2 gap-4"><div><Label>Razão Social</Label><Input defaultValue="Empresa Exemplo LTDA" /></div><div><Label>Nome Fantasia</Label><Input defaultValue="Empresa Exemplo" /></div></div><div className="grid grid-cols-3 gap-4"><div><Label>CNPJ</Label><Input defaultValue="00.000.000/0001-00" /></div><div><Label>Inscrição Estadual</Label><Input defaultValue="123456789" /></div><div><Label>Inscrição Municipal</Label><Input defaultValue="987654321" /></div></div></CardContent></Card><Card><CardHeader><CardTitle>Endereço</CardTitle></CardHeader><CardContent className="space-y-4"><div className="grid grid-cols-4 gap-4"><div><Label>CEP</Label><Input defaultValue="01234-567" /></div><div className="col-span-2"><Label>Logradouro</Label><Input defaultValue="Av. Principal" /></div><div><Label>Número</Label><Input defaultValue="1000" /></div></div><div className="grid grid-cols-3 gap-4"><div><Label>Bairro</Label><Input defaultValue="Centro" /></div><div><Label>Cidade</Label><Input defaultValue="São Paulo" /></div><div><Label>UF</Label><Input defaultValue="SP" /></div></div></CardContent></Card></div></div>);
}
export default EmpresaConfigPage;
