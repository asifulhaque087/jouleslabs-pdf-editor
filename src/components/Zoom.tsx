"use cient";

import { useRef } from "react";
import { Attachments } from "./Attachments";
import { Page } from "./Page";

interface PageProps {
  page: any;
  dimensions?: Dimensions;
  updateDimensions: ({ width, height }: Dimensions) => void;
}

interface AttachmentProps {
  attachments: Attachment[];
  pdfName: string;
  pageDimensions?: Dimensions;
  removeAttachment: (index: number) => void;
  updateAttachment: (index: number, attachment: Partial<Attachment>) => void;
}

interface Props extends PageProps, AttachmentProps {}

const Zoom = ({
  page,
  dimensions,
  updateDimensions,
  attachments,
  pdfName,
  pageDimensions,
  removeAttachment,
  updateAttachment,
}: Props) => {
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

  return (
    <div
    // ref={zoomElementRef}
    // onMouseEnter={changeScroll}
    // onMouseLeave={changeScroll}
    // onMouseDown={handleMouseDown}
    // onMouseUp={handleMouseUp}
    // onMouseMove={handleMouseMove}
    // onWheel={handleWheel}
    // style={{ width: "100%", height: "100%", overflow: "hidden" }}
    >
      <div style={{ position: "relative" }}>
        <Page
          dimensions={dimensions}
          updateDimensions={updateDimensions}
          page={page}
        />
        {pageDimensions && (
          <Attachments
            pdfName={pdfName}
            removeAttachment={removeAttachment}
            updateAttachment={updateAttachment}
            pageDimensions={pageDimensions}
            attachments={attachments}
            // attachments={allPageAttachments[pageIndex]}
          />
        )}
      </div>
    </div>
  );
};

export default Zoom;
