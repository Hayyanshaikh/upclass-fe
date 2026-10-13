"use client";

import { useState } from "react";
import { Upload } from "antd";
import Image from "next/image";
import { LuUpload } from "react-icons/lu";

export default function ImageUpload({ value, onChange }: { value?: string; onChange?: (value: string) => void }) {
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Upload
        accept="image/png,image/jpeg"
        showUploadList={false}
        beforeUpload={(file) => {
          if (!["image/png", "image/jpeg"].includes(file.type) || file.size > 2 * 1024 * 1024) {
            setError("Choose a PNG or JPG image up to 2 MB.");
            return Upload.LIST_IGNORE;
          }
          setFileName(file.name);
          setError("");
          const reader = new FileReader();
          reader.onload = () => onChange?.(String(reader.result));
          reader.onerror = () => setError("The logo could not be read.");
          reader.readAsDataURL(file);
          return false;
        }}
      >
        <span className="flex size-20 cursor-pointer items-center justify-center rounded-lg border border-dashed border-border text-primary transition hover:border-primary" aria-label="Choose school logo">
          {value ? <Image src={value} alt="School logo preview" width={80} height={80} unoptimized className="size-full rounded-lg object-contain p-2" /> : <LuUpload size={24} aria-hidden="true" />}
        </span>
      </Upload>
      <div className="text-sm text-gray">
        <p>Logo appears on receipts, result cards and the login page. PNG or JPG, up to 2 MB.</p>
        {fileName && <p className="mt-1 font-semibold text-primary">Selected: {fileName}</p>}
        {error && <p className="mt-1 text-danger" role="alert">{error}</p>}
      </div>
    </div>
  );
}
