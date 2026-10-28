"use client";

import { useState } from "react";
import { Form, Upload } from "antd";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import { LuUpload } from "react-icons/lu";
import type { FileUploadProps } from "@/types/file-upload";

interface StyledFileUploadProps extends FileUploadProps {
  label?: string;
  isRequird?: boolean;
}

export default function FileUpload({
  name,
  label,
  maxSizeMB = 5,
  isRequird = false,
}: StyledFileUploadProps) {
  const [error, setError] = useState("");

  return (
    <div className="w-full">
      <Form.Item
        className="w-full"
        layout="vertical"
        name={name}
        valuePropName="fileList"
        label={
          label ? <span className="font-semibold">{label}</span> : undefined
        }
        getValueFromEvent={(event: UploadChangeParam<UploadFile>) =>
          event.fileList
        }
        rules={
          isRequird
            ? [{ required: true, message: `${label || "File"} is required` }]
            : undefined
        }
      >
        <Upload.Dragger
          accept=".pdf,image/*"
          className="w-full [&_.ant-upload]:bg-transparent! [&_.ant-upload]:p-0! [&_.ant-upload]:border-dashed! [&_.ant-upload]:border-gray/45! [&_.ant-upload-btn]:p-0!"
          style={{ width: "100%" }}
          maxCount={1}
          showUploadList
          beforeUpload={(file) => {
            const allowedType =
              file.type === "application/pdf" ||
              file.type.startsWith("image/") ||
              (!file.type && file.name.toLowerCase().endsWith(".pdf"));

            if (!allowedType || file.size > maxSizeMB * 1024 * 1024) {
              setError(`Choose a PDF or image up to ${maxSizeMB} MB.`);
              return Upload.LIST_IGNORE;
            }

            setError("");
            return false;
          }}
          onChange={() => setError("")}
          onRemove={() => {
            setError("");
            return true;
          }}
        >
          <div className="flex w-full items-center justify-center gap-2 py-3 text-gray">
            <LuUpload size={14} />
            <span>Drag &amp; drop a file here or click</span>
          </div>
        </Upload.Dragger>
      </Form.Item>

      {/* <p className="text-sm text-gray">PDF or image, up to {maxSizeMB} MB</p> */}

      {error && (
        <p role="alert" className="mt-2 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
