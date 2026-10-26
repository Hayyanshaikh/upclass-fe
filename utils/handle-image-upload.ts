import { cloudinaryControllerUpload } from "@/app/api/endpoints/uploads/uploads";

export async function handleImageUpload(
  image?: File | string | null,
  currentPublicId?: string | null,
): Promise<{ url: string | null; publicId: string | null }> {
  if (!(image instanceof File)) {
    return {
      url: image || null,
      publicId: image ? currentPublicId ?? null : null,
    };
  }

  const response = await cloudinaryControllerUpload(
    { file: image },
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  const upload = response.data;

  if (!upload?.url || !upload.publicId) {
    throw new Error("Image upload did not return its URL and public ID.");
  }

  return {
    url: upload.url,
    publicId: upload.publicId,
  };
}
