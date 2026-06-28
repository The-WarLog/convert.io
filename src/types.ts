export type Conversion =
  | "image/jpeg"
  | "image/png"
  | "image/x-icon"
  | "image/svg+xml"
  | "image/bmp"
  | "image/webp";

export interface MetaData {
  filename: string;
  filesize: number;
  mimeType: string;
  lastModified: number;
  width?: number;
  height?: number;
}

export interface SanitizedImage {
  metadata: MetaData;
  originalFile: File;
}
export interface ConversionOutput {
  blob: Blob;
  metadata: MetaData;
  originalFile?: File;
}
export interface ConversionJob {
  id: string;
  input: SanitizedImage;
  targetFormat: Conversion;
  status: "pending" | "processing" | "done" | "error";
  output?: ConversionOutput;
  error?: string;
  originalFilename: string;
  originalFormat: string; // e.g., "JPG"
  outputSize: number; // bytes
  conversionDate: number; // timestamp
  previewUrl?: string; // data URL for thumbnail
  expiresAt: number; // timestamp for auto‑cleanup
}
