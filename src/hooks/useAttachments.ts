"use client";

import { convertToBase64, getBase64 } from "@/utils/helpers";
import { useReducer, useCallback } from "react";

enum ActionType {
  RESET = "RESET",
  INIT = "INIT",
  ADD_ATTACHMENT = "ADD_ATTACHMENT",
  REMOVE_ATTACHMENT = "REMOVE_ATTACHMENT",
  UPDATE_ATTACHMENT = "UPDATE_ATTACHMENT",
  UPDATE_PAGE_INDEX = "UPDATE_PAGE_INDEX",
}

interface State {
  pageIndex: number;
  allPageAttachments: Attachments[];
  pageAttachments: Attachments;
}

type Action =
  | { type: ActionType.UPDATE_PAGE_INDEX; pageIndex: number }
  | { type: ActionType.ADD_ATTACHMENT; attachment: Attachment }
  | { type: ActionType.REMOVE_ATTACHMENT; attachmentIndex: number }
  | {
      type: ActionType.UPDATE_ATTACHMENT;
      attachmentIndex: number;
      attachment: Partial<Attachment>;
    }
  | { type: ActionType.RESET; numberOfPages: number }
  | { type: ActionType.INIT; data: State };

const initialState: State = {
  pageIndex: -1,
  allPageAttachments: [],
  pageAttachments: [],
};

const reducer = (state: State, action: Action) => {
  const { pageIndex, allPageAttachments, pageAttachments } = state;

  switch (action.type) {
    case ActionType.ADD_ATTACHMENT: {
      // console.log("ajfdfasldf fslja")
      const newAllPageAttachmentsAdd = allPageAttachments.map(
        (attachments, index) =>
          pageIndex === index
            ? [...attachments, action.attachment]
            : attachments
      );

      const processAttachs = async () => {
        let attachs = localStorage.getItem("attachs")
          ? JSON.parse(localStorage.getItem("attachs")!)
          : undefined;

        if (!attachs) {
          attachs = { ...state };
        }

        const tempAttach = {
          ...action.attachment,
        };

        if (tempAttach.type === "image") {
          tempAttach.file = await getBase64(tempAttach.file);
          // tempAttach.file = convertToBase64(tempAttach.file);
        }

        const localStore = attachs.allPageAttachments.map(
          (attachments, index) =>
            pageIndex === index ? [...attachments, tempAttach] : attachments
        );

        const newObj = {
          ...attachs,
          pageIndex,
          allPageAttachments: localStore,
          pageAttachments: localStore[pageIndex],
        };

        localStorage.setItem("attachs", JSON.stringify(newObj));
      };

      processAttachs();

      return {
        // ...state,
        // allPageAttachments: newObj.allPageAttachments,
        // pageAttachments: newObj.pageAttachments,
        ...state,
        allPageAttachments: newAllPageAttachmentsAdd,
        pageAttachments: newAllPageAttachmentsAdd[pageIndex],
      };
    }
    case ActionType.REMOVE_ATTACHMENT: {
      const newAllPageAttachmentsRemove = allPageAttachments.map(
        (otherPageAttachments, index) =>
          pageIndex === index
            ? pageAttachments.filter(
                (_, _attachmentIndex) =>
                  _attachmentIndex !== action.attachmentIndex
              )
            : otherPageAttachments
      );

      return {
        ...state,
        allPageAttachments: newAllPageAttachmentsRemove,
        pageAttachments: newAllPageAttachmentsRemove[pageIndex],
      };
    }
    case ActionType.UPDATE_ATTACHMENT: {
      console.log("i am update");
      if (pageIndex === -1) {
        return state;
      }

      const newAllPageAttachmentsUpdate = allPageAttachments.map(
        (otherPageAttachments, index) =>
          pageIndex === index
            ? pageAttachments.map((oldAttachment, _attachmentIndex) =>
                _attachmentIndex === action.attachmentIndex
                  ? { ...oldAttachment, ...action.attachment }
                  : oldAttachment
              )
            : otherPageAttachments
      );

      const attachs = localStorage.getItem("attachs")
        ? JSON.parse(localStorage.getItem("attachs")!)
        : undefined;

      if (attachs) {
        const localStore = attachs.allPageAttachments.map(
          (otherPageAttachments, index) =>
            pageIndex === index
              ? attachs.pageAttachments.map((oldAttachment, _attachmentIndex) =>
                  _attachmentIndex === action.attachmentIndex
                    ? {
                        ...oldAttachment,
                        ...action.attachment,
                        file: oldAttachment.file,
                      }
                    : oldAttachment
                )
              : otherPageAttachments
        );

        const newObj = {
          ...attachs,
          pageIndex,
          allPageAttachments: localStore,
          pageAttachments: localStore[pageIndex],
        };

        localStorage.setItem("attachs", JSON.stringify(newObj));

        // console.log("local store is ", localStore);
      }

      return {
        ...state,
        allPageAttachments: newAllPageAttachmentsUpdate,
        pageAttachments: newAllPageAttachmentsUpdate[pageIndex],
      };
    }
    case ActionType.UPDATE_PAGE_INDEX: {
      return {
        ...state,
        pageIndex: action.pageIndex,
        pageAttachments: allPageAttachments[action.pageIndex],
      };
    }
    case ActionType.RESET: {
      return {
        pageIndex: 0,
        pageAttachments: [],
        allPageAttachments: Array(action.numberOfPages).fill([]),
      };
    }

    case ActionType.INIT: {
      return {
        // pageIndex: 0,
        // pageAttachments: [],
        // allPageAttachments: Array(action.numberOfPages).fill([]),
        ...action.data,
      };
    }
    default: {
      return state;
    }
  }
};

export const useAttachments = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { allPageAttachments, pageAttachments } = state;

  // console.log("from attach ", allPageAttachments, pageAttachments);

  const add = (newAttachment: Attachment) =>
    dispatch({ type: ActionType.ADD_ATTACHMENT, attachment: newAttachment });

  const remove = (attachmentIndex: number) =>
    dispatch({ type: ActionType.REMOVE_ATTACHMENT, attachmentIndex });

  const update = (attachmentIndex: number, attachment: Partial<Attachment>) =>
    dispatch({
      type: ActionType.UPDATE_ATTACHMENT,
      attachmentIndex,
      attachment,
    });

  const reset = (numberOfPages: number) =>
    dispatch({ type: ActionType.RESET, numberOfPages });

  const initAttachs = (data: State) =>
    dispatch({ type: ActionType.INIT, data });

  const setPageIndex = useCallback(
    (index: number) =>
      dispatch({ type: ActionType.UPDATE_PAGE_INDEX, pageIndex: index }),
    [dispatch]
  );

  return {
    add,
    initAttachs,
    reset,
    remove,
    update,
    setPageIndex,
    pageAttachments,
    allPageAttachments,
  };
};
