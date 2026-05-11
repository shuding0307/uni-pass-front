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
        "flex h-11 items-center gap-3 rounded-lg px-4 text-sm font-bold transition-colors",
        active
          ? "bg-[#EEF2FF] text-[#1D4ED8]"
          : "text-[#43474F] hover:bg-[#F3F4F8] hover:text-[#001E40]"
      ].join(" ")}
      href="#"
    >
      <Icon aria-hidden="true" size={18} strokeWidth={2.2} />
      <span>{label}</span>
    </a>
  );
}
