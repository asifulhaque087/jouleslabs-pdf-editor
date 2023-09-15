import React from "react";
import { Segment, Header, Icon, Button } from "semantic-ui-react";

interface Props {
  loading: boolean;
  uploadPdf: () => void;
}
export const Empty: React.FC<Props> = ({ loading, uploadPdf }) => (
  <div
    className="h-[80vh]"
    // data-testid="empty-container"
    // placeholder
    // loading={loading}
    // style={{ height: "80vh" }}
  >
    <div>
      {/* <Icon name="file pdf outline" /> */}
      Upload your PDF to start editing!
    </div>
    <button
      className="rounded px-[8px] py-[16px] bg-indigo-500 border-none outline-none"
      data-testid="empty-screen-upload-pdf-btn"
      onClick={uploadPdf}
    >
      Load PDF
    </button>
  </div>
);
