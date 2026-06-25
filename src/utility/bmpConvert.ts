import bmp from "@wokwi/bmp-ts";
export async function convertToBMP(imagedata: ImageData): Promise<Blob> {
  const bmpBuffer = bmp.encode({
    data: new Uint8Array(imagedata.data),
    bitPP: 32,
    width: imagedata.width,
    height: imagedata.height,
  });
  return new Blob([bmpBuffer.data as any], { type: "image/bmp" });
}
