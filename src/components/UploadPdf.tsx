"use client";

interface Props {
  loading: boolean;
  uploadPdf: () => void;
}

export const UploadPdf: React.FC<Props> = ({ loading, uploadPdf }) => (
  <div className="h-[80vh]">
    <div>Upload your PDF to start editing!</div>
    <button
      className="rounded px-[8px] py-[16px] bg-indigo-500 border-none outline-none"
      data-testid="empty-screen-upload-pdf-btn"
      onClick={uploadPdf}
    >
      Load PDF
    </button>
  </div>
);
