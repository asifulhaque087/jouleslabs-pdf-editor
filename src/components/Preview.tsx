"use client";

import { RefObject } from "react";

const Preview = ({
  previewRef,
}: {
  previewRef: RefObject<HTMLIFrameElement>;
}) => {
  // return <iframe width="1024" height="768" ref={previewRef}></iframe>;
  return <iframe width="100%" height="100%" ref={previewRef}></iframe>;

  // return (
  //   <div>
  //     this is the preview Preview
  //     <iframe ref={previewRef}></iframe>
  //   </div>
  // );
};

export default Preview;
