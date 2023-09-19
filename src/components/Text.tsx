"use client";

import React, { RefObject, useEffect } from "react";
import { TextMode } from "../entities";

interface Props {
  inputRef: RefObject<HTMLInputElement>;
  textAreaRef: RefObject<HTMLTextAreaElement>;
  text?: string;
  mode: string;
  width: number;
  size?: number;
  height: number;
  lineHeight?: number;
  fontFamily?: string;
  positionTop: number;
  positionLeft: number;
  toggleEditMode: () => void;
  toggleEditModeTextArea: () => void;
  handleMouseDown: DragEventListener<HTMLDivElement>;
  handleMouseUp: DragEventListener<HTMLDivElement>;
  handleMouseMove: DragEventListener<HTMLDivElement>;
  handleMouseOut: DragEventListener<HTMLDivElement>;
  onChangeText: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onChangeTextArea: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setNewWidth: React.Dispatch<React.SetStateAction<number>>;
  setNewHeight: React.Dispatch<React.SetStateAction<number>>;

  pageWidth: number;
  pageHeight: number;
}

export const Text: React.FC<Props> = ({
  text,
  width,
  height,
  inputRef,
  textAreaRef,
  mode,
  size,
  fontFamily,
  positionTop,
  positionLeft,
  onChangeText,
  onChangeTextArea,
  toggleEditMode,
  toggleEditModeTextArea,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleMouseUp,
  lineHeight,
  setNewHeight,
  setNewWidth,
  pageWidth,
  pageHeight,
}) => {
  // console.log("the default positionis ", positionLeft, positionTop)

  // useEffect(() => {
  //   console.log(
  //     // "the width is ",
  //     textAreaRef.current.getBoundingClientRect().width
  //   );
  //   // getBoundingClientRect().width
  // }, []);

  // useEffect(() => {
  //   const handleResize = () => {
  //     if (textAreaRef.current) {
  //       // setHeight(textAreaRef.current.clientHeight);
  //       // setWidth(textAreaRef.current.clientWidth);
  //       console.log("te asldfa ", textAreaRef.current.clientWidth);
  //     }
  //   };

  //   // Attach event listeners for resizing
  //   if (textAreaRef.current) {
  //     console.log("hola hola ")
  //     textAreaRef.current.addEventListener("resize", handleResize);
  //   }

  //   // Clean up event listener when the component unmounts
  //   return () => {
  //     if (textAreaRef.current) {
  //       textAreaRef.current.removeEventListener("resize", handleResize);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   const textArea = textAreaRef.current;

  //   if (!textArea) return;

  //   // Initialize dimensions
  //   // setHeight(textArea.clientHeight);
  //   // setWidth(textArea.clientWidth);

  //   const resizeObserver = new ResizeObserver((entries) => {
  //     for (let entry of entries) {
  //       // console.log("jskadf asdfa jlkl ", entry.target.clientHeight)
  //       console.log("jskadf asdfa jlkl ", entry.target.clientWidth);
  //       setNewHeight(entry.target.clientHeight);
  //       setNewWidth(entry.target.clientWidth);
  //     }
  //   });

  //   resizeObserver.observe(textArea);

  //   return () => {
  //     resizeObserver.unobserve(textArea);
  //     resizeObserver.disconnect();
  //   };
  // }, []);

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseOut={handleMouseOut}
      // onDoubleClick={toggleEditMode}
      onDoubleClick={toggleEditModeTextArea}
      style={{
        // width,
        // border: 1,
        // height,
        // fontFamily,
        // fontSize: size,
        // lineHeight,
        // cursor: mode === TextMode.COMMAND ? "move" : "default",
        top: positionTop,
        left: positionLeft,
        borderColor: "gray",
        borderStyle: "solid",
        wordWrap: "break-word",
        padding: 0,
        position: "absolute",
      }}
      className="bg-black w-full"
    >
      {/* <input
        className="bg-green-500 text-indigo-500"
        type="text"
        ref={inputRef}
        onChange={onChangeText}
        readOnly={mode === TextMode.COMMAND}
        style={{
          width: "100%",
          borderStyle: "none",
          borderWidth: 0,
          fontFamily,
          fontSize: size,
          outline: "none",
          padding: 0,
          boxSizing: "border-box",
          lineHeight,
          height,
          margin: 0,
          backgroundColor: "transparent",
          cursor: mode === TextMode.COMMAND ? "move" : "text",
        }}
        value={text}
      /> */}

      <textarea
        // rows={5}
        // cols={60}
        // rows={4}
        // cols={50}
        style={{ maxWidth: `${pageWidth}px`, maxHeight: `${pageHeight}px` }}
        className="bg-green-500 text-indigo-500 resize"
        ref={textAreaRef}
        onChange={onChangeTextArea}
        // readOnly={mode === TextMode.COMMAND}
        // style={{
        //   // width: "100%",
        //   borderStyle: "none",
        //   borderWidth: 0,
        //   fontFamily,
        //   fontSize: size,
        //   outline: "none",
        //   padding: 0,
        //   boxSizing: "border-box",
        //   lineHeight,
        //   // height,
        //   margin: 0,
        //   backgroundColor: "transparent",
        //   cursor: mode === TextMode.COMMAND ? "move" : "text",
        // }}
        value={text}
      />
    </div>
  );
};
