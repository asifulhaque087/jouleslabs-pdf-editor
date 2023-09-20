"use client";

import React, { useState, useLayoutEffect, useEffect } from "react";
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
import { base64StringToFile, ggID } from "@/utils/helpers";
import "semantic-ui-css/semantic.min.css";

import { Container, Grid, Button, Segment } from "semantic-ui-react";
import Preview from "@/components/Preview";
import { readAsPDF } from "@/utils/asyncReader";
import { getAsset, prepareAssets } from "@/utils/prepareAssets";
import { PDFDocument, StandardFonts, degrees, rgb } from "pdf-lib";
import Zoom from "@/components/Zoom";

const App: React.FC = () => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [drawingModalOpen, setDrawingModalOpen] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
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
    previewPdf,
    previousPage,
    nextPage,
    setDimensions,
    name,
    dimensions,
    previewRef,
    resetPdf,
  } = usePdf();
  const {
    add: addAttachment,
    allPageAttachments,
    pageAttachments,
    reset: resetAttachments,
    update,
    remove,
    setPageIndex,
    initAttachs,
  } = useAttachments();

  const initializePageAndAttachments = (pdfDetails: Pdf) => {
    initialize(pdfDetails);

    const numberOfPages = pdfDetails.pages.length;
    // resetAttachments(numberOfPages);

    const attachs = localStorage.getItem("attachs")
      ? JSON.parse(localStorage.getItem("attachs")!)
      : undefined;

    // console.log("attachs are from localstorage ", attachs);

    // attachs.pageAttachments.

    initAttachs({
      //   allPageAttachments: [],
      //   pageAttachments: [],
      //   pageIndex: -1,

      // allPageAttachments:
      //   attachs?.allPageAttachments || Array(numberOfPages).fill([]),
      // pageAttachments: attachs?.pageAttachments || [],
      // pageIndex: attachs?.pageIndex || -1,

      pageIndex: attachs?.pageIndex || 0,
      allPageAttachments:
        attachs?.allPageAttachments.map((page) => {
          return page.map((attach) => {
            if (attach.type === "image") {
              const modifiedFile = base64StringToFile(attach.file, "img1");
              return { ...attach, file: modifiedFile };
            }
            return attach;
          });
        }) || Array(numberOfPages).fill([]),
      pageAttachments:
        attachs?.pageAttachments.map((attach) => {
          if (attach.type === "image") {
            const modifiedFile = base64StringToFile(attach.file, "img2");
            return { ...attach, file: modifiedFile };
          }
          return attach;
        }) || [],
    });
  };

  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
    pdfUpload,
    removeFile,
    progress,
    setProgress,
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

  const deletePdf = async () => {
    await removeFile();

    localStorage.clear();
    setProgress(0);
    resetPdf();
    initAttachs({
      allPageAttachments: [],
      pageAttachments: [],
      pageIndex: -1,
    });
  };

  const addText = () => {
    const newTextAttachment: TextAttachment = {
      id: ggID()(),
      type: AttachmentTypes.TEXT,
      x: 0,
      y: 0,
      // width: 120,
      // height: 25,
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
      id: ggID()(),
      type: AttachmentTypes.DRAWING,
      ...drawing,
      x: 0,
      y: 0,
      scale: 1,
    };
    addAttachment(newDrawingAttachment);
  };

  useLayoutEffect(() => setPageIndex(pageIndex), [pageIndex, setPageIndex]);

  const modifyPdf = async () => {
    // const filePath = "/merged.pdf";
    const filePath = "http://localhost:3003/cache.pdf";
    const response = await fetch(filePath);

    console.log(response);

    if (!response.ok) return;

    const fileBlob = await response.blob();

    // Create a File object from the Blob
    const file = new File([fileBlob], "merged.pdf", {
      type: "application/pdf",
    });

    pdfUpload(file);
  };

  useEffect(() => {
    console.log("pages are ", currentPage);
    // local storage a data thakle get hobe akane
    // prepareAssets();

    modifyPdf();

    // handle

    // processStore();
  }, []);

  const hiddenInputs = (
    <>
      <input
        data-testid="pdf-input"
        multiple={true}
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
        // id="image"
        name="image"
        accept="image/*"
        onClick={onImageClick}
        style={{ display: "none" }}
        onChange={uploadImage}
      />
    </>
  );

  const handleSavePdf = () => savePdf(allPageAttachments);

  const handlePreviewPdf = () => {
    setIsPreview(true);

    previewPdf(allPageAttachments);
  };

  // console.log("the  current page is ", currentPage);
  // console.log("the  attachs are ", allPageAttachments);

  return (
    <div className="m-[30px]] bg-indigo-500">
      {hiddenInputs}

      {!file ? (
        <Empty progres={progress} uploadPdf={handlePdfClick} />
      ) : (
        <>
          <div className="p-[30px]">
            <MenuBar
              deletePdf={deletePdf}
              openHelp={() => setHelpModalOpen(true)}
              savePdf={handleSavePdf}
              previewPdf={handlePreviewPdf}
              addText={addText}
              addImage={handleImageClick}
              addDrawing={() => setDrawingModalOpen(true)}
              savingPdfStatus={isSaving}
              uploadNewPdf={handlePdfClick}
              isPdfLoaded={!!file}
            />
          </div>

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
                  <Zoom
                    dimensions={dimensions}
                    updateDimensions={setDimensions}
                    page={currentPage}
                    pdfName={name}
                    removeAttachment={remove}
                    updateAttachment={update}
                    pageDimensions={dimensions}
                    attachments={pageAttachments}
                  />

                  {/* <div style={{ position: "relative" }}>
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
                </div> */}
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
        </>
      )}

      {/* previewModal */}

      <div
        className={`fixed top-0 bottom-0 left-0 right-0 bg-indigo-500 ${
          isPreview ? "block" : "hidden"
        } `}
      >
        <div className="p-[5px]">
          <button
            className="rounded px-[8px] py-[8px] border border-red-500 text-red-500 outline-none"
            data-testid="empty-screen-upload-pdf-btn"
            onClick={() => setIsPreview(false)}
          >
            escape preview
          </button>
        </div>
        <div className="flex justify-center w-full h-full">
          <Preview previewRef={previewRef} />
        </div>
      </div>

      {/* <DrawingModal
        open={drawingModalOpen}
        dismiss={() => setDrawingModalOpen(false)}
        confirm={addDrawing}
      /> */}

      <HelpModal open={helpModalOpen} dismiss={() => setHelpModalOpen(false)} />
    </div>
  );
};

export default App;
