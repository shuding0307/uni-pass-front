type InfoBlockProps = {
  id?: string;
  department?: string;
};

export default function InfoBlock({
  id = "",
  department = "",
}: InfoBlockProps) {
  return (
    <div className="flex">
      <div className="text-left mr-5 ">
        <p className="mb-1 text-[15px] uppercase tracking-[0.2em] text-[#737780]">
          학번
        </p>
        <p className="text-l tracking-tight text-[#343434] md:text-2xl">{id}</p>
      </div>
      <div className="text-left border-l border-[#DDE1EA] pl-8">
        <p className="mb-1 text-[15px] uppercase tracking-[0.2em] text-[#737780]">
          학과
        </p>
        <p className="text-[10px] tracking-tight text-[#343434] md:text-2xl">
          {department ?? "컴퓨터공학과"}
        </p>
      </div>
    </div>
  );
}
