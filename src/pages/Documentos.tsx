import { SEOHead } from '@/components/SEOHead';
import { FileText, Upload, Download, Trash2, Search, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Documentos() {
  return (
    <>
      <SEOHead 
        title="Documentos | DP System" 
        description="Gestão de documentos dos colaboradores" 
      />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Documentos</h1>
            <p className="text-muted-foreground">
              Gerencie os documentos dos colaboradores
            </p>
          </div>
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload Documento
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentos Armazenados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar documentos..." className="pl-10" />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filtrar
              </Button>
            </div>
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <p>Nenhum documento encontrado</p>
              <p className="text-sm">Faça upload de documentos para começar</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
