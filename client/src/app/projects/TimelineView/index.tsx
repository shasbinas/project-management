"use client";

import { useAppSelector } from "@/app/redux";
import { useGetTasksQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { fadeInVariants } from "@/lib/animations";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  searchQuery: string;
};

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = ({ id, setIsModalNewTaskOpen, searchQuery }: Props) => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      tasks
        ?.filter(
          (task) =>
            task.startDate &&
            task.dueDate &&
            (task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              task.description?.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .map((task) => ({
          start: new Date(task.startDate as string),
          end: new Date(task.dueDate as string),
          name: task.title,
          id: `Task-${task.id}`,
          type: "task" as TaskTypeItems,
          progress: task.points ? (task.points / 10) * 100 : 0,
          isDisabled: false,
        })) || []
    );
  }, [tasks, searchQuery]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-rose-500 font-bold">An error occurred while fetching tasks</div>;
  if (!tasks || tasks.length === 0) return <div className="p-8 dark:text-gray-400">No tasks found. Please create a task for this project to view the timeline.</div>;

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      variants={fadeInVariants}
      className="px-4 xl:px-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4 py-5">
        <h1 className="text-lg font-bold dark:text-white">
          Project Tasks Timeline
        </h1>
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded-lg border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow-sm hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white transition-all text-sm font-medium"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-200">
             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-dark-secondary border border-gray-200 dark:border-gray-800">
        <div className="timeline">
          {ganttTasks.length > 0 ? (
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
              listCellWidth="300px"
              barBackgroundColor={isDarkMode ? "#2563EB" : "#aeb8c2"}
              barBackgroundSelectedColor={isDarkMode ? "#3B82F6" : "#9ba1a6"}
              barProgressColor={isDarkMode ? "#60A5FA" : "#aeb8c2"}
              barProgressSelectedColor={isDarkMode ? "#93C5FD" : "#9ba1a6"}
              TaskListHeader={TaskListHeader}
              TaskListTable={TaskListTable}
            />
          ) : (
            <div className="p-10 text-center text-gray-500 font-medium">
              No tasks with valid dates to display on the timeline.
            </div>
          )}
        </div>
        <div className="px-4 pb-5 pt-4 border-t border-gray-100 dark:border-gray-800">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center rounded bg-blue-primary px-4 py-2 text-white hover:bg-blue-600 transition-colors shadow-sm text-sm font-semibold"
            onClick={() => setIsModalNewTaskOpen(true)}
          >
            Add New Task
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const TaskListHeader: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight }) => {
  return (
    <div
      className="flex items-center border-b border-gray-200 bg-white font-bold dark:border-stroke-dark dark:bg-dark-secondary dark:text-white"
      style={{ height: headerHeight, width: "300px" }}
    >
      <div className="w-[100px] px-4">Name</div>
      <div className="w-[1px] h-full bg-gray-200 dark:bg-stroke-dark" />
      <div className="w-[100px] px-4">From</div>
      <div className="w-[1px] h-full bg-gray-200 dark:bg-stroke-dark" />
      <div className="w-[100px] px-4 text-center">To</div>
    </div>
  );
};

const TaskListTable: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: any[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: any) => void;
}> = ({ rowHeight, tasks }) => {
  return (
    <div
      className="bg-white dark:bg-dark-secondary"
      style={{ width: "300px" }}
    >
      {tasks.map((task) => (
        <div
          key={task.id}
          className="flex items-center border-b border-gray-100 text-xs dark:border-stroke-dark dark:text-white"
          style={{ height: rowHeight }}
        >
          <div className="w-[100px] px-4 truncate font-medium dark:text-white">{task.name}</div>
          <div className="w-[1px] h-full bg-gray-100 dark:bg-stroke-dark" />
          <div className="w-[100px] px-4 truncate dark:text-white">{task.start.toLocaleDateString()}</div>
          <div className="w-[1px] h-full bg-gray-100 dark:bg-stroke-dark" />
          <div className="w-[100px] px-4 truncate dark:text-white text-center">{task.end.toLocaleDateString()}</div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
