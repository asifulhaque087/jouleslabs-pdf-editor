"use client";

import React, { useEffect } from "react";
import { AttachmentTypes } from "../entities";
import { Image } from "../containers/Image";
import { Drawing } from "../containers/Drawing";
import { Text } from "../containers/Text";
import { readAsDataURL, readAsImage } from "@/utils/asyncReader";
import ImageWraper from "./ImageWraper";

interface Props {
  attachments: Attachment[];
  pdfName: string;
  pageDimensions: Dimensions;
  removeAttachment: (index: number) => void;
  updateAttachment: (index: number, attachment: Partial<Attachment>) => void;
}

export const Attachments: React.FC<Props> = ({
  attachments,
  pdfName,
  pageDimensions,
  removeAttachment,
  updateAttachment,
}) => {
  const handleAttachmentUpdate =
    (index: number) => (attachment: Partial<Attachment>) =>
      updateAttachment(index, attachment);

  // console.log("page dimensions is ", pageDimensions);
  // console.log("attachments are ", attachments);

  // const processImage = async () => {
  //   const url = await readAsDataURL(attachments.file);
  //   const img = await readAsImage(url as string);
  //   // setImg(img);
  //   const { width, height } = img;
  // };

  // useEffect(() => {
  //   // console.log("I run first");
  //   processImage();
  // }, []);

  return attachments ? (
    <>
      {attachments.length
        ? attachments.map((attachment, index) => {
            // const key = `${pdfName}-${index}`;
            // const key = `${Math.floor(Math.random() * 10000)}`;
            const key = `${attachment.id}`;
            // console.log("the key is ", key)

            if (attachment.type === AttachmentTypes.IMAGE) {
              console.log("the image is ", attachment);

              // const url = await readAsDataURL(file);
              // const img = await readAsImage(url as string);

              return (
                <ImageWraper
                  key={key}
                  pageWidth={pageDimensions.width}
                  pageHeight={pageDimensions.height}
                  removeImage={() => removeAttachment(index)}
                  updateImageAttachment={handleAttachmentUpdate(index)}
                  {...(attachment as ImageAttachment)}
                />
              );

              // return (
              //   <Image
              //     key={key}
              //     // key={`${Math.floor(Math.random() * 10000)}`}
              //     pageWidth={pageDimensions.width}
              //     pageHeight={pageDimensions.height}
              //     removeImage={() => removeAttachment(index)}
              //     updateImageAttachment={handleAttachmentUpdate(index)}
              //     {...(attachment as ImageAttachment)}
              //   />
              // );
            }

            if (attachment.type === AttachmentTypes.DRAWING) {
              return (
                <Drawing
                  key={key}
                  pageWidth={pageDimensions.width}
                  pageHeight={pageDimensions.height}
                  removeDrawing={() => removeAttachment(index)}
                  updateDrawingAttachment={handleAttachmentUpdate(index)}
                  {...(attachment as DrawingAttachment)}
                />
              );
            }

            if (attachment.type === AttachmentTypes.TEXT) {
              console.log("the key is ", key);
              return (
                <Text
                  key={key}
                  pageWidth={pageDimensions.width}
                  pageHeight={pageDimensions.height}
                  updateTextAttachment={handleAttachmentUpdate(index)}
                  {...(attachment as TextAttachment)}
                />
              );
            }
            return null;
          })
        : null}
    </>
  ) : null;
};
