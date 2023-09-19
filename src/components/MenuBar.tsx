import React, { useState } from "react";
import { Menu, Dropdown, Icon } from "semantic-ui-react";
import ToolsTab from "./ToolsTab";

interface Props {
  openHelp: () => void;
  uploadNewPdf: () => void;
  addText: () => void;
  addImage: () => void;
  addDrawing: () => void;
  isPdfLoaded: boolean;
  savingPdfStatus: boolean;
  savePdf: () => void;
  previewPdf: () => void;
  deletePdf: () => void;
}

export const MenuBar: React.FC<Props> = ({
  openHelp,
  uploadNewPdf,
  addDrawing,
  addText,
  addImage,
  isPdfLoaded,
  savingPdfStatus,
  savePdf,
  previewPdf,
  deletePdf,
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  //     <Menu.Item
  //       data-testid="save-menu-item"
  //       name={savingPdfStatus ? "Saving..." : "Save"}
  //       disabled={savingPdfStatus}
  //       onClick={savePdf}
  //     />
  //     <Menu.Item
  //       data-testid="upload-menu-item"
  //       name="Upload New"
  //       onClick={uploadNewPdf}
  //     />
  //   </>
  // )}
  // <Menu.Item data-testid="help-menu-item" onClick={openHelp}>
  //   <Icon name="question circle outline" />
  // </Menu.Item>

  const confirmUpload = () => {
    const yes = window.confirm(
      "Are you sure, your current file will be deleted"
    );

    if (yes) {
      return uploadNewPdf();
    }
  };

  const confirmDelete = () => {
    const yes = window.confirm("Are you sure, want to delete this file");

    if (yes) {
      return deletePdf();
    }
  };

  const tabs = [
    {
      title: "Add text",
      handleClick: addText,
    },

    {
      title: "Add image",
      handleClick: addImage,
    },

    {
      title: "Add drawing",
      handleClick: addDrawing,
    },

    {
      title: "preview",
      handleClick: previewPdf,
    },

    {
      title: "save",
      handleClick: savePdf,
    },

    {
      title: "upload new",
      handleClick: confirmUpload,
      // handleClick: uploadNewPdf,
    },

    {
      title: "Delete pdf",
      handleClick: confirmDelete,
    },

    {
      title: "Help",
      handleClick: openHelp,
    },
  ];

  return (
    <div>
      {isPdfLoaded ? (
        <ToolsTab
          tabs={tabs}
          activeIndex={activeIndex}
          setActiveIndex={setActiveIndex}
        />
      ) : null}
    </div>
  );
};
