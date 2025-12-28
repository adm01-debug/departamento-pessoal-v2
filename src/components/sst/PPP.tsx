import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface PPPProps {
  empresaId?: string;
  onSave?: (data: Record<string, unknown>) => void;
}

export function PPP({ empresaId, onSave }: PPPProps) {
  const [activeTab, setActiveTab] = useState('geral');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      onSave?.({});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>PPP - Saúde e Segurança do Trabalho</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="geral">Geral</TabsTrigger>
            <TabsTrigger value="riscos">Riscos</TabsTrigger>
            <TabsTrigger value="medidas">Medidas</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>
          <TabsContent value="geral">
            <div className="space-y-4 py-4">
              {/* General content */}
            </div>
          </TabsContent>
          <TabsContent value="riscos">
            <div className="space-y-4 py-4">
              {/* Risks content */}
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default PPP;
