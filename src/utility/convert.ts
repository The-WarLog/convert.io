import type { Conversion, ConversionJob } from "@/types";
import { MetadataService } from "./metadata";
import { cleanExpiredConversions, storeConversion } from "@/storage/storage";
import { convertToBMP } from "./bmpConvert";
import { convertToICO } from "./icoConvert";

const TTL_DAYS = 7;

export async function convertAndStore(
  file: File,
  targetFormat: Conversion,
): Promise<ConversionJob> {
  let convertedBlob: Blob;
  //  Strip Off the metadata
  const sanitizedImage = await MetadataService.sanitizeImage(file);
  // const convertedBlob = await convertBlobFormat(
  //   sanitizedImage.blob,
  //   targetFormat,
  // );
  if (targetFormat === "image/x-icon") {
    convertedBlob = await processSpecialFormats(file, "image/x-icon");
  } else if (targetFormat === "image/bmp") {
    convertedBlob = await processSpecialFormats(file, "image/bmp");
  } else {
    convertedBlob = await MetadataService.LoadImageWithMetaData(
      file,
      targetFormat,
      targetFormat === "image/jpeg" ? 0.92 : 1.0,
    );
  }
  //build the TTL
  const now = Date.now();
  const expiersAt = now + TTL_DAYS * 24 * 60 * 60 * 1000;
  const targetFormatName = MetadataService.getFormatFromMime(targetFormat);
  const originalFormatMime = MetadataService.getFormatFromMime(file.type);
  const conversionjob: ConversionJob = {
    id: crypto.randomUUID(),
    input: sanitizedImage,
    status: "done",
    output: {
      blob: convertedBlob,
      metadata: {
        filename:
          file.name.replace(/\.[^.]+$/, "") + "." + getExtension(targetFormat),
        filesize: convertedBlob.size,
        mimeType: targetFormatName,
        lastModified: now,
        width: sanitizedImage.metadata.width,
        height: sanitizedImage.metadata.height,
      },
      originalFile: file,
    },
    error: undefined,
    originalFilename: file.name,
    originalFormat: originalFormatMime,
    outputSize: convertedBlob.size,
    targetFormat: targetFormat,
    conversionDate: now,
    expiresAt: expiersAt,
  };
  // storing in the indexDB
  await storeConversion(conversionjob);
  await cleanExpiredConversions(TTL_DAYS).catch(console.warn);
  return conversionjob;
}

function getExtension(mime: string): string {
  const map: Record<string, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/bmp": "bmp",
    "image/svg": "svg",
    "image/x-icon": "ico",
  };
  return map[mime] || "bin";
}

async function processSpecialFormats(
  file: File,
  targetMime: Conversion,
): Promise<Blob> {
  const image = await createImageBitmap(file);
  if (targetMime === "image/x-icon") {
    try {
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        throw new Error("Canvas context unavailable");
      }
      ctx.clearRect(0, 0, image.width, image.height);
      ctx.drawImage(image, 0, 0);
      const pngBlob = await canvas.convertToBlob({
        type: "image/png",
      });
      return convertToICO(pngBlob, canvas.width, canvas.height);
    } finally {
      image.close();
    }
  }
  if (targetMime === "image/bmp") {
    try {
      const canvas = new OffscreenCanvas(image.width, image.height);

      // Use willReadFrequently: true because we are extracting raw pixels right after
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        throw new Error("Canvas context unavailable");
      }

      ctx.clearRect(0, 0, image.width, image.height);
      ctx.drawImage(image, 0, 0);

      // Extract raw pixels for your BMP processing function
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

      return await convertToBMP(imageData);
    } finally {
      image.close(); // Safeguard memory immediately after extraction
    }
  }
  return new Blob();
}
