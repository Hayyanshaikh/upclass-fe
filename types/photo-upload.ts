export type PhotoUploadProps = {
  value?: File | string | null;
  alt?: string;
  onChange?: (value: File | string | null) => void;
  maxSizeMB?: number;
};
