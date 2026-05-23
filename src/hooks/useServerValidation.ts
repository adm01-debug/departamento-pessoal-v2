import { FieldValues, UseFormSetError, Path } from 'react-hook-form';
import { toast } from 'sonner';

interface ValidationErrorField {
  field: string;
  message: string;
}

interface ServerErrorResponse {
  error: {
    code: string;
    message: string;
    fields?: ValidationErrorField[];
  };
}

export function useServerValidation<T extends FieldValues>() {
  const handleServerError = (error: any, setError: UseFormSetError<T>) => {
    // Check if it's a standard error response from our contract
    const serverError = error?.response?.data || error?.data || error;
    
    if (serverError?.error?.code === 'VALIDATION_ERROR' && serverError.error.fields) {
      serverError.error.fields.forEach((err: ValidationErrorField) => {
        // Map field to react-hook-form path
        setError(err.field as Path<T>, {
          type: 'server',
          message: err.message,
        });
      });
      
      toast.error('Verifique os campos destacados no formulário.');
      return true;
    }

    // Fallback for other errors
    const message = serverError?.error?.message || serverError?.message || 'Ocorreu um erro inesperado.';
    toast.error(message);
    return false;
  };

  return { handleServerError };
}
