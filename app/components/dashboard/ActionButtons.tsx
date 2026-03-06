interface ActionButtonsProps {
  loading: boolean;
  mainReviewData: any;
  onReview: () => void;
  onCancel: () => void;
}

export default function ActionButtons({
  loading,
  mainReviewData,
  onReview,
  onCancel,
}: ActionButtonsProps) {
  return (
    <div className="flex items-center gap-3 mt-6">
      <button
        className={`${!loading && mainReviewData ? "hover:cursor-pointer" : ""} font-mono-tech bg-white text-black flex-1 flex items-center justify-center gap-2 py-3.5 px-5 rounded-xl text-sm font-bold tracking-wider transition-all duration-200 disabled:opacity-35 disabled:cursor-not-allowed`}
        style={{
          color: "#0f172a",
          boxShadow: !mainReviewData || loading ? "none" : "0 4px 20px white",
        }}
        onClick={loading ? undefined : onReview}
        disabled={!mainReviewData || loading}
      >
        {loading ? (
          <>
            <span
              className="spinner inline-block w-3.5 h-3.5 rounded-full shrink-0"
              style={{
                border: "2px solid rgba(15,23,42,0.3)",
                borderTopColor: "#0f172a",
              }}
            />
            analyzing...
          </>
        ) : (
          "▶ run ai review"
        )}
      </button>

      {loading && (
        <button
          className="font-mono-tech py-3.5 px-4 rounded-xl text-sm text-red-400 transition-colors duration-200 whitespace-nowrap hover:bg-red-500/20"
          style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.25)",
          }}
          onClick={onCancel}
        >
          ✕ cancel
        </button>
      )}
    </div>
  );
}
