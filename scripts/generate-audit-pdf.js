import { jsPDF } from 'jspdf';
import fs from 'fs';

const generatePDF = () => {
  try {
    const mdContent = fs.readFileSync('AUDIT_REPORT.md', 'utf8');
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text('Auditoria Enterprise e Inventário de Funcionalidades', 10, 20);
    
    doc.setFontSize(10);
    const lines = doc.splitTextToSize(mdContent, 180);
    doc.text(lines, 10, 30);
    
    const pdfOutput = doc.output('arraybuffer');
    fs.writeFileSync('AUDIT_REPORT.pdf', Buffer.from(pdfOutput));
    console.log('AUDIT_REPORT.pdf gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    process.exit(1);
  }
};

generatePDF();
