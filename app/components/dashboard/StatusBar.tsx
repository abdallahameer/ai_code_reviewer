interface StatusBarProps {
  fullName: string | null;
  prList: { pulls: Array<any> } | undefined;
}

export default function StatusBar({ fullName, prList }: StatusBarProps) {
  const hasPRs = prList?.pulls?.length > 0;

  return (
    <div className="font-mono-tech bg-black border border-solid border-[#364153] flex items-center gap-2 px-3.5 py-2.5 rounded-lg mb-6 text-xs">
      <span
        className={`w-1.5 h-1.5 rounded-full shrink-0 ${fullName ? "dot-pulse" : ""}`}
        style={{
          background: fullName ? "white" : "#334155",
          boxShadow: fullName ? "0 0 6px white" : "none",
        }}
      />
      <span className={fullName ? "white" : "text-slate-600"}>
        {fullName ? `connected · ${fullName}` : "no repository selected"}
      </span>

      {hasPRs && (
        <span
          className="font-mono-tech ml-auto text-sky-400 text-xs px-2.5 py-1 rounded-full"
          style={{
            background: "rgba(56,189,248,0.1)",
            border: "1px solid rgba(56,189,248,0.2)",
          }}
        >
          {prList.pulls.length} PR{prList.pulls.length !== 1 ? "s" : ""} open
        </span>
      )}
    </div>
  );
}
