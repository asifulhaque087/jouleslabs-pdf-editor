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

  // const [scale, setScale] = useState<number>(1);
  // const [panning, setPanning] = useState<boolean>(false);
  // const [pointX, setPointX] = useState<number>(0);
  // const [pointY, setPointY] = useState<number>(0);
  // const [start, setStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const zoomElementRef = useRef<HTMLDivElement>(null);

  let scale = 1,
    panning = false,
    pointX = 0,
    pointY = 0,
    start = { x: 0, y: 0 };

  // const setTransform = (pointX: number, pointY: number, scale: number) => {
  //   if (zoomElementRef.current) {
  //     zoomElementRef.current.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
  //     // zoomElementRef.current.style.transform = `${pointY}px) scale(${scale})`;
  //   }
  // };

  function setTransform() {
    // zoomElementRef.current.style.transform =
    //   "translate(" + pointX + "px, " + pointY + "px) scale(" + scale + ")";

    // canvasRef.current.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;

    zoomElementRef.current.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;

    // zoomElementRef.current.style.transform = " scale(" + scale + ")";
    // zoomElementRef.current.style.transformOrigin = `${pointX}px ${pointY}px`;
    // zoomElementRef.current.style.transform = `scale(${scale})`;
  }

  const changeScroll = () => {
    let style = document.body.style.overflow;
    document.body.style.overflow = style === "hidden" ? "auto" : "hidden";
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    start = { x: e.clientX - pointX, y: e.clientY - pointY };
    panning = true;
  };

  const handleMouseUp = () => {
    panning = false;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!panning) {
      return;
    }
    pointX = e.clientX - start.x;
    pointY = e.clientY - start.y;
    setTransform();
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    console.log("hell from on wheel ");

    const xsBeforeZoom = (e.clientX - pointX) / scale;
    const ysBeforeZoom = (e.clientY - pointY) / scale;
    const delta = e.deltaY || e.deltaX;
    // const zoomFactor = delta > 0 ? 1.2 : 1 / 1.2;
    const zoomFactor = delta > 0 ? 1.01 : 1 / 1.01;
    const newScale = scale * zoomFactor;
    const xsAfterZoom = (e.clientX - pointX) / newScale;
    const ysAfterZoom = (e.clientY - pointY) / newScale;

    scale = newScale;
    pointX = pointX + xsBeforeZoom - xsAfterZoom;
    pointY = pointY + ysBeforeZoom - ysAfterZoom;
    setTransform();
  };
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
    <div className="bg-red-500 p-[100px] overflow-hidden">
      <div
        ref={zoomElementRef}
        onMouseEnter={changeScroll}
        onMouseLeave={changeScroll}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
        style={{ width: "100%", height: "100%", overflow: "hidden" }}
      >
        <canvas
          // className="scale-[1.3]"
          ref={canvasRef}
          width={width}
          height={height}
        />
      </div>
    </div>
  );
};
