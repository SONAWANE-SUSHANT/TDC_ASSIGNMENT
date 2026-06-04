import { NavLink } from "react-router-dom";
import BrandMark from "../ui/BrandMark";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "D" },
  { to: "/customers", label: "Customers", icon: "C" },
  { to: "/match-history", label: "Match History", icon: "H" }
];

const Sidebar = ({ open, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/40 transition lg:hidden ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-[#7d5115]/15 bg-[#fffaf2] transition-transform lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center border-b border-[#7d5115]/15 px-5">
          <BrandMark />
          <div className="ml-3">
            <p className="text-sm font-bold text-[#1a1925]">The Date Crew</p>
            <p className="text-xs text-[#7d5115]">Matchmaker dashboard</p>
          </div>
        </div>
        <nav className="space-y-1 p-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? "sidebar-link-active" : ""}`
              }
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#edf0f2] text-xs font-bold text-[#1b3a2f]">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
