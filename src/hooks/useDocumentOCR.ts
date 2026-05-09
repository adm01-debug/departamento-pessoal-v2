import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export type OCRResult = {
  valid: boolean;
  confidence: number;
  extractedData?: {
    nome?: string;
    cpf?: string;
    data_nascimento?: string;
    rg?: string;
    pai?: string;
    mae?: string;
  };
  error?: string;
};

export function useDocumentOCR() {
  const [isProcessing, setIsProcessing] = useState(false);

  const processDocument = async (file: File, docType: 'rg' | 'cpf' | 'cnh' | 'residencia'): Promise<OCRResult> => {
    setIsProcessing(true);
    try {
      // In a real scenario, we would upload to storage and then call an edge function with OCR
      // For this "State of the Art" implementation, we simulate the call to the Lovable AI Gateway 
      // via an Edge Function that uses Gemini to analyze the document.
      
      const { data, error } = await supabase.functions.invoke('process-document-ocr', {
        body: { 
          fileName: file.name,
          contentType: file.type,
          docType: docType
        },
      });

      if (error) throw error;
      
      return data as OCRResult;
    } catch (err: any) {
      console.error('OCR Error:', err);
      return {
        valid: false,
        confidence: 0,
        error: 'Não foi possível processar o documento automaticamente.'
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return { processDocument, isProcessing };
}
