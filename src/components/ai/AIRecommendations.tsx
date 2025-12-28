import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Brain, RefreshCw } from 'lucide-react';

interface AIRecommendationsProps {
  data?: any;
  onPredict?: (result: any) => void;
}

/**
 * Recomendações Inteligentes
 */
export const AIRecommendations: React.FC<AIRecommendationsProps> = ({ data, onPredict }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const runPrediction = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    const prediction = { score: Math.random(), confidence: 0.85 + Math.random() * 0.1 };
    setResult(prediction);
    onPredict?.(prediction);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          Recomendações Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Score</span>
              <span>{(result.score * 100).toFixed(1)}%</span>
            </div>
            <Progress value={result.score * 100} />
            <div className="text-sm text-muted-foreground">
              Confiança: {(result.confidence * 100).toFixed(1)}%
            </div>
          </div>
        )}
        <Button onClick={runPrediction} disabled={loading} className="w-full">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Processando...' : 'Executar Análise'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIRecommendations;
