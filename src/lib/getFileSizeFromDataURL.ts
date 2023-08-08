export function formatFileSizeFromDataURL(dataURL: string): string {
  function formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["B", "KB", "MB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  const base64Data = dataURL.split(",")[1];
  const binaryData = atob(base64Data);
  const fileSizeInBytes = binaryData.length;

  return fileSizeInBytes < 1024
    ? formatBytes(fileSizeInBytes, 0)
    : fileSizeInBytes < 1024 * 1024
    ? formatBytes(fileSizeInBytes)
    : formatBytes(fileSizeInBytes);
}
