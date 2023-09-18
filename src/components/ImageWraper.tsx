"use client";

import { Image } from "@/containers/Image";
import { readAsDataURL, readAsImage } from "@/utils/asyncReader";
import { useEffect, useState } from "react";

interface Props {
  pageWidth: number;
  pageHeight: number;
  removeImage: () => void;
  updateImageAttachment: (imageObject: Partial<ImageAttachment>) => void;
}

const ImageWraper = ({
  x,
  y,
  //   img,
  file,
  width,
  height,
  pageWidth,
  removeImage,
  pageHeight,
  updateImageAttachment,
}: ImageAttachment & Props) => {
  const [img, setImg] = useState<HTMLImageElement>();
  //   const [width, setWidth] = useState<number>(0);
  //   const [height, setHeight] = useState<number>(0);

  const processImage = async () => {
    // if (!file) return;

    // console.log("file is ", file);
    //   console.log("img is ", img.width);

    if (file) {
      console.log("file is ", file);
      const url = await readAsDataURL(file);
      console.log("url is ", url);
      const img = await readAsImage(url as string);

      console.log("img is ", img);
      //   const { width, height } = img;
      //   setWidth(width);
      //   setHeight(height);
      setImg(img);
    }
  };

  useEffect(() => {
    processImage();
  }, []);

  if (!img) return <div>loading</div>;

  //   console.log("file is ", file);
  //   console.log("img is ", img.width);

  return (
    <Image
      pageWidth={pageWidth}
      pageHeight={pageHeight}
      removeImage={removeImage}
      updateImageAttachment={updateImageAttachment}
      x={x}
      y={y}
      img={img!}
      file={file}
      width={width}
      height={height}
      id={0}
      type={"image"}
      //   {...(attachment as ImageAttachment)}
    />
  );
};

export default ImageWraper;
