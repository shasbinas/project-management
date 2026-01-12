"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { logout, setIsSidebarCollapsed } from "@/state";
import { useGetProjectsQuery } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Home,
  Layers3,
  LockIcon,
  LucideIcon,
  PlusSquare,
  Search,
  Settings,
  ShieldAlert,
  User,
  Users,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import ModalNewProject from "@/app/projects/ModalNewProject";

const Sidebar = () => {
  const [showProjects, setShowProjects] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: projects } = useGetProjectsQuery();
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector(
    (state) => state.global.isSidebarCollapsed,
  );

  const currentUser = useAppSelector((state) => state.global.user);
  const handleSignOut = async () => {
    try {
      await signOut();
      dispatch(logout());
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };
  if (!currentUser) return null;

  const sidebarClassNames = `fixed top-0 left-0 flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-dark-bg bg-white
    ${isSidebarCollapsed ? "w-0 hidden" : "w-64"}
  `;

  return (
    <div className={sidebarClassNames}>
      <div className="flex h-[100%] w-full flex-col justify-start">
        {/* TOP LOGO */}
        <div className="z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-dark-bg">
          <div className="text-xl font-bold text-gray-800 dark:text-white">
            EDLIST
          </div>
          {isSidebarCollapsed ? null : (
            <button
              className="py-3"
              onClick={() => {
                dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
              }}
            >
              <X className="h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white" />
            </button>
          )}
        </div>
        {/* TEAM */}
        <div className="flex items-center gap-5 border-y-[1.5px] border-gray-200 px-8 py-4 dark:border-gray-700">
          <Image src="/logo.png" alt="Logo" width={40} height={40} />
          <div>
            <h3 className="text-md font-bold tracking-wide dark:text-gray-200">
              EDROH TEAM
            </h3>
            <div className="mt-1 flex items-start gap-2">
              <LockIcon className="mt-[0.1rem] h-3 w-3 text-gray-500 dark:text-gray-400" />
              <p className="text-xs text-gray-500">Private</p>
            </div>
          </div>
        </div>
        
        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {/* NAVBAR LINKS */}
          <nav className="z-10 w-full">
            <SidebarLink icon={Home} label="Home" href="/" />
            <SidebarLink icon={Briefcase} label="Timeline" href="/timeline" />
            <SidebarLink icon={Search} label="Search" href="/search" />
            <SidebarLink icon={Settings} label="Settings" href="/settings" />
            <SidebarLink icon={User} label="Users" href="/users" />
            <SidebarLink icon={Users} label="Teams" href="/teams" />
          </nav>

          {/* PROJECTS LINKS */}
          <button
            onClick={() => setShowProjects((prev) => !prev)}
            className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
          >
            <span className="">Projects</span>
            {showProjects ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {/* LIST OF PROJECTS */}
          <div className="flex flex-col">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-3 px-8 py-3 text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
            >
              <PlusSquare className="h-4 w-4" />
              <span>Create New Project</span>
            </button>
            
            {showProjects &&
              projects?.map((project) => (
                <SidebarLink
                  key={project.id}
                  icon={Briefcase}
                  label={project.name}
                  href={`/projects/${project.id}`}
                />
              ))}
          </div>

          {/* PRIORITIES LINKS */}
          <button
            onClick={() => setShowPriority((prev) => !prev)}
            className="flex w-full items-center justify-between px-8 py-3 text-gray-500"
          >
            <span className="">Priority</span>
            {showPriority ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {showPriority && (
            <>
              <SidebarLink
                icon={AlertCircle}
                label="Urgent"
                href="/priority/urgent"
              />
              <SidebarLink
                icon={ShieldAlert}
                label="High"
                href="/priority/high"
              />
              <SidebarLink
                icon={AlertTriangle}
                label="Medium"
                href="/priority/medium"
              />
              <SidebarLink icon={AlertOctagon} label="Low" href="/priority/low" />
              <SidebarLink
                icon={Layers3}
                label="Backlog"
                href="/priority/backlog"
              />
            </>
          )}
        </div>
      </div>
      
      <div className="z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-dark-bg md:hidden">
          <div className="align-center flex h-9 w-9 justify-center">
            {!!currentUser?.profilePictureUrl ? (
              <Image
                src={currentUser.profilePictureUrl.startsWith("http") 
                  ? currentUser.profilePictureUrl 
                  : `https://pmdevs3bucket.s3.ap-south-1.amazonaws.com/${currentUser.profilePictureUrl}`}
                alt={currentUser?.username || "User Profile Picture"}
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            ) : (
              <Image
                src="/i1.jpg"
                alt="Default Profile"
                width={100}
                height={50}
                className="h-full rounded-full object-cover"
              />
            )}
          </div>
          <span className="mx-3 text-gray-800 dark:text-white">
            {currentUser?.username}
          </span>
          <button
            className="self-start rounded bg-blue-400 px-4 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block"
            onClick={handleSignOut}
          >
            Sign out
          </button>
      </div>
      <ModalNewProject
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

interface SidebarLinkProps {
  href: string;
  icon: LucideIcon;
  label: string;
}

const SidebarLink = ({ href, icon: Icon, label }: SidebarLinkProps) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || (pathname === "/" && href === "/dashboard");

  return (
    <Link href={href} className="w-full">
      <div
        className={`relative flex cursor-pointer items-center gap-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 ${
          isActive ? "bg-gray-100 text-gray-900 dark:bg-gray-600 dark:text-gray-100" : "text-gray-800 dark:text-gray-100"
        } justify-start px-8 py-3`}
      >
        {isActive && (
          <div className="absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200" />
        )}

        <Icon className="h-6 w-6" />
        <span className={`font-medium`}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default Sidebar;
