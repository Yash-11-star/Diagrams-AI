"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import clsx from "clsx";
const navItems = [
  { label: "Image AI", icon: ImageIcon, href: "/dashboard/image" },

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const handleLogout = async () => {
    deleteCookie("afd_session");
  };
  return (
      {}
        <Link href="/" className="flex items-center gap-2.5">
            <Cpu size={16} className="text-white" />
          <span className="text-apple-dark font-semibold text-[15px] tracking-tight">Diagrams AI</span>
      </div>
      {}
        {navItems.map((item) => {
          return (
              <motion.div
                className={clsx(
                  active
                    : "text-apple-gray hover:text-apple-dark hover:bg-gray-100"
              >
                {item.label}
            </Link>
        })}

      <div className="px-3 py-4 border-t border-gray-100">
          <div className="w-8 h-8 bg-gradient-to-br from-apple-blue to-indigo-500 rounded-full flex items-center justify-center text-white text-[12px] font-bold uppercase">
          </div>
            <p className="text-[13px] font-medium text-apple-dark truncate">{user?.email ?? "User"}</p>
        </div>
          onClick={handleLogout}
        >
          Sign out
      </div>
  );
