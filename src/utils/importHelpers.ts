// V20-UTIL002: Import Helpers
export const parseCSV = (content: string): Record<string, string>[] => {
  const lines = content.split("
");
  const headers = lines[0].split(",").map(h => h.trim());
  return lines.slice(1).filter(line => line.trim()).map(line => {
    const values = line.split(",");
    return headers.reduce((obj, header, i) => {
      obj[header] = values[i]?.trim() || "";
      return obj;
    }, {} as Record<string, string>);
  });
};

export const validateImportData = (data: any[], requiredFields: string[]) => {
  const errors: string[] = [];
  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field]) errors.push(\`Linha \${index + 1}: Campo \${field} obrigatorio\`);
    });
  });
  return { valid: errors.length === 0, errors };
};
