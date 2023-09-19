"use client";
import { AiOutlineFilePdf } from "react-icons/ai";
interface Props {
  // loading: boolean;
  uploadPdf: () => void;
  progres: number;
}
export const Empty: React.FC<Props> = ({ progres, uploadPdf }) => (
  <div className="h-[100vh] grid place-items-center">
    <div className="flex flex-col gap-y-[10px]">
      {/* top */}
      <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
        <div
          className="bg-orange-600 text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
          // style={{ width: `${45}%` }}
          style={{ width: `${progres}%` }}
        >
          {progres}%
        </div>
      </div>

      {/* bottom */}
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
  </div>
);
