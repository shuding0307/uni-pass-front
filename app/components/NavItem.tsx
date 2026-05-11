import type { ReactNode } from "react";

type NavItemProps = {
  icon: ReactNode;
  label: string;
  active?: boolean;
};

export default function NavItem({ icon, label, active = false }: NavItemProps) {
  return (
    <div
      className={[
        "flex items-center gap-4 rounded-2xl px-6 py-4 transition-colors",
        active
          ? "bg-indigo-50 font-black text-indigo-700"
          : "font-bold text-slate-400 hover:bg-slate-50"
      ].join(" ")}
    >
      {icon}
      <span className="text-[15px]">{label}</span>
    </div>
  );
}
