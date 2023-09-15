"use client";

import { UploadTypes, useFileUploader } from "@/hooks/useFileUploader";
import { UploadPdf } from "@/components/UploadPdf";

const App: React.FC = () => {
  const {
    inputRef: pdfInput,
    handleClick: handlePdfClick,
    isUploading,
    onClick,
    upload: uploadPdf,
  } = useFileUploader({
    use: UploadTypes.PDF,
    afterUploadPdf: () => {},
  });

  const hiddenInputs = (
    <>
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
    </>
  );

  return (
    <div className="m-[30px]">
      {hiddenInputs}
      <div>this si for file uploading</div>
      <UploadPdf loading={isUploading} uploadPdf={handlePdfClick} />
    </div>
  );
};

export default App;
