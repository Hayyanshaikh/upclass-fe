import { cloudinaryControllerUpload } from "@/app/api/endpoints/uploads/uploads";

type CloudinaryUploadResponse = {
  data?: {
    url?: string;
  };
};

export async function handleImageUpload(
  image?: File | string | null,
): Promise<string | null> {
  if (!(image instanceof File)) {
    return image || null;
  }

  const response = await cloudinaryControllerUpload(
    { file: image },
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  const upload = response as unknown as CloudinaryUploadResponse;

  if (!upload?.data?.url) {
    throw new Error("Image upload did not return a URL.");
  }

  return upload.data.url;
}
