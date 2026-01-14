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
      const getStatusColor = (status: string) => {
        switch (status) {
          case "To Do":
            return "bg-gray-100 text-gray-800";
          case "Work In Progress":
            return "bg-blue-100 text-blue-800";
          case "Under Review":
            return "bg-orange-100 text-orange-800";
          case "Completed":
            return "bg-green-100 text-green-800";
          default:
            return "bg-gray-100 text-gray-800";
        }
      };

      return (
        <span
          className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${getStatusColor(
            params.value,
          )}`}
        >
          {params.value}
        </span>
      );
    },
  },
  {
    field: "priority",
    headerName: "Priority",
    width: 75,
    renderCell: (params) => (
      <span
        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          params.value === "Urgent"
            ? "bg-red-200 text-red-700"
            : params.value === "High"
              ? "bg-orange-200 text-orange-700"
              : params.value === "Medium"
                ? "bg-yellow-200 text-yellow-700"
                : params.value === "Low"
                  ? "bg-blue-200 text-blue-700"
                  : "bg-gray-200 text-gray-700"
        }`}
      >
        {params.value}
      </span>
    ),
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
