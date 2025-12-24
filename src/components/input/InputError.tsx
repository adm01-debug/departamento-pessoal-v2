import { memo } from "react";
interface InputErrorProps { message?: string; }
export const InputError = memo(function InputError({ message }: InputErrorProps) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
});
