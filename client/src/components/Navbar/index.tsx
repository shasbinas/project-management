"use client";

import React, { useEffect, useState } from "react";
import { Menu, Moon, Search, Settings, Sun, User } from "lucide-react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { logout, setIsDarkMode, setIsSidebarCollapsed } from "@/state";
import Image from "next/image";
import { signOut } from "aws-amplify/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const currentUser = useAppSelector((state) => state.global.user);
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("query");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (queryParam) {
      setSearchQuery(queryParam);
    } else {
      setSearchQuery("");
    }
  }, [queryParam]);

  const handleSignOut = async () => {
    try {
      await signOut();
      dispatch(logout());
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
        router.push(`/search?query=${searchQuery}`);
    }
  };

  if (!currentUser) return null;

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between bg-white px-4 py-3 dark:bg-dark-bg border-b border-gray-200 dark:border-gray-800 transition-colors">
      {/* Search Bar */}
      <div className="flex items-center gap-8">
        {isSidebarCollapsed && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}
            className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu className="h-6 w-6 dark:text-white" />
          </motion.button>
        )}
        <div className="relative flex h-min w-[200px] md:w-[300px]">
          <Search className="absolute left-[10px] top-1/2 mr-2 h-4 w-4 -translate-y-1/2 transform cursor-pointer dark:text-white opacity-50" />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 p-2 pl-10 text-xs placeholder-gray-500 focus:border-blue-500 focus:outline-none dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 transition-all font-medium"
            type="search"
            placeholder="Search tasks, teams, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>

      {/* Icons */}
      <div className="flex items-center gap-2">
        <motion.button
          whileHover={{ scale: 1.1, rotate: 12 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => dispatch(setIsDarkMode(!isDarkMode))}
          className={`rounded-lg p-2 transition-colors ${
            isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
          }`}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 dark:text-white" />
          ) : (
            <Moon className="h-5 w-5 text-gray-700" />
          )}
        </motion.button>
        
        <Link href="/settings">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 45 }}
            whileTap={{ scale: 0.9 }}
            className={`rounded-lg p-2 transition-colors ${
              isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100"
            }`}
          >
            <Settings className="h-5 w-5 dark:text-white text-gray-700" />
          </motion.div>
        </Link>
        
        <div className="mx-2 hidden h-6 w-[1px] bg-gray-200 dark:bg-gray-700 md:block"></div>
        
        <div className="hidden items-center gap-4 md:flex">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div 
                 whileHover={{ scale: 1.05 }}
                 className="h-9 w-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm overflow-hidden bg-gray-200"
              >
                {currentUser?.profilePictureUrl ? (
                  <Image
                    src={currentUser.profilePictureUrl.startsWith("http") 
                      ? currentUser.profilePictureUrl 
                      : `https://pmdevs3bucket.s3.ap-south-1.amazonaws.com/${currentUser.profilePictureUrl}`}
                    alt={currentUser?.username}
                    width={36}
                    height={36}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-sm font-bold text-gray-500">
                     {currentUser?.username?.charAt(0)}
                  </div>
                )}
              </motion.div>
              {/* Online Indicator */}
              <motion.div 
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-dark-bg"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold dark:text-white text-gray-800 uppercase tracking-tight">
                {currentUser?.username}
              </span>
              <span className="text-[10px] text-green-500 font-bold leading-none flex items-center gap-1">
                ONLINE
              </span>
            </div>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="rounded-lg bg-blue-primary px-4 py-2 text-xs font-black text-white hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/10"
            onClick={handleSignOut}
          >
            SIGN OUT
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
