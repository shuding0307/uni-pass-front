type InfoBlockProps = {
  label: string;
  value: string;
  bordered?: boolean;
};

export default function InfoBlock({ label, value, bordered = false }: InfoBlockProps) {
  return (
    <div
      className={[
        "text-right",
        bordered ? "border-l border-[#DDE1EA] pl-8" : ""
      ].join(" ")}
    >
      <p className="mb-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#737780]">
        {label}
      </p>
      <p className="text-xl font-black tracking-tight text-[#001E40] md:text-2xl">
        {value}
      </p>
    </div>
  );
}
