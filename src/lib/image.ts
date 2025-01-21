import Compressor from "compressorjs";

export const convertImageToBase64 = (image: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(image);
  });

export const compressImage = (file: File) =>
  new Promise<File>((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      success: (result) => resolve(result as File),
      error: reject,
    });
  });

export const compressImageToBase64 = async (file: File) => {
  const compressed = await compressImage(file);
  return convertImageToBase64(compressed as File);
};
