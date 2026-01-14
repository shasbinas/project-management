"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { useGetTasksQuery } from "@/state/api";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";
import { motion } from "framer-motion";
import { fadeInVariants } from "@/lib/animations";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  searchQuery: string;
};

const columns: GridColDef[] = [
  {
    field: "title",
    headerName: "Title",
    width: 100,
  },
  {
    field: "description",
    headerName: "Description",
    width: 200,
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    renderCell: (params) => {
      const status = params.value;
      let colorClass = "";
      switch (status) {
        case "To Do":
          colorClass = "bg-slate-100 text-slate-700 dark:bg-slate-800/80 dark:text-slate-300";
          break;
        case "Work In Progress":
          colorClass = "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
          break;
        case "Under Review":
          colorClass = "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
          break;
        case "Completed":
          colorClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
          break;
        default:
          colorClass = "bg-gray-100 text-gray-700";
      }
      return (
        <div className="flex items-center h-full">
          <span className={`w-[110px] py-1 rounded-md text-[10px] font-bold uppercase tracking-tight border border-current/10 ${colorClass} text-center`}>
            {status}
          </span>
        </div>
      );
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 100,
    renderCell: (params) => {
      const priority = params.value;
      let bgColor = "";
      switch (priority) {
        case "Urgent":
          bgColor = "bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400";
          break;
        case "High":
          bgColor = "bg-orange-100/50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400";
          break;
        case "Medium":
          bgColor = "bg-yellow-100/50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400";
          break;
        case "Low":
          bgColor = "bg-blue-100/50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400";
          break;
        default:
          bgColor = "bg-gray-100/50 text-gray-700 dark:bg-gray-500/10 dark:text-gray-400";
      }
      return (
        <div className="flex items-center h-full">
          <span className={`w-[85px] py-1 rounded-md text-[10px] font-bold uppercase tracking-tight ${bgColor} text-center`}>
            {priority}
          </span>
        </div>
      );
    },
  },
  {
    field: "tags",
    headerName: "Tags",
    width: 130,
  },
  {
    field: "startDate",
    headerName: "Start Date",
    width: 130,
  },
  {
    field: "dueDate",
    headerName: "Due Date",
    width: 130,
  },
  {
    field: "author",
    headerName: "Author",
    width: 150,
    renderCell: (params) => params.value?.username || "Unknown",
  },
  {
    field: "assignee",
    headerName: "Assignee",
    width: 150,
    renderCell: (params) => params.value?.username || "Unassigned",
  },
];

const TableView = ({ id, setIsModalNewTaskOpen, searchQuery }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error || !tasks) return <div className="p-8 text-rose-500 font-bold">An error occurred while fetching tasks</div>;

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeInVariants}
      className="h-[540px] w-full px-4 pb-8 xl:px-6"
    >
      <div className="pt-5">
        <Header
          name="Table"
          buttonComponent={
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 transition-colors shadow-sm"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </motion.button>
          }
          isSmallText
        />
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
        <DataGrid
            rows={filteredTasks}
            columns={columns}
            className={dataGridClassNames}
            sx={dataGridSxStyles(isDarkMode)}
            disableRowSelectionOnClick
        />
      </div>
    </motion.div>
  );
};

export default TableView;
