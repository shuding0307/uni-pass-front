import { quickActions, navItems } from "../data/dashboard-data";
import NavItem from "./NavItem";

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-[#E4E7EF] bg-white lg:flex lg:flex-col">
      <div className="flex h-[68px] items-center border-b border-[#EEF0F5] px-8">
        <span className="text-xl font-black tracking-tight text-[#001E40]">
          uni-pass
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-7">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      <div className="space-y-2 border-t border-[#EEF0F5] p-4">
        {quickActions.map(({ label, icon: Icon }) => (
          <button
            className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#D8DCE6] bg-white text-sm font-bold text-[#43474F] transition-colors hover:bg-[#F6F7FB]"
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
