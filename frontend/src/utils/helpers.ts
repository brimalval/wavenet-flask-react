// Generate an anchor element and programmatically click it
export const downloadBlob = (blob: Blob, fileName?: string) => {
  const blobType = blob.type ?? "audio/mp3";
  blob = new Blob([blob], { type: blobType });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName ?? `Download.mid`;
  link.click();
  link.remove();
};