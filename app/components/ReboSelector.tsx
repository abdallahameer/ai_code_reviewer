"use client";

import { useState } from "react";
import { UseFormSetValue } from "react-hook-form";

interface Repo {
  full_name: string;
  id: number;
  name: string;
  private: boolean;
}

interface Repository {
  repos: Repo[];
}

type FormValues = {
  full_name: string | null;
  number_of_prs: string | null;
  prName: string | null;
};

type Props = {
  label: string;
  setValue: UseFormSetValue<FormValues>;
  reboList: Repository | undefined;
  hasPRs: boolean;
};

export default function ReboSelector({
  label,
  setValue,
  reboList,
  hasPRs,
}: Props) {
  const [isSelected, setIsSelected] = useState<boolean>(false);
  const [selectedRebo, setSelectedRebo] = useState<Repository | null>(null);

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
          {reboList?.repos?.map((repo: Repo) => {
            return (
              <div
                className="hover:bg-[#0F0F0F] hover:text-gray-300 p-3 rounded-sm"
                key={repo.id}
                onClick={() => {
                  setValue("full_name", repo.full_name);
                  if (hasPRs) {
                    setValue("number_of_prs", null);
                  }
                }}
              >
                {repo.full_name}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
