"use client";

import React, { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import AuthProvider from "./authProvider";
import StoreProvider, { useAppSelector } from "./redux";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { pageVariants } from "@/lib/animations";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const pathname = usePathname();

  // Suppress Recharts defaultProps warning
  useEffect(() => {
    const originalError = console.error;
    console.error = (...args: any[]) => {
      if (typeof args[0] === "string" && args[0].includes("defaultProps")) return;
      originalError(...args);
    };
    return () => {
      console.error = originalError;
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 dark:bg-dark-bg overflow-hidden">
      <Sidebar />
      <motion.main
        animate={{ 
          paddingLeft: isSidebarCollapsed ? 0 : 256,
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="flex w-full flex-col h-full overflow-y-auto bg-gray-50 dark:bg-dark-bg"
      >
        <Navbar />
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex-1"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </motion.main>
    </div>
  );
};

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </AuthProvider>
    </StoreProvider>
  );
};

export default DashboardWrapper;
