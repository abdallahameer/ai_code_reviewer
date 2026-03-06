"use client";

import useSWR from "swr";
import { fetcher, useStreamReview } from "../helpers/utilities";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import "../styles/dashboard.css";
import {
  DashboardHeader,
  StatusBar,
  RepoSection,
  ActionButtons,
  ReviewOutput,
  ErrorBanner,
} from "../components/dashboard";

type FormValues = {
  full_name: string | null;
  number_of_prs: string | null;
  prName: string | null;
};

export default function Dashboard() {
  const { watch, setValue } = useForm<FormValues>({
    defaultValues: { full_name: null, number_of_prs: null, prName: null },
  });

  const formValues = watch();

  const router = useRouter();
  const { startReview, review, loading, cancelReview, error } =
    useStreamReview();
  const { data: isAuthenticated, isLoading } = useSWR("auth/check", fetcher);
  const { data: repoList } = useSWR("github/repos", fetcher);
  const reviewEndRef = useRef<HTMLDivElement>(null);

  const fullName = watch("full_name");

  const { data: prList } = useSWR(
    fullName ? `github/repos/${fullName}/pulls` : null,
    fetcher,
  );
  const { data: prDiff } = useSWR(
    formValues.number_of_prs
      ? `github/repos/${fullName}/pulls/${formValues.number_of_prs}/diff`
      : null,
    fetcher,
  );

  const { data: mainReviewData } = useSWR(
    fullName ? `github/repos/${fullName}/main-review` : null,
    fetcher,
  );

  const aiReview = async () => {
    if (prDiff?.diff) {
      await startReview([{ path: "PR Diff", content: prDiff.diff }]);
    } else if (mainReviewData?.files) {
      await startReview(mainReviewData.files);
    }
  };
  useEffect(() => {
    reviewEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [review]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated?.authenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated?.authenticated) return null;

  return (
    <div className="font-syne min-h-screen w-full flex flex-col items-center px-6 py-12 pb-20 text-slate-200">
      <DashboardHeader />

      <div
        className="glass border border-solid border-[#364153] w-full max-w-2xl rounded-2xl p-8"
        style={{
          boxShadow: "0 8px 40px #364153, inset 0 1px 0 #364153",
        }}
      >
        {/* Status bar */}
        <StatusBar fullName={fullName} prList={prList} />

        {/* Repo section */}
        <RepoSection
          reboList={repoList}
          fullName={fullName}
          mainReviewData={mainReviewData}
          prList={prList}
          setValue={setValue}
          formValues={formValues}
        />

        {/* Action row */}
        <ActionButtons
          loading={loading}
          mainReviewData={mainReviewData}
          onReview={aiReview}
          onCancel={cancelReview}
        />
      </div>

      {/* ── Error ── */}
      <ErrorBanner error={error} />

      {/* ── Review output ── */}
      <ReviewOutput
        review={review}
        loading={loading}
        reviewEndRef={reviewEndRef}
      />
    </div>
  );
}
