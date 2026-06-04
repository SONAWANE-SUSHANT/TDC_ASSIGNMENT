import { useAuth } from "../../context/AuthContext";
import BrandMark from "../ui/BrandMark";

const TopNavbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[#7d5115]/15 bg-[#fffaf2]/95 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="rounded-md border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 lg:hidden"
        >
          Menu
        </button>
        <div className="hidden sm:block">
          <BrandMark />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-[#7d5115]">The Date Crew</p>
          <h1 className="text-lg font-bold text-[#1a1925]">Partner Search Operations</h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-semibold text-[#1a1925]">{user?.name}</p>
          <p className="text-xs text-[#7d5115]">{user?.role}</p>
        </div>
        <button type="button" onClick={logout} className="btn-secondary">
          Logout
        </button>
      </div>
    </header>
  );
};

export default TopNavbar;
