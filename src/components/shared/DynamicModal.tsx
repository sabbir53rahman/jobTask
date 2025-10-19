"use client";
import { useState } from "react";

interface DynamicModalProps {
    title: string;
    description: string;
    type: "email" | "phone";
    onClose: () => void;
    onSubmit: (value: string) => void;
}

export default function DynamicModal({
    title,
    description,
    type,
    onClose,
    onSubmit,
}: DynamicModalProps) {
    const [value, setValue] = useState("");
    const [country, setCountry] = useState("+880");

    const handleSubmit = () => {
        if (!value) return;
        onSubmit(type === "phone" ? `${country}${value}` : value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-[420px] rounded-2xl shadow-xl p-6 animate-fadeIn">
                {/* Title */}
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="text-sm text-gray-600 mt-1">{description}</p>

                {/* Input section */}
                <div className="mt-5 space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                        {type === "email" ? "Email address" : "Phone number"}
                    </label>
                    {type === "email" ? (
                        <input
                            type="email"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="Enter your email address"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                        />
                    ) : (
                        <div className="flex gap-2">
                            <select
                                value={country}
                                onChange={(e) => setCountry(e.target.value)}
                                className="px-2 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                            >
                                <option value="+880">🇧🇩 +880</option>
                                <option value="+91">🇮🇳 +91</option>
                                <option value="+1">🇺🇸 +1</option>
                                <option value="+44">🇬🇧 +44</option>
                                <option value="+61">🇦🇺 +61</option>
                            </select>
                            <input
                                type="tel"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                placeholder="Enter phone number"
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#7C3AED]"
                            />
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex justify-end items-center gap-4 mt-6">
                    <button
                        onClick={onClose}
                        className="text-sm text-[#7C3AED] font-medium hover:underline"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!value}
                        className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${value
                            ? "bg-[#7C3AED] text-white hover:bg-[#6D28D9]"
                            : "bg-[#E9D8FD] text-[#7C3AED] cursor-not-allowed"
                            }`}
                    >
                        Add
                    </button>
                </div>
            </div>

            {/* Animation style */}
            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.25s ease-out;
        }
      `}</style>
        </div>
    );
}
