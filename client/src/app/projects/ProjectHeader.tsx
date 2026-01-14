import Header from "@/components/Header";
import {
  Clock,
  Filter,
  Grid3x3,
  List,
  PlusSquare,
  Share2,
  Table,
} from "lucide-react";
import React, { useState } from "react";
import ModalNewProject from "./ModalNewProject";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  activeTab: string;
  setActiveTab: (tabName: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
};

const ProjectHeader = ({ activeTab, setActiveTab, searchQuery, setSearchQuery }: Props) => {
  const [isModalNewProjectOpen, setIsModalNewProjectOpen] = useState(false);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      alert("Project link copied to clipboard!"); 
    }
  };

  const handleFilter = () => {
    console.log("Filter button clicked");
  };

  return (
    <div className="px-4 xl:px-6">
      <ModalNewProject
        isOpen={isModalNewProjectOpen}
        onClose={() => setIsModalNewProjectOpen(false)}
      />
      <div className="pb-6 pt-6 lg:pb-4 lg:pt-8">
        <Header
          name="Product Design Development"
          buttonComponent={
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center rounded-md bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 transition-all shadow-md active:shadow-sm"
              onClick={() => setIsModalNewProjectOpen(true)}
            >
              <PlusSquare className="mr-2 h-5 w-5" /> New Boards
            </motion.button>
          }
        />
      </div>

      {/* TABS */}
      <div className="flex flex-wrap-reverse gap-2 border-y border-gray-200 pb-[8px] pt-2 dark:border-gray-800 md:items-center">
        <div className="flex flex-1 items-center gap-2 md:gap-4 overflow-x-auto no-scrollbar">
          <TabButton
            name="Board"
            icon={<Grid3x3 className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="List"
            icon={<List className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Timeline"
            icon={<Clock className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
          <TabButton
            name="Table"
            icon={<Table className="h-5 w-5" />}
            setActiveTab={setActiveTab}
            activeTab={activeTab}
          />
        </div>
        <div className="flex items-center gap-2">
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-white transition-colors p-2 rounded-lg"
            onClick={handleFilter}
            aria-label="Filter"
          >
            <Filter className="h-5 w-5" />
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
            whileTap={{ scale: 0.9 }}
            className="text-gray-500 hover:text-gray-700 dark:text-neutral-500 dark:hover:text-white transition-colors p-2 rounded-lg"
            onClick={handleShare}
            aria-label="Share"
          >
            <Share2 className="h-5 w-5" />
          </motion.button>
          <div className="relative">
            <input
              type="text"
              placeholder="Search Task"
              className="rounded-lg border py-2 pl-10 pr-4 focus:outline-none dark:border-gray-700 dark:bg-dark-secondary dark:text-white text-sm transition-all focus:ring-2 focus:ring-blue-500/20 bg-gray-50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Grid3x3 className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-neutral-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

type TabButtonProps = {
  name: string;
  icon: React.ReactNode;
  setActiveTab: (tabName: string) => void;
  activeTab: string;
};

const TabButton = ({ name, icon, setActiveTab, activeTab }: TabButtonProps) => {
  const isActive = activeTab === name;

  return (
    <button
      className={`relative flex items-center gap-2 px-1 py-2 text-sm font-semibold transition-all sm:px-2 lg:px-4 group ${
        isActive 
          ? "text-blue-600 dark:text-white" 
          : "text-gray-500 hover:text-blue-600 dark:text-neutral-500 dark:hover:text-white"
      }`}
      onClick={() => setActiveTab(name)}
    >
      <motion.div 
        className="flex items-center gap-2 relative z-10"
        whileHover={!isActive ? { y: -2 } : {}}
      >
        {icon}
        {name}
      </motion.div>
      {isActive && (
        <motion.div
          layoutId="activeTabIndicator"
          className="absolute -bottom-[9px] left-0 h-[3px] w-full bg-blue-600 dark:bg-white rounded-t-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
      {!isActive && (
        <div className="absolute -bottom-[9px] left-0 h-[3px] w-0 bg-gray-200 dark:bg-gray-700 group-hover:w-full transition-all duration-300" />
      )}
    </button>
  );
};

export default ProjectHeader;
