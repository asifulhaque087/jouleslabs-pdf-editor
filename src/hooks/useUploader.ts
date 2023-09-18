"use client";

import React, { useState, createRef } from "react";
import { readAsPDF, readAsDataURL, readAsImage } from "../utils/asyncReader";
import { getBase64, ggID } from "../utils/helpers";
import { Pdf } from "./usePdf";
import { AttachmentTypes } from "../entities";
import toast from "react-hot-toast";
import { mergePdfFiles } from "@/utils/pdf";

type ActionEvent<T> = React.TouchEvent<T> | React.MouseEvent<T>;

export enum UploadTypes {
  PDF = "pdf",
  IMAGE = "image",
}

const handlers = {
  pdf: async (file: File) => {
    try {
      const pdf = await readAsPDF(file);
      return {
        file,
        name: file.name,
        pages: Array(pdf.numPages)
          .fill(0)
          .map((_, index) => pdf.getPage(index + 1)),
      } as Pdf;
    } catch (error) {
      console.log("Failed to load pdf", error);
      throw new Error("Failed to load PDF");
    }
  },
  image: async (file: File) => {
    try {
      const url = await readAsDataURL(file);
      const img = await readAsImage(url as string);
      const { width, height } = img;

      const id = ggID()();

      const imageAttachemnt: ImageAttachment = {
        id,
        type: AttachmentTypes.IMAGE,

        // img,
        width,
        height,

        img: "",
        // width: 0,
        // height: 0,
        x: 0,
        y: 0,
        file,
      };
      return imageAttachemnt;
    } catch (error) {
      console.log("Failed to load image", error);
      throw new Error("Failed to load image");
    }
  },
};

/**
 * @function useUploader
 *
 * @description This hook handles pdf and image uploads
 *
 * @
 * @param use UploadTypes
 */
export const useUploader = ({
  use,
  afterUploadPdf,
  afterUploadAttachment,
}: {
  use: UploadTypes;
  afterUploadPdf?: (upload: Pdf) => void;
  afterUploadAttachment?: (upload: Attachment) => void;
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = createRef<HTMLInputElement>();

  const onClick = (event: ActionEvent<HTMLInputElement>) => {
    event.currentTarget.value = "";
  };

  const handleClick = () => {
    const input = inputRef.current;

    if (input) {
      // console.log("I am clicked");
      setIsUploading(true);
      input.click();
    }
  };

  // const upload = async (
  //   event: React.ChangeEvent<HTMLInputElement> & { dataTransfer?: DataTransfer }
  // ) => {
  //   if (!isUploading) {
  //     return;
  //   }

  //   const files: FileList | undefined =
  //     event.currentTarget.files ||
  //     (event.dataTransfer && event.dataTransfer.files);
  //   if (!files) {
  //     setIsUploading(false);
  //     return;
  //   }

  //   const file = files[0];

  //   const result = await handlers[use](file);

  //   if (use === UploadTypes.PDF && afterUploadPdf) {
  //     afterUploadPdf(result as Pdf);
  //   }

  //   if (use === UploadTypes.IMAGE && afterUploadAttachment) {
  //     console.log("===> was this also called");
  //     afterUploadAttachment(result as ImageAttachment);
  //   }
  //   setIsUploading(false);
  //   return;
  // };

  const saveFile = async (file: File) => {
    // e.preventDefault();
    if (!file) return;

    try {
      const data = new FormData();
      data.set("file", file);

      const res = await fetch("/api/pdfs", {
        method: "POST",
        body: data,
      });
      // handle the error
      if (!res.ok) throw new Error(await res.text());
      // localStorage.removeItem("attachs");
    } catch (e: any) {
      // Handle errors here
      console.error(e);
    }
  };

  const upload = async (
    event: React.ChangeEvent<HTMLInputElement> & { dataTransfer?: DataTransfer }
  ) => {
    if (!isUploading) {
      return;
    }

    const files: FileList | undefined =
      event.currentTarget.files ||
      (event.dataTransfer && event.dataTransfer.files);
    if (!files) {
      setIsUploading(false);
      return;
    }

    let file = files[0];

    if (use === UploadTypes.PDF) {
      file = await mergePdfFiles(Array.from(files).map((file: File) => file));
    }

    // Check if the file size is greater than 1 MB (1 MB = 1024 * 1024 bytes)
    if (file.size > 1024 * 1024) {
      // File size exceeds 1 MB, handle this case (e.g., show an error message).
      toast.error("File size exceeds 1 MB.");
      setIsUploading(false);
      return;
    }

    const result = await handlers[use](file);

    if (use === UploadTypes.PDF && afterUploadPdf) {
      // localStorage.setItem("pdf", JSON.stringify(result));
      console.log("the res is ", result);
      const base64String = await getBase64(result.file);

      const { file, name, pages, pageIndex } = result as Pdf;

      await saveFile(file);

      const pdfDetails = {
        file: base64String,
        name,
        // pages,
        pageIndex,
      };

      // localStorage.setItem("pdfDetails", JSON.stringify(pdfDetails));
      afterUploadPdf(result as Pdf);
    }

    if (use === UploadTypes.IMAGE && afterUploadAttachment) {
      console.log("===> was this also called ");
      afterUploadAttachment(result as ImageAttachment);
    }
    setIsUploading(false);
    return;
  };

  const pdfUpload = async (file: File) => {
    const result = await handlers[use](file);

    if (use === UploadTypes.PDF && afterUploadPdf) {
      // localStorage.setItem("pdf", JSON.stringify(result));
      // console.log("the res is ", result);
      const base64String = await getBase64(result.file);

      const { file, name, pages, pageIndex } = result as Pdf;

      const pdfDetails = {
        file: base64String,
        name,
        // pages,
        pageIndex,
      };

      // localStorage.setItem("pdfDetails", JSON.stringify(pdfDetails));
      afterUploadPdf(result as Pdf);
    }
  };

  const imgUpload = async (file: File) => {
    const result = await handlers[use](file);

    if (use === UploadTypes.IMAGE && afterUploadAttachment) {
      console.log("===> was this also called ");
      afterUploadAttachment(result as ImageAttachment);
    }
    setIsUploading(false);
  };

  return {
    pdfUpload,
    upload,
    onClick,
    inputRef,
    isUploading,
    handleClick,
  };
};
