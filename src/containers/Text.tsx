"use client";

import React, { useState, useRef, useEffect } from "react";
import { Text as Component } from "../components/Text";
import { getMovePosition } from "../utils/helpers";
import { DragActions, TextMode } from "../entities";

interface Props {
  pageWidth: number;
  pageHeight: number;
  updateTextAttachment: (textObject: Partial<TextAttachment>) => void;
}

export const Text = ({
  x,
  y,
  text,
  width,
  height,
  lineHeight,
  size,
  fontFamily,
  pageHeight,
  pageWidth,
  updateTextAttachment,
}: TextAttachment & Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [newWidth, setNewWidth] = useState(width);
  const [newHeight, setNewHeight] = useState(height);
  const [content, setContent] = useState(text || "");
  const [mouseDown, setMouseDown] = useState(false);
  const [positionTop, setPositionTop] = useState(y);
  const [positionLeft, setPositionLeft] = useState(x);
  const [operation, setOperation] = useState<DragActions>(
    DragActions.NO_MOVEMENT
  );
  const [textMode, setTextMode] = useState<TextMode>(TextMode.COMMAND);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    if (mouseDown) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight
      );

      setPositionTop(top);
      setPositionLeft(left);
    }
  };

  // console.log("update text attachment function ", updateTextAttachment);

  const handleMousedown = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    // event.stopPropagation();

    if (textMode !== TextMode.COMMAND) {
      return;
    }

    setMouseDown(true);
    setOperation(DragActions.MOVE);
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (textMode !== TextMode.COMMAND) {
      return;
    }

    setMouseDown(false);

    if (operation === DragActions.MOVE) {
      const { top, left } = getMovePosition(
        positionLeft,
        positionTop,
        event.movementX,
        event.movementY,
        width,
        height,
        pageWidth,
        pageHeight
      );

      // updateTextAttachment({
      //   x: left,
      //   y: top,
      // });
      // console.log(
      //   "the ssssss swwww ",
      //   textAreaRef.current.getBoundingClientRect().width
      // );

      updateTextAttachment({
        x: left,
        y: top,
        // width: textAreaRef.current.getBoundingClientRect().width,
      });
    }

    // if (operation === DragActions.SCALE) {
    //     updateTextObject({
    //         x: positionLeft,
    //         y: positionTop,
    //     });

    // }

    setOperation(DragActions.NO_MOVEMENT);
  };

  const handleMouseOut = (event: React.MouseEvent<HTMLDivElement>) => {
    if (operation === DragActions.MOVE) {
      handleMouseUp(event);
    }

    if (textMode === TextMode.INSERT) {
      setTextMode(TextMode.COMMAND);
      prepareTextAndUpdate();
    }
  };

  const prepareTextAndUpdate = () => {
    // Deselect any selection when returning to command mode
    document.getSelection()?.removeAllRanges();

    const lines = [content];
    updateTextAttachment({
      lines,
      text: content,
    });
  };

  const toggleEditMode = () => {
    const input = inputRef.current;
    const mode =
      textMode === TextMode.COMMAND ? TextMode.INSERT : TextMode.COMMAND;

    setTextMode(mode);

    if (input && mode === TextMode.INSERT) {
      input.focus();
      input.select();
    } else {
      prepareTextAndUpdate();
    }
  };

  const toggleEditModeTextArea = () => {
    const input = textAreaRef.current;
    const mode =
      textMode === TextMode.COMMAND ? TextMode.INSERT : TextMode.COMMAND;

    setTextMode(mode);

    if (input && mode === TextMode.INSERT) {
      input.focus();
      input.select();
    } else {
      prepareTextAndUpdate();
    }
  };

  const onChangeText = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;
    setContent(value);
  };

  const onChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    console.log("I am from vaue content ", event.currentTarget.value);
    const value = event.currentTarget.value;
    setContent(value);
  };

  // console.log("from middle ", positionLeft, positionTop)

  // useEffect(() => {
  //   if (textAreaRef)
  //     // console.log("the text ref is ")
  // }, [textAreaRef]);

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
  //     console.log("hola hola ");
  //     textAreaRef.current.addEventListener("resize", handleResize);
  //   }

  //   // Clean up event listener when the component unmounts
  //   return () => {
  //     if (textAreaRef.current) {
  //       textAreaRef.current.removeEventListener("resize", handleResize);
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const textArea = textAreaRef.current;

    if (!textArea) return;

    // Initialize dimensions
    // setHeight(textArea.clientHeight);
    // setWidth(textArea.clientWidth);

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        console.log("height is ", entry.target.clientHeight);
        console.log("width is", entry.target.clientWidth);
        setNewHeight(entry.target.clientHeight);
        setNewWidth(entry.target.clientWidth);

        updateTextAttachment({
          width: entry.target.clientWidth,
          height: entry.target.clientHeight,
          // width: textAreaRef.current.getBoundingClientRect().width,
        });
      }
    });

    resizeObserver.observe(textArea);

    return () => {
      resizeObserver.unobserve(textArea);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Component
      text={content}
      width={width}
      height={height}
      mode={textMode}
      size={size}
      lineHeight={lineHeight}
      inputRef={inputRef}
      textAreaRef={textAreaRef}
      onChangeTextArea={onChangeTextArea}
      fontFamily={fontFamily}
      positionTop={positionTop}
      onChangeText={onChangeText}
      positionLeft={positionLeft}
      handleMouseUp={handleMouseUp}
      toggleEditMode={toggleEditMode}
      toggleEditModeTextArea={toggleEditModeTextArea}
      handleMouseOut={handleMouseOut}
      handleMouseDown={handleMousedown}
      handleMouseMove={handleMouseMove}
      setNewHeight={setNewHeight}
      setNewWidth={setNewWidth}
      pageHeight={pageHeight}
      pageWidth={pageWidth}
    />
  );
};
