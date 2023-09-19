"use client";
import { AiOutlineFilePdf } from "react-icons/ai";
interface Props {
  loading: boolean;
  uploadPdf: () => void;
}
export const Empty: React.FC<Props> = ({ loading, uploadPdf }) => (
  <div className="h-[100vh] grid place-items-center">
    <button
      className="rounded px-[24px] py-[12px] bg-teal-500 border-none outline-none flex items-center justify-center text-white gap-x-[10px]"
      data-testid="empty-screen-upload-pdf-btn"
      onClick={uploadPdf}
    >
      <span>
        <AiOutlineFilePdf size={25} />
      </span>

      <span>Upload PDF files</span>
    </button>
  </div>
);
