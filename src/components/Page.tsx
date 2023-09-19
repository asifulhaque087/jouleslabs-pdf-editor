"use cient";

import React, { useEffect, useRef, useState } from "react";

interface Props {
  page: any;
  dimensions?: Dimensions;
  updateDimensions: ({ width, height }: Dimensions) => void;
}

export const Page = ({ page, dimensions, updateDimensions }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [width, setWidth] = useState((dimensions && dimensions.width) || 0);
  const [height, setHeight] = useState((dimensions && dimensions.height) || 0);

  useEffect(() => {
    const renderPage = async (p: Promise<any>) => {
      const _page = await p;
      if (_page) {
        const context = canvasRef.current?.getContext("2d");
        const viewport = _page.getViewport({ scale: 1 });

        setWidth(viewport.width);
        setHeight(viewport.height);

        if (context) {
          await _page.render({
            canvasContext: canvasRef.current?.getContext("2d"),
            viewport,
          }).promise;

          const newDimensions = {
            width: viewport.width,
            height: viewport.height,
          };

          updateDimensions(newDimensions as Dimensions);
        }
      }
    };

    renderPage(page);
  }, [page, updateDimensions]);

  // return (
  //   <div
  //   // ref={zoomElementRef}
  //   // onMouseDown={handleMouseDown}
  //   // onMouseUp={handleMouseUp}
  //   // onMouseMove={handleMouseMove}
  //   // onWheel={handleWheel}
  //   // style={{ width: "100%", height: "100%", overflow: "hidden" }}
  //   >
  //     <canvas
  //       // className="scale-[1.3]"

  //       // ref={zoomElementRef}

  //       ref={canvasRef}
  //       onMouseDown={handleMouseDown}
  //       onMouseUp={handleMouseUp}
  //       onMouseMove={handleMouseMove}
  //       width={width}
  //       height={height}
  //     />
  //   </div>
  // );

  return (
    <canvas
      // className="scale-[1.3]"
      ref={canvasRef}
      width={width}
      height={height}
    />
  );

  // return (
  //   <div className="bg-red-500 p-[100px] overflow-hidden">
  //     <div></div>
  //   </div>
  // );

  // return (
  //   <div className="bg-red-500 p-[100px] overflow-hidden">
  //     <div>
  //       <canvas
  //         // className="scale-[1.3]"
  //         ref={canvasRef}
  //         width={width}
  //         height={height}
  //       />
  //     </div>
  //   </div>
  // );
};
