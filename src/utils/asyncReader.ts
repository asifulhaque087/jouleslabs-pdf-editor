import { getAsset } from "./provideScripts";

export const readAsArrayBuffer = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
};

export const readAsImage = (src: Blob | string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    if (src instanceof Blob) {
      const url = window.URL.createObjectURL(src);
      img.src = url;
    } else {
      img.src = src;
    }
  });
};

export const readAsDataURL = (
  file: File
): Promise<string | ArrayBuffer | null> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface PDF {
  numPages: number;
  getPage: (index: number) => Promise<any>;
}
export const readAsPDF = async (file: File): Promise<PDF> => {
  // console.log("from readAsPdf utils ", readAsPDF)
  const pdfjsLib = await getAsset("pdfjsLib");

  if (!pdfjsLib || typeof pdfjsLib.getDocument !== "function") {
    // Handle the case where pdfjsLib is undefined or lacks getDocument method
    console.error("pdfjsLib is not properly configured.");
    // return promise; // Or throw an error, or handle it according to your requirements.
  }

  // Safari possibly get webkitblobresource error 1 when using origin file blob
  const blob = new Blob([file]);
  const url = window.URL.createObjectURL(blob);
  return pdfjsLib.getDocument(url).promise;
};
