import React, { useState } from 'react';
import { useDocumentos } from '@/hooks/useDocumentos';
import { PageLayout } from '@/components/layout/PageLayout';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DocumentoList } from '@/components/lists/DocumentoList';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Upload, AlertTriangle } from 'lucide-react';

export default function DocumentosPage() {
  const { data: documentos, isLoading } = useDocumentos();
  const vencidos = documentos?.filter((d: any) => d.status === 'vencido') || [];

  if (isLoading) return <LoadingSpinner />;

  return (
    <PageLayout>
      <PageHeader
        title="Documentos"
        description="Gestão de documentos dos colaboradores"
        actions={
          <Button>
            <Upload className="w-4 h-4 mr-2" />
            Upload
          </Button>
        }
      />
      {vencidos.length > 0 && (
        <Card className="mb-4 border-warning">
          <CardContent className="flex items-center gap-4 pt-4">
            <AlertTriangle className="w-8 h-8 text-warning" />
            <div>
              <p className="font-medium">
                {vencidos.length} documento(s) vencido(s)
              </p>
              <p className="text-sm text-muted-foreground">
                Atualize os documentos vencidos
              </p>
            </div>
          </CardContent>
        </Card>
      )}
      <Card>
        <CardContent className="p-0">
          <DocumentoList documentos={documentos || []} />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
