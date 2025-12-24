import { memo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
interface FileUploadProps { label?: string; accept?: string; onChange: (files: FileList | null) => void; multiple?: boolean; }
export const FileUpload = memo(function FileUpload({ label, accept, onChange, multiple }: FileUploadProps) {
  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Input type="file" accept={accept} onChange={e => onChange(e.target.files)} multiple={multiple} />
    </div>
  );
});
