import RepoPr from "../ReboPr";
import ReboSelector from "../ReboSelector";
import { UseFormSetValue } from "react-hook-form";

interface RepoSectionProps {
  reboList: Array<any> | undefined;
  mainReviewData: { branch?: string; total_files?: number } | undefined;
  prList: { pulls: Array<any> } | undefined;
  setValue: UseFormSetValue<{
    full_name: string | null;
    number_of_prs: string | null;
  }>;
  formValues: {
    full_name: string | null;
    number_of_prs: string | null;
    prName: string | null;
  };
}

export default function RepoSection({
  reboList,
  mainReviewData,
  prList,
  setValue,
  formValues,
}: RepoSectionProps) {
  const hasPRs = prList?.pulls?.length > 0;

  return (
    <>
      {/* Repo label */}
      <div className="font-mono-tech flex items-center gap-2 text-white text-xs tracking-widest uppercase mb-2.5">
        <span className="inline-block w-4 h-px bg-white" />
        Repository
      </div>

      {/* Repo selector */}
      <div className="flex flex-col gap-3">
        <ReboSelector
          reboList={reboList}
          label={
            formValues.full_name
              ? formValues.full_name
              : "Select a repository..."
          }
          setValue={setValue}
          hasPRs={hasPRs}
        />
        {hasPRs && (
          <RepoPr
            setValue={setValue}
            label={
              formValues.prName ? formValues.prName : "Select a pull request..."
            }
            prList={prList}
          />
        )}
      </div>
      {/* Divider */}
      <div
        className="my-6 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, white, transparent)",
        }}
      />

      {/* Info row — shown only after a repo is selected */}
      {formValues.full_name && (
        <div className="font-mono-tech flex gap-5 text-xs text-slate-600 mb-4">
          <span>
            branch:{" "}
            <span className="text-white">{mainReviewData?.branch ?? "—"}</span>
          </span>
          <span>
            files:{" "}
            <span className="text-white">
              {mainReviewData?.total_files ?? "—"}
            </span>
          </span>
          <span>
            mode:{" "}
            <span className="text-white">
              {hasPRs ? "pr-diff" : "main-branch"}
            </span>
          </span>
        </div>
      )}
    </>
  );
}
