import type { MetaData, SanitizedImage, Conversion } from "@/types";
import loadImage from "blueimp-load-image";
import "blueimp-load-image/js/load-image-exif.js"; //for EXIF parsing
import "blueimp-load-image/js/load-image-exif-map.js"; // for the tag mapping

export class MetadataService {
  static checkImageType(file: File): boolean {
    const allowedtypes: Conversion[] = [
      "image/jpeg",
      "image/png",
      "image/x-icon",
      "image/svg+xml",
      "image/bmp",
      "image/webp",
    ];
    if (!allowedtypes.includes(file.type as Conversion)) {
      return false;
    }
    return true;
  }
  static getFormatFromMime(mime: string): string {
    const map: Record<string, string> = {
      "image/jpeg": "JPG",
      "image/png": "PNG",
      "image/webp": "WEBP",
      "image/bmp": "BMP",
      "image/svg+xml": "SVG",
      "image/x-icon": "ICO",
    };
    return map[mime] || mime;
  }
  private static async getImageDimensions(file: File): Promise<{
    width: number;
    height: number;
  }> {
    const image = await createImageBitmap(file);

    try {
      return {
        width: image.width,
        height: image.height,
      };
    } finally {
      image.close();
    }
  }

  static async extractMetadata(file: File): Promise<MetaData> {
    if (!MetadataService.checkImageType(file)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    const dimensions = await this.getImageDimensions(file);

    return {
      filename: file.name,
      filesize: file.size,
      mimeType: file.type,
      lastModified: file.lastModified,
      width: dimensions.width,
      height: dimensions.height,
    };
  }
  //by sanitize we meant is that the file needs to gives its main data
  static async sanitizeImage(file: File): Promise<SanitizedImage> {
    const metadata = await this.extractMetadata(file);
    const stripmetadata = await this.stripMetadata(file); //making of blob
    return {
      blob: stripmetadata,
      metadata: metadata,
      originalFile: file,
    };
  }

  static async stripMetadata(file: File): Promise<Blob> {
    //const image = await this.loadImage(file);
    if (!MetadataService.checkImageType(file)) {
      throw new Error(`Unsupported file type: ${file.type}`);
    }
    const image = await createImageBitmap(file, {
      imageOrientation: "from-image",
    });

    try {
      const canvas = new OffscreenCanvas(image.width, image.height);
      const ctx = canvas.getContext("2d", {
        willReadFrequently: false,
        colorSpace: "srgb",
        alpha: true,
      });
      if (!ctx) {
        throw new Error("Canvas context unavailable");
      }
      ctx.drawImage(image, 0, 0);
      return await canvas.convertToBlob({
        type: file.type,
        quality: 1.0,
      });
    } finally {
      image.close();
    }
  }

  static async LoadImageWithMetaData(
    file: File,
    targetFormat: Conversion,
    quality: number = 0.92,
  ): Promise<Blob> {
    //const image = await createImageBitmap(file);
    return new Promise((resolve, reject) => {
      loadImage(
        file,
        (img: HTMLImageElement | HTMLCanvasElement | Event, data: any) => {
          if (img instanceof Event) {
            reject(new Error("Failed to load image file"));
            return;
          }
          // creating the instance of the canvas
          const canvas = img as HTMLCanvasElement;
          const ctx = canvas.getContext("2d");
          // For JPEG, fill background with white (handles transparency)  no idea why??
          if (targetFormat === "image/jpeg" && ctx) {
            const offscreen = new OffscreenCanvas(canvas.width, canvas.height);
            const offctx = offscreen.getContext("2d");
            if (offctx) {
              offctx.fillStyle = "#FFFFFF";
              offctx.fillRect(0, 0, canvas.width, canvas.height);
              offctx.drawImage(canvas, 0, 0); // draw the image on the solid white first
              ctx.clearRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(offscreen, 0, 0);
            }
          }
          /// Export the canvas to the target format
          canvas.toBlob(
            (blob: Blob | null) => {
              if (!blob) {
                reject(new Error("Failed Conversion of Blob"));
              }
              // We check first if the data provided has the Head or not
              if (data && data.imageHead && targetFormat === "image/jpeg") {
                loadImage.replaceHead(
                  //@ts-ignore
                  blob,
                  data.imageHead,
                  (restoredBlob: Blob) => {
                    resolve(restoredBlob);
                  },
                );
              } else {
                //@ts-ignore
                resolve(blob);
              }
            },
            targetFormat,
            quality,
          );
        },
        {
          canvas: true,
          meta: true,
          orientation: true,
          maxWidth: Infinity,
          maxHeight: Infinity,
        },
      );
    });
  }
}
