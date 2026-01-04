export function formatFileSize(bytes: number): string { if (bytes === 0) return "0 Bytes"; const k = 1024; const sizes = ["Bytes", "KB", "MB", "GB"]; const i = Math.floor(Math.log(bytes) / Math.log(k)); return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]; }
export function getFileExtension(filename: string): string { return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2); }
export function isImageFile(filename: string): boolean { return ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(getFileExtension(filename).toLowerCase()); }
export function isDocumentFile(filename: string): boolean { return ["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt"].includes(getFileExtension(filename).toLowerCase()); }
export function generateUniqueFilename(filename: string): string { const ext = getFileExtension(filename); const name = filename.replace("." + ext, ""); return name + "_" + Date.now() + "." + ext; }
export default { formatFileSize, getFileExtension, isImageFile, isDocumentFile, generateUniqueFilename };
