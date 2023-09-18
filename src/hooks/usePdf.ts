"use client";

import { useState, useCallback, createRef } from "react";
import { save, saveAndPreview } from "../utils/pdf";

export interface Pdf {
  name: string;
  file: File;
  pageIndex?: number;
  pages: Promise<any>[];
}

export const usePdf = () => {
  const [name, setName] = useState("");
  const [pageIndex, setPageIndex] = useState(-1);
  const [dimensions, setDimensions] = useState<Dimensions>();
  const [file, setFile] = useState<File>();
  const [pages, setPages] = useState<any>([]);
  const [isMultiPage, setIsMultiPage] = useState(false);
  const [isFirstPage, setIsFirstPage] = useState(false);
  const [isLastPage, setIsLastPage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // const previewRef = createRef<HTMLInputElement>();
  const previewRef = createRef<HTMLIFrameElement>();

  const currentPage = pages[pageIndex];

  const setDimensionsHandler = useCallback(setDimensions, [setDimensions]);

  const nextPage = () => {
    const newPageIndex = pageIndex + 1;
    setPageIndex(pageIndex + 1);
    setIsFirstPage(newPageIndex === 0);
    setIsLastPage(newPageIndex === pages.length - 1);
  };

  const previousPage = () => {
    const newPageIndex = pageIndex - 1;
    setPageIndex(newPageIndex);
    setIsFirstPage(newPageIndex === 0);
    setIsLastPage(newPageIndex === pages.length - 1);
  };

  const initialize = ({ name, file, pages: _pages, pageIndex = 0 }: Pdf) => {
    const multi = _pages.length > 1;
    setName(name);
    setFile(file);
    setPages(_pages);
    setPageIndex(pageIndex);
    setIsMultiPage(multi);
    // setIsFirstPage(true);
    // setIsLastPage(_pages.length === 1);
  };

  const savePdf = async (attachments: Attachments[]) => {
    if (isSaving || !file) return;

    setIsSaving(true);

    try {
      await save(file, attachments, name);
    } catch (e) {
      console.log(e);
    } finally {
      setIsSaving(false);
    }
  };

  const previewPdf = async (attachments: Attachments[]) => {
    if (!file) return;

    try {
      await saveAndPreview(file, attachments, name, previewRef.current!);
    } catch (e) {
      console.log(e);
    } finally {
      // setIsSaving(false);
    }
  };

  return {
    currentPage,
    dimensions,
    setDimensions: setDimensionsHandler,
    name,
    setName,
    pageIndex,
    setPageIndex,
    file,
    setFile,
    nextPage,
    pages,
    savePdf,
    previewPdf,
    initialize,
    isMultiPage,
    previousPage,
    isFirstPage,
    isLastPage,
    isSaving,
    previewRef,
  };
};
