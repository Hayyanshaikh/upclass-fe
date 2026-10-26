"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Upload } from "antd";
import { LuUpload } from "react-icons/lu";
import type { PhotoUploadProps } from "@/types/photo-upload";

export default function PhotoUpload({
  value,
  onChange,
  alt = "Photo preview",
  maxSizeMB = 5,
}: PhotoUploadProps) {
  const [error, setError] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const imageSrc = value instanceof File ? previewUrl : value;

  // Decimal conversion: 1 MB = 1,000,000 bytes
  const maxSizeBytes = maxSizeMB * 1_000_000;

  const maxSizeLabel =
    maxSizeMB < 1 ? `${Math.round(maxSizeMB * 1000)}KB` : `${maxSizeMB}MB`;

  return (
    <div>
      <Upload
        accept="image/png,image/jpeg,image/webp"
        showUploadList={false}
        beforeUpload={(file) => {
          const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

          if (!allowedTypes.includes(file.type)) {
            setError("Choose a JPG, PNG or WebP image.");
            return Upload.LIST_IGNORE;
          }

          if (file.size > maxSizeBytes) {
            setError(`Image must be under ${maxSizeLabel}.`);
            return Upload.LIST_IGNORE;
          }

          setError("");
          setPreviewUrl(URL.createObjectURL(file));
          onChange?.(file);

          return false;
        }}
      >
        <button
          type="button"
          className="flex size-32 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-gray/50 bg-background text-gray focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          {imageSrc ? (
            <Image
              src={imageSrc}
              alt={alt}
              width={128}
              height={128}
              unoptimized
              className="size-full object-cover"
            />
          ) : (
            <>
              <LuUpload size={24} aria-hidden="true" />
              <span className="text-xs">Upload photo</span>
            </>
          )}
        </button>
      </Upload>

      {error && (
        <p role="alert" className="mt-2 max-w-32 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
