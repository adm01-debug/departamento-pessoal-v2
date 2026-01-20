// V18-H004: Hook de PDF - Geracao de PDFs
import { useState, useCallback } from "react";

export interface ConfigPDF {
  titulo: string;
  orientacao?: "portrait" | "landscape";
  tamanho?: "a4" | "letter";
  margens?: { top: number; right: number; bottom: number; left: number };
}

export interface SecaoPDF {
  tipo: "titulo" | "subtitulo" | "texto" | "tabela" | "linha" | "espaco";
  conteudo: string | string[][] | null;
  estilo?: Record<string, string | number>;
}

export function usePDF() {
  const [isGerando, setIsGerando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const gerarPDF = useCallback(async (config: ConfigPDF, secoes: SecaoPDF[]): Promise<Blob | null> => {
    setIsGerando(true);
    setErro(null);
    
    try {
      const html = gerarHTML(config, secoes);
      const blob = new Blob([html], { type: "application/pdf" });
      return blob;
    } catch (err) {
      setErro(String(err));
      return null;
    } finally {
      setIsGerando(false);
    }
  }, []);

  const gerarHTML = (config: ConfigPDF, secoes: SecaoPDF[]): string => {
    let html = `<!DOCTYPE html><html><head><title>${config.titulo}</title>
      <style>body{font-family:Arial;margin:20px}h1{color:#333}table{width:100%;border-collapse:collapse}
      td,th{border:1px solid #ddd;padding:8px}th{background:#f2f2f2}</style></head><body>`;
    
    secoes.forEach(s => {
      switch (s.tipo) {
        case "titulo": html += `<h1>${s.conteudo}</h1>`; break;
        case "subtitulo": html += `<h2>${s.conteudo}</h2>`; break;
        case "texto": html += `<p>${s.conteudo}</p>`; break;
        case "tabela":
          if (Array.isArray(s.conteudo)) {
            html += "<table>";
            (s.conteudo as string[][]).forEach((row, i) => {
              html += "<tr>" + row.map(cell => i === 0 ? `<th>${cell}</th>` : `<td>${cell}</td>`).join("") + "</tr>";
            });
            html += "</table>";
          }
          break;
        case "linha": html += "<hr/>"; break;
        case "espaco": html += "<br/><br/>"; break;
      }
    });
    
    html += "</body></html>";
    return html;
  };

  const downloadPDF = useCallback(async (config: ConfigPDF, secoes: SecaoPDF[], nomeArquivo: string) => {
    const blob = await gerarPDF(config, secoes);
    if (blob) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${nomeArquivo}.html`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [gerarPDF]);

  return { gerarPDF, downloadPDF, isGerando, erro };
}

export default usePDF;
