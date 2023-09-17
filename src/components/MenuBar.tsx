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
      handleClick: uploadNewPdf,
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

  return (
    <Menu pointing>
      <Menu.Item header>PDF Editor</Menu.Item>
      <Menu.Menu position="right">
        {isPdfLoaded && (
          <>
            <Dropdown
              data-testid="edit-menu-dropdown"
              item
              closeOnBlur
              icon="edit outline"
              simple
            >
              <Dropdown.Menu>
                <Dropdown.Item onClick={addText}>Add Text</Dropdown.Item>
                <Dropdown.Item onClick={addImage}>Add Image</Dropdown.Item>
                <Dropdown.Item onClick={addDrawing}>Add Drawing</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Menu.Item
              data-testid="save-menu-item"
              name={savingPdfStatus ? "Saving..." : "Save"}
              disabled={savingPdfStatus}
              onClick={savePdf}
            />
            <Menu.Item
              data-testid="upload-menu-item"
              name="Upload New"
              onClick={uploadNewPdf}
            />
          </>
        )}
        <Menu.Item data-testid="help-menu-item" onClick={openHelp}>
          <Icon name="question circle outline" />
        </Menu.Item>
      </Menu.Menu>
    </Menu>
  );
};
