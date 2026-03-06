"use client";

import useSWR from "swr";
import { fetcher } from "./helpers/utilities";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import SkeletonLoading from "./components/skeletonLoading";

export default function Home() {
  const { data: isAuthenticated, isLoading } = useSWR("auth/check", fetcher);
  const router = useRouter();
  useEffect(() => {
    if (isAuthenticated?.authenticated) router.replace("/dashboard");
  }, [isAuthenticated, router]);

  if (isLoading) {
    return <SkeletonLoading />;
  }

  return (
    <div className=" flex flex-col h-full items-center justify-center  p-6">
      <div className="w-full h-full max-w-md bg-linear-to-b from-gray-50 to-gray-100 rounded-2xl shadow-xl p-10 flex flex-col items-center text-center gap-6">
        <h1 className="text-4xl font-bold text-black">CodeSinior</h1>

        <p className="text-gray-600 leading-relaxed">
          Connect your GitHub account to review pull requests, analyze code
          quality, and get AI-powered feedback.
        </p>

        <a
          href="/api/auth/login"
          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition duration-200"
        >
          Continue with GitHub
        </a>

        <p className="text-sm text-gray-400">
          We only request access to your repositories.
        </p>
      </div>
    </div>
  );
}
