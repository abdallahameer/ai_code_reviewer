import { RefObject } from "react";

interface ReviewOutputProps {
  review: string;
  loading: boolean;
  reviewEndRef: RefObject<HTMLDivElement>;
}

export default function ReviewOutput({
  review,
  loading,
  reviewEndRef,
}: ReviewOutputProps) {
  if (!review && !loading) return null;

  return (
    <div
      className="glass-dark  w-full max-w-2xl mt-5 rounded-2xl overflow-hidden"
      style={{
        border: "1px solid rgba(56,189,248,0.15)",
        boxShadow: "0 8px 40px rgba(0,0,0,0.5)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-3.5"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.1)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <span className="font-mono-tech flex items-center gap-2 text-white text-xs tracking-widest uppercase">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
          review output
        </span>

        {loading && (
          <span
            className="spinner inline-block w-3.5 h-3.5 rounded-full"
            style={{
              border: "2px solid rgba(255,255,255,0.2)",
              borderTopColor: "white",
            }}
          />
        )}

        {!loading && review && (
          <span className="font-mono-tech flex items-center gap-1.5 text-white text-xs">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-white" />
            complete
          </span>
        )}
      </div>

      {/* Body */}
      <div
        className="p-6 overflow-y-auto"
        style={{
          maxHeight: "480px",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.3) transparent",
        }}
      >
        <pre className="font-mono-tech text-xs leading-7 text-gray-300 whitespace-pre-wrap break-words m-0">
          {review}
          {loading && (
            <span className="cursor-blink inline-block w-2 h-3.5 bg-white ml-0.5 align-middle" />
          )}
        </pre>
        <div ref={reviewEndRef} />
      </div>
    </div>
  );
}
