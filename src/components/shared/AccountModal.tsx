"use client";
import { useState } from "react";
import Image from "next/image";
import { X, User, Lock, Settings, MoreVertical, Chrome } from "lucide-react";
import DynamicModal from "./DynamicModal";
import user from "@/assets/demoUser.png";
import { motion, AnimatePresence } from "framer-motion"; // ✅ Added for animation

interface AccountModalProps {
    onClose: () => void;
}

export default function AccountModal({ onClose }: AccountModalProps) {
    const [activeTab, setActiveTab] = useState("Profile");
    const [showDynamic, setShowDynamic] = useState<null | "email" | "phone">(null);

    const tabs = [
        { name: "Profile", icon: <User size={18} /> },
        { name: "Security", icon: <Lock size={18} /> },
        { name: "Preferences", icon: <Settings size={18} /> },
    ];

    return (
        <AnimatePresence>
            <motion.div
                key="account-modal"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="relative flex flex-col md:flex-row w-full max-w-[800px] lg:max-w-[890px] max-h-[90vh] lg:h-[706px] bg-white rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Sidebar */}
                    <div className="w-full md:w-[220px] bg-[#FAFAFB] border-b md:border-b-0 md:border-r border-gray-200 px-2 py-6">
                        <h2 className="px-4 text-[17px] font-semibold text-gray-900 ">
                            Account
                        </h2>
                        <p className="px-4 mb-4 md:mb-6 text-sm">Manage your account info.</p>
                        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.name}
                                    onClick={() => setActiveTab(tab.name)}
                                    className={`flex items-center gap-2 px-2 md:px-6 py-2 text-sm font-medium rounded-[8px] text-gray-700 whitespace-nowrap transition-all ${activeTab === tab.name
                                            ? "bg-gray-100 text-[#734dcc]"
                                            : "hover:bg-gray-50"
                                        }`}
                                >
                                    {tab.icon}
                                    {tab.name}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 relative bg-white p-6 md:p-8 overflow-y-auto">
                        {/* Close button */}
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 rounded-lg hover:bg-gray-100 p-1.5"
                        >
                            <X className="w-5 h-5 text-gray-600" />
                        </button>

                        <h3 className="text-[17px] font-semibold text-gray-900 mb-5">
                            Profile details
                        </h3>

                        <div className="">
                            {/* === PROFILE === */}
                            <div className="grid grid-cols-1 md:grid-cols-3 items-center py-4 gap-4 border-y border-gray-200">
                                <p className="text-sm font-medium text-gray-600">Profile</p>
                                <div className="flex items-center gap-4">
                                    <div className="relative overflow-hidden">
                                        <Image
                                            src={user}
                                            alt="User avatar"
                                            width={36}
                                            height={36}
                                            className="rounded-full size-10 border border-gray-300"
                                        />
                                    </div>
                                    <p className="text-[15px] font-medium text-gray-900">Faisal BH</p>
                                </div>
                                <button className="text-sm text-[#734dcc] font-medium hover:underline text-left md:text-right">
                                    Update profile
                                </button>
                            </div>

                            {/* === EMAIL ADDRESSES === */}
                            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 py-4 relative ">
                                <p className="text-sm font-medium text-gray-600">Email addresses</p>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-700">
                                        <span>adstryker.bd@gmail.com</span>
                                    </div>

                                    <button
                                        onClick={() =>
                                            setShowDynamic(showDynamic === "email" ? null : "email")
                                        }
                                        className="text-sm text-[#734dcc] mt-1 hover:underline"
                                    >
                                        + Add email address
                                    </button>

                                    {/* Inline Dynamic Modal for email */}
                                    {showDynamic === "email" && (
                                        <div className="mt-4">
                                            <DynamicModal
                                                title="Add email address"
                                                description="You'll need to verify this email address before it can be added to your account."
                                                type="email"
                                                onClose={() => setShowDynamic(null)}
                                                onSubmit={(val) => {
                                                    console.log("Email submitted:", val);
                                                    setShowDynamic(null);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <MoreVertical size={16} className="text-gray-400" />
                                </div>
                            </div>

                            {/* === PHONE NUMBERS === */}
                            <div className="grid grid-cols-1 md:grid-cols-3 items-start gap-4 relative border-y border-gray-200 py-4">
                                <p className="text-sm font-medium text-gray-600">Phone numbers</p>
                                <div>
                                    <button
                                        onClick={() =>
                                            setShowDynamic(showDynamic === "phone" ? null : "phone")
                                        }
                                        className="text-sm text-[#6941C6] hover:underline"
                                    >
                                        + Add phone number
                                    </button>

                                    {/* Inline Dynamic Modal for phone */}
                                    {showDynamic === "phone" && (
                                        <div className="mt-4">
                                            <DynamicModal
                                                title="Add phone number"
                                                description="A text message containing a verification code will be sent to this phone number. Message and data rates may apply."
                                                type="phone"
                                                onClose={() => setShowDynamic(null)}
                                                onSubmit={(val) => {
                                                    console.log("Phone submitted:", val);
                                                    setShowDynamic(null);
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end">
                                    <MoreVertical size={16} className="text-gray-400" />
                                </div>
                            </div>

                            {/* === CONNECTED ACCOUNTS === */}
                            <div className="grid grid-cols-1 md:grid-cols-3 items-start py-4 gap-4">
                                <p className="text-sm font-medium text-gray-600">
                                    Connected accounts
                                </p>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <Chrome size={16} className="shrink-0" />
                                        <p className="text-sm text-gray-700 flex items-center gap-2">
                                            <span>Google</span>
                                            <span className="">•</span>
                                            <span>adstryker.bd@gmail.com</span>
                                        </p>
                                    </div>

                                    <button className="text-sm text-[#734dcc] hover:underline">
                                        + Connect account
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <MoreVertical size={16} className="text-gray-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
