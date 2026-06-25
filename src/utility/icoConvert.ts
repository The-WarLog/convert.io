export async function convertToICO(
  pngBlob: Blob,
  width: number,
  height: number,
): Promise<Blob> {
  // First We Will Convert the pngBlob into ArrayBuffer
  const pngBuffer = await pngBlob.arrayBuffer();
  const pngBufferSize = pngBuffer.byteLength;
  // ICO buffer of  size 22 bytes
  const buffer = new ArrayBuffer(22 + pngBufferSize);
  const dataView = new DataView(buffer);
  // ICO Header - 6 bytes
  dataView.setUint16(0, 0, true); //Reserved (always 0)
  dataView.setUint16(2, 1, true); // Image Type (1= ICO)
  dataView.setUint16(4, 1, true); // storing only one image

  //  ICONDIRENTRY (16 bytes)
  // Width/Height: 0 actually represents 256px in ICO spec
  dataView.setUint8(6, width >= 256 ? 0 : width);
  dataView.setUint8(7, height >= 256 ? 0 : height);
  dataView.setUint8(8, 0); // Color palette (0 means no palette)
  dataView.setUint8(9, 0); // Reserved (always 0)
  dataView.setUint16(10, 1, true); // Color planes (1)
  dataView.setUint16(12, 32, true); // Bits per pixel (32 for modern PNGs)
  dataView.setUint32(14, pngBufferSize, true); // Size of the PNG data in bytes
  dataView.setUint32(18, 22, true); // Offset where the PNG data starts (byte 22)
  // --- Stitch it together ---
  const uint8Array = new Uint8Array(buffer);
  uint8Array.set(new Uint8Array(pngBuffer), 22);

  return new Blob([buffer], { type: "image/x-icon" });
}
