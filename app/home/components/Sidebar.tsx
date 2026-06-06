import { quickActions, navItems } from "../data/dashboard-data";
import NavItem from "./NavItem";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-[#E3E8F2] bg-white/95 shadow-[18px_0_50px_rgba(16,32,51,0.04)] backdrop-blur lg:flex lg:flex-col">
      <div className="flex h-[72px] items-center border-b border-[#EEF2F7] px-7">
        <span className="rounded-lg bg-[#102033] px-3 py-2 text-lg font-black tracking-tight text-white">
          uni-pass
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="space-y-2 border-t border-[#EEF2F7] p-4">
        {quickActions.map(({ label, icon: Icon }) => (
          <button
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D9E0EC] bg-white text-sm font-bold text-[#435266] shadow-sm transition hover:border-[#C7D2E4] hover:bg-[#F7F9FC]"
            key={label}
            type="button"
          >
            <Icon aria-hidden="true" size={16} />
            {label}
          </button>
        ))}
      </div>
    </aside>
  );
}
