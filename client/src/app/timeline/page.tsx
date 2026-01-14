"use client";

import { useAppSelector } from "@/app/redux";
import Header from "@/components/Header";
import { useGetProjectsQuery } from "@/state/api";
import { DisplayOption, Gantt, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import React, { useMemo, useState } from "react";

type TaskTypeItems = "task" | "milestone" | "project";

const Timeline = () => {
  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);
  const { data: projects, isLoading, isError } = useGetProjectsQuery();

  const [displayOptions, setDisplayOptions] = useState<DisplayOption>({
    viewMode: ViewMode.Month,
    locale: "en-US",
  });

  const ganttTasks = useMemo(() => {
    return (
      projects
        ?.filter((project) => project.startDate && project.endDate)
        .map((project) => {
          const start = new Date(project.startDate as string);
          const end = new Date(project.endDate as string);
          const now = new Date();
          let status = "Planned";
          if (now > end) status = "Completed";
          else if (now > start) status = "In Progress";

          return {
            start: start,
            end: end,
            name: project.name,
            id: `Project-${project.id}`,
            type: "project" as TaskTypeItems,
            progress: status === "Completed" ? 100 : 50,
            isDisabled: false,
            styles: {
              progressColor: status === "Completed" ? "#10b981" : "#3b82f6",
              backgroundColor: status === "Completed" ? "#059669" : "#2563eb",
            },
            _status: status, 
          };
        }) || []
    );
  }, [projects]);

  const handleViewModeChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setDisplayOptions((prev) => ({
      ...prev,
      viewMode: event.target.value as ViewMode,
    }));
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading timeline...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">An error occurred while fetching projects</div>;

  return (
    <div className="max-w-full p-8">
      <header className="mb-4 flex items-center justify-between">
        <Header name="Projects Timeline" />
        <div className="relative inline-block w-64">
          <select
            className="focus:shadow-outline block w-full appearance-none rounded border border-gray-400 bg-white px-4 py-2 pr-8 leading-tight shadow hover:border-gray-500 focus:outline-none dark:border-dark-secondary dark:bg-dark-secondary dark:text-white"
            value={displayOptions.viewMode}
            onChange={handleViewModeChange}
          >
            <option value={ViewMode.Day}>Day</option>
            <option value={ViewMode.Week}>Week</option>
            <option value={ViewMode.Month}>Month</option>
          </select>
        </div>
      </header>

      <div className="overflow-hidden rounded-md bg-white shadow dark:bg-dark-secondary dark:text-white">
        <div className="timeline">
          {ganttTasks.length > 0 ? (
            <Gantt
              tasks={ganttTasks}
              {...displayOptions}
              columnWidth={displayOptions.viewMode === ViewMode.Month ? 150 : 100}
              listCellWidth="340px"
              barCornerRadius={4}
              projectBackgroundColor={isDarkMode ? "#0275ff" : "#1f2937"}
              projectProgressColor={isDarkMode ? "#0275ff" : "#aeb8c2"}
              projectProgressSelectedColor={isDarkMode ? "#0275ff" : "#9ba1a6"}
              TaskListHeader={TaskListHeader}
              TaskListTable={TaskListTable}
            />
          ) : (
            <div className="p-5 text-center text-gray-500">
              No projects with valid dates to display on the timeline.
            </div>
          )}
        </div>
      </div>
    </div>
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
        className="flex items-center border-b border-gray-200 bg-white font-bold dark:border-stroke-dark dark:bg-dark-secondary dark:text-white pl-4"
        style={{ height: headerHeight, width: "340px" }}
      >
        <div className="w-40">Name</div>
        <div className="w-[1px] h-full bg-gray-200 dark:bg-stroke-dark" />
        <div className="w-24 text-center">From</div>
        <div className="w-[1px] h-full bg-gray-200 dark:bg-stroke-dark" />
        <div className="w-24 text-center">To</div>
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
  }> = ({ rowHeight, tasks, fontFamily, fontSize }) => {
    return (
      <div
        className="bg-white dark:bg-dark-secondary"
        style={{ width: "340px" }}
      >
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center border-b border-gray-100 text-xs dark:border-stroke-dark dark:text-white pl-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            style={{ height: rowHeight, fontFamily, fontSize }}
          >
            <div className="w-40 truncate dark:text-white font-medium">{task.name}</div>
            <div className="w-[1px] h-full bg-gray-100 dark:bg-stroke-dark" />
            <div className="w-24 text-center dark:text-white text-xs text-gray-500 dark:text-gray-400">
                {task.start.toLocaleDateString()}
            </div>
            <div className="w-[1px] h-full bg-gray-100 dark:bg-stroke-dark" />
            <div className="w-24 text-center dark:text-white text-xs text-gray-500 dark:text-gray-400">
                {task.end.toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

export default Timeline;
