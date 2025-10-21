"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronsUpDown, CirclePlus, LogOut, Settings } from "lucide-react";
import useAuth from "@/Firebase/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/userSlice/userSlice";
import type { RootState } from "@/redux/app/store";
import AccountModal from "./AccountModal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import demoUser from '@/assets/demoUser.png'


export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const { logOut } = useAuth();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await logOut();
      dispatch(logout());
      console.log("User logged out successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error logging out:", err.message);
      } else {
        console.error("Error logging out:", err);
      }
    }
  };

  const handleOpenAccountModal = () => {
    setIsAccountModalOpen(true);
    setIsProfileOpen(false);
  };

  const handleCloseAccountModal = () => {
    setIsAccountModalOpen(false);
  };

  const navLinks = [
    { name: "Overview", href: "/" },
    { name: "Users", href: "/user" },
    { name: "Organizations", href: "/organizations" },
    { name: "Subscriptions", href: "/subscriptions" },
    { name: "Configure", href: "/configure" },
  ];

  return (
    <>
      <nav className="w-full bg-[#FAFAFB] border-b">
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2 border-b text-sm text-gray-600">
          {/* Left side */}
          <div className="flex flex-wrap items-center gap-4 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="bg-[#00ADE3] text-white font-semibold text-lg w-7 h-7 rounded flex items-center justify-center">
                A
              </div>
              <span className="font-medium text-gray-800 text-sm ">
                Personal workspace
              </span>
            </div>
            <span className="text-gray-300">/</span>
            <span className="font-medium text-gray-800 text-sm ">
              My Application
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md font-medium">
              Free
            </span>
            <span className="text-gray-300">/</span>
            <div className="flex items-center gap-1 cursor-pointer text-gray-800">
              <span className="font-medium text-sm">Development</span>
              <ChevronsUpDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Avatar (Right side) */}
          <div className="relative order-2 sm:order-2 w-full sm:w-auto flex justify-end sm:justify-end">
            <button
              onClick={toggleProfile}
              className="flex items-center focus:outline-none mt-[-30px] sm:mt-0"
            >
              <Image
                src={demoUser}
                alt="User avatar"
                width={36}
                height={36}
                className="rounded-full size-10 border border-gray-300"
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className="absolute right-0 mt-10 w-80 md:w-96 bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden z-50"
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 p-4 border-b">
                    <Image
                      src={demoUser}
                      alt="User avatar"
                      width={44}
                      height={44}
                      className="rounded-full size-10 border border-gray-200"
                    />
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">
                        {user?.displayName || "Sabbir"}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {user?.email || "sabbir@gmail.com"}
                      </p>
                      <div className="pt-3 flex flex-col sm:flex-row sm:items-center gap-3 md:gap-8 w-full">
                        <button
                          onClick={handleOpenAccountModal}
                          className="flex items-center gap-2 text-xs font-medium text-left px-4 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-[9px]"
                        >
                          <Settings className="size-3" /> Manage account
                        </button>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 text-xs text-left font-medium px-4 py-1 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 rounded-[9px]"
                        >
                          <LogOut className="size-3" /> Sign out
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Buttons section */}
                  <div className="flex flex-col md:flex-col items-start md:items-stretch hover:bg-gray-100 p-2">
                    <Link href="/auth/signup" className="w-full">
                      <button className="w-full text-sm text-left flex items-center px-4 py-2  text-gray-700">
                        <CirclePlus className="mr-1 size-4" /> Add account
                      </button>
                    </Link>
                  </div>

                  <div className="border-t text-xs text-center text-gray-400 py-2">
                    Secured by{" "}
                    <span className="font-semibold text-gray-500">clerk</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>

        {/* Second Row - Tabs */}
        <div className="flex flex-wrap items-center px-6 pt-3 text-xs md:text-sm font-medium text-gray-600">
          <div className="flex gap-6 overflow-x-auto">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative cursor-pointer pb-3 transition-all duration-300 
        ${isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {link.name}

                  {/* Animated underline */}
                  <span
                    className={`absolute bottom-0 left-0 h-[1px] bg-gray-900 transition-all duration-300 
          ${isActive ? "w-full" : "w-0 group-hover:w-full"}`}
                  ></span>
                </Link>
              );
            })}

          </div>
        </div>
      </nav>

      {/* ✅ Account Modal */}
      {isAccountModalOpen && <AccountModal onClose={handleCloseAccountModal} />}
    </>
  );
}
