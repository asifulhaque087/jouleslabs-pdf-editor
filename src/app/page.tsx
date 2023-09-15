"use client";

import React, { useState, useLayoutEffect } from "react";
import { BiChevronRight, BiChevronLeft } from "react-icons/bi";
import { Attachments } from "@/components/Attachments";
import { Empty } from "@/components/Empty";
import { MenuBar } from "@/components/MenuBar";
import { Page } from "@/components/Page";
import { AttachmentTypes } from "@/entities";
import { useAttachments } from "@/hooks/useAttachments";
import { Pdf, usePdf } from "@/hooks/usePdf";
import { UploadTypes, useUploader } from "@/hooks/useUploader";
import { DrawingModal } from "@/modals/components/DrawingModal";
import { HelpModal } from "@/modals/components/HelpModal";
import { ggID } from "@/utils/helpers";
import "semantic-ui-css/semantic.min.css";

import { Container, Grid, Button, Segment } from "semantic-ui-react";

const App: React.FC = () => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [drawingModalOpen, setDrawingModalOpen] = useState(false);
  const {
    file,
    initialize,
    pageIndex,
    isMultiPage,
    isFirstPage,
    isLastPage,
    currentPage,
    isSaving,
    savePdf,
    previousPage,
    nextPage,
    setDimensions,
    name,
    dimensions,
  } = usePdf();
  const {
    add: addAttachment,
    allPageAttachments,
    pageAttachments,
    reset: resetAttachments,
    update,
    remove,
    setPageIndex,
  } = useAttachments();

  const initializePageAndAttachments = (pdfDetails: Pdf) => {
    initialize(pdfDetails);
    const numberOfPages = pdfDetails.pages.length;
    resetAttachments(numberOfPages);
  };

  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
  } = useUploader({
    use: UploadTypes.PDF,
    afterUploadPdf: initializePageAndAttachments,
  });

  const {
    inputRef: imageInput,
    handleClick: handleImageClick,
    onClick: onImageClick,
    upload: uploadImage,
  } = useUploader({
    use: UploadTypes.IMAGE,
    afterUploadAttachment: addAttachment,
  });

  const addText = () => {
    const newTextAttachment: TextAttachment = {
      id: ggID(),
      type: AttachmentTypes.TEXT,
      x: 0,
      y: 0,
      width: 120,
      height: 25,
      size: 16,
      lineHeight: 1.4,
      fontFamily: "Times-Roman",
      text: "Enter Text Here",
    };
    addAttachment(newTextAttachment);
  };

  const addDrawing = (drawing?: {
    width: number;
    height: number;
    path: string;
  }) => {
    if (!drawing) return;

    const newDrawingAttachment: DrawingAttachment = {
      id: ggID(),
      type: AttachmentTypes.DRAWING,
      ...drawing,
      x: 0,
      y: 0,
      scale: 1,
    };
    addAttachment(newDrawingAttachment);
  };

  useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex]);

  const hiddenInputs = (
    <>
      {/* <textarea
        data-testid="pdf-input"
        ref={pdfInput}
        type="file"
        name="pdf"
        id="pdf"
        accept="application/pdf"
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: "none" }}
      /> */}

      <input
        data-testid="pdf-input"
        ref={pdfInput}
        type="file"
        name="pdf"
        id="pdf"
        accept="application/pdf"
        onChange={uploadPdf}
        onClick={onClick}
        style={{ display: "none" }}
      />
      <input
        ref={imageInput}
        type="file"
        id="image"
        name="image"
        accept="image/*"
        onClick={onImageClick}
        style={{ display: "none" }}
        onChange={uploadImage}
      />
    </>
  );

  const handleSavePdf = () => savePdf(allPageAttachments);

  return (
    <div className="m-[30px]">
      {hiddenInputs}
      <MenuBar
        openHelp={() => setHelpModalOpen(true)}
        savePdf={handleSavePdf}
        addText={addText}
        addImage={handleImageClick}
        addDrawing={() => setDrawingModalOpen(true)}
        savingPdfStatus={isSaving}
        uploadNewPdf={handlePdfClick}
        isPdfLoaded={!!file}
      />

      {!file ? (
        <Empty loading={isUploading} uploadPdf={handlePdfClick} />
      ) : (
        <div className="flex items-center justify-center gap-x-[50px]">
          <div
            className=""
            // width={3}
            // verticalAlign="middle"
            // textAlign="left"
          >
            {isMultiPage && !isFirstPage && (
              // <Button circular icon="angle left" onClick={previousPage} />
              <button
                className="w-[36px] h-[36px] rounded-full bg-gray-300 grid place-items-center"
                onClick={previousPage}
              >
                <BiChevronLeft size={20} />
              </button>
            )}
          </div>
          {/* <Grid.Column width={10}> */}
          <div className="mt-[30px]">
            {currentPage && (
              <div
                className="shadow-lg border"
                // data-testid="page"
                // compact
                // stacked={isMultiPage && !isLastPage}
              >
                <div style={{ position: "relative" }}>
                  <Page
                    dimensions={dimensions}
                    updateDimensions={setDimensions}
                    page={currentPage}
                  />
                  {dimensions && (
                    <Attachments
                      pdfName={name}
                      removeAttachment={remove}
                      updateAttachment={update}
                      pageDimensions={dimensions}
                      attachments={pageAttachments}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
          {/* <Grid.Column width={3} verticalAlign="middle" textAlign="right"> */}
          <div>
            {isMultiPage && !isLastPage && (
              // <Button circular icon="angle right" onClick={nextPage} />
              <button
                className="w-[36px] h-[36px] rounded-full bg-gray-300 grid place-items-center"
                onClick={nextPage}
              >
                <BiChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      )}
      <DrawingModal
        open={drawingModalOpen}
        dismiss={() => setDrawingModalOpen(false)}
        confirm={addDrawing}
      />

      <HelpModal open={helpModalOpen} dismiss={() => setHelpModalOpen(false)} />
    </div>
  );
};

export default App;
