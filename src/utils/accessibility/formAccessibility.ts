// V20-A11Y002: Form Accessibility Utilities
import { useId } from "react";

export const useFormAccessibility = (label: string) => {
  const id = useId();
  const errorId = `${id}-error`;
  const descriptionId = `${id}-description`;

  return {
    inputProps: {
      id,
      "aria-label": label,
      "aria-describedby": descriptionId,
      "aria-invalid": false,
      "aria-errormessage": errorId,
    },
    labelProps: {
      htmlFor: id,
    },
    errorProps: {
      id: errorId,
      role: "alert" as const,
      "aria-live": "polite" as const,
    },
    descriptionProps: {
      id: descriptionId,
    },
  };
};

export const ariaLabels = {
  // Formulários
  cpf: "CPF do colaborador",
  nome: "Nome completo",
  email: "E-mail",
  telefone: "Telefone",
  dataNascimento: "Data de nascimento",
  dataAdmissao: "Data de admissão",
  salario: "Salário",
  cargo: "Cargo",
  departamento: "Departamento",
  // Botões
  salvar: "Salvar alterações",
  cancelar: "Cancelar",
  excluir: "Excluir registro",
  editar: "Editar registro",
  visualizar: "Visualizar detalhes",
  // Navegação
  menu: "Menu principal",
  fechar: "Fechar",
  voltar: "Voltar",
  proximo: "Próximo",
  anterior: "Anterior",
};

export default useFormAccessibility;
