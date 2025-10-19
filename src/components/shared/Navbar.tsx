"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, LogOut, Plus, Settings } from "lucide-react";
import useAuth from "@/Firebase/useAuth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/features/userSlice/userSlice";
import type { RootState } from "@/redux/app/store";
import AccountModal from "./AccountModal";
import Link from "next/link";

export default function Navbar() {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const toggleProfile = () => setIsProfileOpen(!isProfileOpen);

  const { logOut } = useAuth();
  const dispatch = useDispatch();
  const user: any = useSelector((state: RootState) => state.user.user);
  console.log(user)

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

  return (
    <>
      <nav className="w-full bg-white border-b">
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between px-6 py-2 border-b text-sm text-gray-600">
          {/* Left side */}
          <div className="flex flex-wrap items-center gap-2 order-2 sm:order-1 w-full sm:w-auto justify-center sm:justify-start">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 text-white font-semibold text-lg w-7 h-7 rounded flex items-center justify-center">
                A
              </div>
              <span className="font-medium text-xs md:text-[16px]">
                Personal workspace
              </span>
            </div>
            <span className="text-gray-400">/</span>
            <span className="font-medium text-gray-800 text-xs md:text-[16px]">
              My Application
            </span>
            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-md font-medium">
              Free
            </span>
            <span className="text-gray-400">/</span>
            <div className="flex items-center gap-1 cursor-pointer text-gray-700">
              <span>Development</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>

          {/* Avatar (Right side on mobile, right side as usual on desktop) */}
          <div className="relative order-2 sm:order-2 w-full sm:w-auto flex justify-end sm:justify-end">
            <button
              onClick={toggleProfile}
              className="flex items-center focus:outline-none"
            >
              <Image
                src="/user-avatar.jpg"
                alt="User avatar"
                width={36}
                height={36}
                className="rounded-full size-10 border border-gray-300"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-96 bg-white shadow-lg border border-gray-200 rounded-xl overflow-hidden z-50">
                {/* Header */}
                <div className="flex items-center gap-3 p-4 border-b">
                  <Image
                    src="/user-avatar.jpg"
                    alt="User avatar"
                    width={44}
                    height={44}
                    className="rounded-full size-10 border border-gray-200"
                  />
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {user?.displayName || "Sabbir"}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {user?.email || "sabbir@gmail.com"}
                    </p>
                  </div>
                </div>

                {/* Buttons section */}
                <div className="flex flex-col md:flex-col items-start md:items-stretch p-2">
                  {/* Manage + Logout — in one row on mobile */}
                  <div className="flex flex-col sm:flex-row sm:items-center  gap-8 w-full">
                    <button
                      onClick={handleOpenAccountModal}
                      className="flex items-center gap-2 text-sm text-left px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md"
                    >
                      <Settings className="size-4"/> Manage account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-sm text-left px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md"
                    >
                      <LogOut className="size-4"/> Sign out
                    </button>
                  </div>

                  <div className="border-t my-2 w-full"></div>

                  <Link href="/auth/signup" className="w-full">
                    <button className="w-full text-sm text-left flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700 rounded-md">
                      <Plus className="mr-1 size-4" /> Add account
                    </button>
                  </Link>
                </div>

                <div className="border-t text-xs text-center text-gray-400 py-2">
                  Secured by{" "}
                  <span className="font-semibold text-gray-500">clerk</span>
                </div>
              </div>
            )}
          </div>
        </div>



        {/* Second Row - Tabs */}
        <div className="flex flex-wrap items-center  px-6 py-2 text-xs md:text-sm font-medium text-gray-600">
          <div className="flex gap-6 overflow-x-auto">
            <span className="cursor-pointer text-gray-900 border-b-2 border-gray-900 pb-2">
              Overview
            </span>
            <span className="cursor-pointer hover:text-gray-900">Users</span>
            <span className="cursor-pointer hover:text-gray-900">
              Organizations
            </span>
            <span className="cursor-pointer hover:text-gray-900">
              Subscriptions
            </span>
            <span className="cursor-pointer hover:text-gray-900">Configure</span>
          </div>
        </div>

      </nav>
      {/* ✅ Account Modal */}
      {
        isAccountModalOpen && (
          <AccountModal onClose={handleCloseAccountModal} />
        )
      }
    </>

  );
}
