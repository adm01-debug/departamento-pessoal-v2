const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export function validateEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}
export function extractDomain(email: string): string {
  const parts = email.split("@");
  return parts[1] || "";
}
export function isDisposableEmail(email: string): boolean {
  const disposable = ["tempmail", "guerrilla", "mailinator", "10minutemail"];
  const domain = extractDomain(email).toLowerCase();
  return disposable.some(d => domain.includes(d));
}
export default { validateEmail, normalizeEmail, extractDomain, isDisposableEmail };
