"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "antd";
import { LuUpload } from "react-icons/lu";
import type { PhotoUploadProps } from "@/types/photo-upload";

export default function PhotoUpload({ value, onChange, alt = "Photo preview" }: PhotoUploadProps) {
  const [error, setError] = useState("");

  return (
    <div>
      <Upload
        accept="image/png,image/jpeg,image/webp"
        showUploadList={false}
        beforeUpload={(file) => {
          if (!["image/png", "image/jpeg", "image/webp"].includes(file.type) || file.size > 5 * 1024 * 1024) {
            setError("Choose a JPG, PNG or WebP image under 5 MB.");
            return Upload.LIST_IGNORE;
          }
          const reader = new FileReader();
          reader.onload = () => { setError(""); onChange?.(String(reader.result)); };
          reader.onerror = () => setError("Could not read this photo. Please try again.");
          reader.readAsDataURL(file);
          return false;
        }}
      >
        <button type="button" className="flex size-32 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-gray/50 bg-background text-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {value ? <Image src={value} alt={alt} width={128} height={128} unoptimized className="size-full object-cover" /> : <><LuUpload size={24} aria-hidden="true" /><span className="text-xs">Upload photo</span></>}
        </button>
      </Upload>
      {error && <p role="alert" className="mt-2 max-w-32 text-xs text-danger">{error}</p>}
    </div>
  );
}
