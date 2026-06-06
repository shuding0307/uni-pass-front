import type { LucideIcon } from "lucide-react";

type NavItemProps = {
  icon: LucideIcon;
  label: string;
  active?: boolean;
};

export default function NavItem({ icon: Icon, label, active = false }: NavItemProps) {
  return (
    <a
      className={[
        "flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-bold transition",
        active
          ? "bg-[#EFF6FF] text-[#1D4ED8] shadow-[inset_3px_0_0_#2563EB]"
          : "text-[#435266] hover:bg-[#F7F9FC] hover:text-[#102033]"
      ].join(" ")}
      href="#"
    >
      <Icon aria-hidden="true" size={18} strokeWidth={2.2} />
      <span>{label}</span>
    </a>
  );
}
