"use client";

import { RefObject } from "react";

const Preview = ({
  previewRef,
}: {
  previewRef: RefObject<HTMLIFrameElement>;
}) => {
  return (
    <div>
      this is the preview Preview
      <iframe ref={previewRef}></iframe>
    </div>
  );
};

export default Preview;
