import { readAsArrayBuffer } from "./asyncReader";
import { getAsset } from "./prepareAssets";
import { normalize } from "./helpers";
import { PDFPage , PDFDocument} from "pdf-lib";

export async function save(
  pdfFile: File,
  objects: Attachments[],
  name: string
) {
  const PDFLib = await getAsset("PDFLib");
  const download = await getAsset("download");
  let pdfDoc: {
    getPages: () => any[];
    embedFont: (arg0: unknown) => any;
    embedJpg: (arg0: unknown) => any;
    embedPng: (arg0: unknown) => any;
    embedPdf: (arg0: any) => [any] | PromiseLike<[any]>;
    save: () => any;
  };

  try {
    pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(pdfFile));
  } catch (e) {
    console.log("Failed to load PDF.");
    throw e;
  }

  const pagesProcesses = pdfDoc.getPages().map(async (page, pageIndex) => {
    const pageObjects = objects[pageIndex];
    // 'y' starts from bottom in PDFLib, use this to calculate y
    const pageHeight = page.getHeight();
    const embedProcesses = pageObjects.map(async (object: Attachment) => {
      if (object.type === "image") {
        const { file, x, y, width, height } = object as ImageAttachment;
        let img: any;
        try {
          if (file.type === "image/jpeg") {
            img = await pdfDoc.embedJpg(await readAsArrayBuffer(file));
          } else {
            img = await pdfDoc.embedPng(await readAsArrayBuffer(file));
          }
          return () =>
            page.drawImage(img, {
              x,
              y: pageHeight - y - height,
              width,
              height,
            });
        } catch (e) {
          console.log("Failed to embed image.", e);
          throw e;
        }
      } else if (object.type === "text") {
        const { x, y, text, lineHeight, size, fontFamily, width } =
          object as TextAttachment;
        const pdfFont = await pdfDoc.embedFont(fontFamily);
        return () =>
          page.drawText(text, {
            maxWidth: width,
            font: pdfFont,
            size,
            lineHeight,
            x,
            y: pageHeight - size! - y,
          });
      } else if (object.type === "drawing") {
        const { x, y, path, scale, stroke, strokeWidth } =
          object as DrawingAttachment;
        const {
          pushGraphicsState,
          setLineCap,
          popGraphicsState,
          setLineJoin,
          LineCapStyle,
          LineJoinStyle,
          rgb,
        } = PDFLib;
        return () => {
          page.pushOperators(
            pushGraphicsState(),
            setLineCap(LineCapStyle.Round),
            setLineJoin(LineJoinStyle.Round)
          );

          const color = window.w3color(stroke!).toRgb();

          page.drawSvgPath(path, {
            borderColor: rgb(
              normalize(color.r),
              normalize(color.g),
              normalize(color.b)
            ),
            borderWidth: strokeWidth,
            scale,
            x,
            y: pageHeight - y,
          });
          page.pushOperators(popGraphicsState());
        };
      }
    });
    // embed objects in order
    const drawProcesses: any[] = await Promise.all(embedProcesses);
    drawProcesses.forEach((p) => p());
  });
  await Promise.all(pagesProcesses);
  try {
    const pdfBytes = await pdfDoc.save();
    download(pdfBytes, name, "application/pdf");
  } catch (e) {
    console.log("Failed to save PDF.");
    throw e;
  }
}

export const mergePdfFiles = async (pdfFiles: File[]): Promise<File> => {
  // const PDFpage = await getAsset("PDFLib");
  const pdfDoc = await PDFDocument.create();
  for (const pdfFile of pdfFiles) {
    const pdfBytes = await pdfFile.arrayBuffer();
    const externalPdfDoc = await PDFDocument.load(pdfBytes);
    const copiedPages: PDFPage[] = await pdfDoc.copyPages(
      externalPdfDoc,
      externalPdfDoc.getPageIndices()
    );
    copiedPages.forEach((page) => {
      pdfDoc.addPage(page);
    });
  }
  const mergedPdfBlob = new Blob([await pdfDoc.save()], {
    type: "application/pdf",
  });
  const mergedPdfFile = new File([mergedPdfBlob], "merged.pdf", {
    type: "application/pdf",
  });
  return mergedPdfFile;
};

// export const mergePdfFiles = async (pdfFiles: File[]): Promise<Blob> => {
//   const PDFLib = await getAsset("PDFLib");
//   const pdfDoc = await PDFLib.PDFDocument.create();
//   for (const pdfFile of pdfFiles) {
//     const pdfBytes = await pdfFile.arrayBuffer();
//     const externalPdfDoc = await PDFLib.PDFDocument.load(pdfBytes);
//     const copiedPages = await pdfDoc.copyPages(
//       externalPdfDoc,
//       externalPdfDoc.getPageIndices()
//     );
//     copiedPages.forEach((page: any) => {
//       pdfDoc.addPage(page);
//     });
//   }
//   return new Blob([await pdfDoc.save()], { type: "application/pdf" });
// };

// export async function mergePdf(){

// }

// export async function mergePages() {
//   try {
//     // Fetch first existing PDF document
//     const url1 = "Patient_Card1.pdf"; // Replace with the correct file URL
//     const response1 = await fetch(url1);
//     const data1 = await response1.arrayBuffer();

//     // Fetch second existing PDF document
//     const url2 = "Patient_Card2.pdf"; // Replace with the correct file URL
//     const response2 = await fetch(url2);
//     const data2 = await response2.arrayBuffer();

//     // Load PDFDocuments from the existing PDFs
//     const pdf1 = await PDFDocument.load(data1);
//     const pdf2 = await PDFDocument.load(data2);

//     // Create a new PDFDocument
//     const mergedPdf = await PDFDocument.create();

//     // Copy pages from the first PDF
//     const copiedPagesA = await mergedPdf.copyPages(pdf1, pdf1.getPageIndices());
//     copiedPagesA.forEach((page) => mergedPdf.addPage(page));

//     // Copy pages from the second PDF
//     const copiedPagesB = await mergedPdf.copyPages(pdf2, pdf2.getPageIndices());
//     copiedPagesB.forEach((page) => mergedPdf.addPage(page));

//     // Serialize the merged PDF
//     const mergedPdfBytes = await mergedPdf.save();

//     // Create a blob from the merged PDF data
//     const blob = new Blob([mergedPdfBytes], { type: "application/pdf" });

//     // Create a download link and trigger the download
//     const a = document.createElement("a");
//     a.href = URL.createObjectURL(blob);
//     a.download = "merged.pdf"; // Specify the desired file name
//     a.style.display = "none";
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }

// Call the copyPages function to merge the PDFs
