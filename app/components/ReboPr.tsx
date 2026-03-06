"use client";

import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface PullRequests {
  pulls: PullRequest[];
}

interface PullRequest {
  id: number;
  title: string;
}

type FormValues = {
  full_name: string | null;
  number_of_prs: string | null;
  prName: string | null;
};

type Props = {
  label: string;
  setValue: UseFormSetValue<FormValues>;
  prList: PullRequests;
};

export default function RepoPr({ label, setValue, prList }: Props) {
  const [isSelected, setIsSelected] = useState<boolean>(false);

  return (
    <div>
      <div
        className={`w-150 min-h-16 border rounded-md flex flex-col gap-4 items-center justify-center cursor-pointer transition-colors ${
          isSelected ? "bg-white text-black p-4" : "bg-black text-gray-300"
        }`}
        onClick={() => setIsSelected(!isSelected)}
      >
        <p>{label}</p>
        <div
          className={`transition-all duration-700 overflow-auto flex flex-col w-full justify-between scrollbar-hide ${
            isSelected ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {prList?.pulls?.map((pr: any) => {
            return (
              <div
                className="hover:bg-[#0F0F0F] hover:text-gray-300 p-3 rounded-sm"
                key={pr.id}
                onClick={() => {
                  setValue("number_of_prs", pr.number.toString());
                  setValue("prName", pr.title);
                }}
              >
                {pr.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
