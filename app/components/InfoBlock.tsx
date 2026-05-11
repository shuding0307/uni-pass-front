type InfoBlockProps = {
  label: string;
  value: string;
  border?: boolean;
};

export default function InfoBlock({
  label,
  value,
  border = false
}: InfoBlockProps) {
  return (
    <div className={`text-right ${border ? "border-l border-slate-200 pl-12" : ""}`}>
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
        {label}
      </p>
      <p className="text-2xl font-black tracking-tight text-slate-800">
        {value}
      </p>
    </div>
  );
}
