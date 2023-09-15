"use client";

import { Dispatch, SetStateAction } from "react";

interface IToolsTab {
  tabs: { title: string; handleClick: () => void }[];
  activeIndex: number;
  setActiveIndex: Dispatch<SetStateAction<number>>;
}

const ToolsTab = ({ activeIndex, setActiveIndex, tabs }: IToolsTab) => {
  return (
    <div className="w-full gap-x-[20px] flex items-center justify-center bg-gray-100 py-[10px] px-[18px]  rounded-[10px] ">
      {tabs.map((tab, i) => (
        <span
          key={i}
          className={`text-black text-[14px] tracking-[0.5px] cursor-pointer whitespace-nowrap
          ${
            i == activeIndex &&
            "!bg-indigo-500 !text-white !rounded-[10px] !px-[10px] !py-[2px] grid place-items-center"
          }
          `}
          onClick={() => {
            tab.handleClick();
            setActiveIndex(i);
          }}
        >
          {tab.title}
        </span>
      ))}
    </div>
  );
};

export default ToolsTab;
