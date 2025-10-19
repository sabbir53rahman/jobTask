"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import "@/app/globals.css";
import useAuth from "@/Firebase/useAuth";
import { store } from "@/redux/app/store";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/shared/Navbar";

// 🌀 Spinner Component
const Spinner = () => (
  <div className="min-h-screen bg-white flex flex-col justify-center items-center gap-6">
    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center animate-pulse shadow-md">
      <Loader2 className="w-8 h-8 text-white animate-spin" />
    </div>
    <p className="text-gray-700 text-xl font-medium">Loading details...</p>
  </div>
);

// 🧩 LayoutContent Component
interface LayoutContentProps {
  children: ReactNode;
}

const LayoutContent: React.FC<LayoutContentProps> = ({ children }) => {
  const { isAuthLoading } = useAuth();

  if (isAuthLoading) return <Spinner />;

  return (
    <>
      <Navbar />
      {children}
    </>
  );
};

// 🏠 RootLayout
interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <LayoutContent>{children}</LayoutContent>
        </Provider>
      </body>
    </html>
  );
}
