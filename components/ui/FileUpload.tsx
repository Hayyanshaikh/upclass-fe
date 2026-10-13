"use client";

import { useState } from "react";
import { Form, Upload } from "antd";
import type { UploadChangeParam } from "antd/es/upload/interface";
import Button from "@/components/ui/Button";
import type { FileUploadProps } from "@/types/file-upload";

export default function FileUpload({ name, maxSizeMB = 5 }: FileUploadProps) {
  const [error, setError] = useState("");

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <Form.Item name={name} valuePropName="fileList"
          getValueFromEvent={(event: UploadChangeParam) => event.fileList}>
          <Upload accept=".pdf,image/*" maxCount={1}
            beforeUpload={(file) => {
              const allowedType = file.type === "application/pdf" || file.type.startsWith("image/") || (!file.type && file.name.toLowerCase().endsWith(".pdf"));
              if (!allowedType || file.size > maxSizeMB * 1024 * 1024) {
                setError(`Choose a PDF or image up to ${maxSizeMB} MB.`);
                return Upload.LIST_IGNORE;
              }
              setError("");
              return false;
            }} onRemove={() => setError("")}>
            <Button variant="secondary">Attach file</Button>
          </Upload>
        </Form.Item>
        <p className="text-sm text-gray">PDF or image, up to {maxSizeMB} MB</p>
      </div>
      {error && <p role="alert" className="mt-2 text-xs text-danger">{error}</p>}
    </div>
  );
}
