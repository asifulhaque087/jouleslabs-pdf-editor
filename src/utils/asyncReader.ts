import { PDFDocument, PDFPage } from "pdf-lib";

import { getAsset } from "./prepareAssets";

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

  // const blob = new Blob([file]);
  // const url = window.URL.createObjectURL(blob);
  // return resolve(PDFDocument.load(url));
};

// export const readAsPDF = async (file: File): Promise<PDF> => {
//   try {
//     // Ensure that the input file is a PDF
//     if (file.type !== "application/pdf") {
//       throw new Error("Invalid file type. Please provide a PDF file.");
//     }

//     const arrayBuffer = await file.arrayBuffer();
//     const pdfDoc = await PDFDocument.load(arrayBuffer);

//     // Convert the pdfDoc to the PDF interface
//     const pdf: PDF = {
//       numPages: pdfDoc.getPageCount(),
//       getPage: async (index) => {
//         return pdfDoc.getPage(index - 1);
//       },
//     };

//     return pdf;
//   } catch (error) {
//     console.error("Error reading PDF:", error);
//     throw error;
//   }
// };

// export const readAsPDF = async (file: File): Promise<PDFDocument> => {
//   try {
//     const blob = new Blob([file]);
//     const url = window.URL.createObjectURL(blob);
//     const pdfDoc = await PDFDocument.load(url);

//     return pdfDoc; // Resolve the promise with the loaded PDF document
//   } catch (error) {
//     console.error('Error reading PDF:', error);
//     throw error; // Reject the promise with the error
//   }
// };
