import { readAsArrayBuffer } from "./asyncReader";
import { getAsset } from "./prepareAssets";
import { normalize } from "./helpers";
import { PDFPage, PDFDocument } from "pdf-lib";

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

export async function saveAndPreview(
  pdfFile: File,
  objects: Attachments[],
  name: string,
  pdfViewer: HTMLIFrameElement,
  pageRefs: React.RefObject<HTMLTextAreaElement>[]
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

  console.log("the refs are ", pageRefs);

  try {
    pdfDoc = await PDFLib.PDFDocument.load(await readAsArrayBuffer(pdfFile));
    console.log("pdfDoc");
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

        console.log("text is ", object);

        return () =>
          page.drawText(text, {
            maxWidth: width,
            font: pdfFont,
            size,
            // lineHeight,
            lineHeight: 15,
            x,
            y: pageHeight - size! - y,
          });

        // const { x, y, text, lineHeight, size, fontFamily, width } =
        //   object as TextAttachment;

        // try {
        //   // const pdfFont = await pdfDoc.embedFont(fontFamily);
        //   const pdfFont = await pdfDoc.embedFont("Helvetica"); // You can replace "Helvetica" with a suitable font name

        //   const textWidth = pdfFont.widthOfTextAtSize(text, size);
        //   const textHeight = pdfFont.heightAtSize(size);

        //   return () => {
        //     const options = {
        //       font: pdfFont,
        //       size,
        //       x,
        //       y: pageHeight - y - textHeight, // Adjust y position
        //     };

        //     if (textWidth > width) {
        //       // Text exceeds the specified width, so break it into multiple lines
        //       const lines = pdfDoc.splitTextToSize(text, width, {
        //         fontSize: size,
        //         font: pdfFont,
        //       });
        //       page.drawText(lines, options);
        //     } else {
        //       // Draw the text as is
        //       page.drawText(text, options);
        //     }
        //   };
        // } catch (e) {
        //   console.log("Failed to embed font or draw text.", e);
        //   throw e;
        // }
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

    // Display the PDF in the iframe for preview
    const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });
    pdfViewer.src = URL.createObjectURL(pdfBlob);
  } catch (e) {
    console.log("Failed to save PDF.");
    throw e;
  }
}
