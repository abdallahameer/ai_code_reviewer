interface DashboardHeaderProps {}

export default function DashboardHeader() {
  return (
    <div className="flex flex-col items-center mb-12">
      <div className="flex items-center gap-3 mb-1.5">
        <div
          className="w-9 h-9 border border-solid shadow shadow-white border-gray-400 rounded-lg flex items-center justify-center"
          style={{
            border: "1.5px solid #",
            boxShadow: "0 0 12px white",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        </div>
        <span className="gradient-text text-4xl font-extrabold tracking-tight">
          CodeSinior
        </span>
      </div>
      <span className="font-mono-tech text-xs text-gray-500 tracking-widest uppercase">
        AI-Powered Code Review
      </span>
    </div>
  );
}
