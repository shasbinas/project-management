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
            // Custom data for our list view
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
              listCellWidth="100px"
              barCornerRadius={4}
              projectBackgroundColor={isDarkMode ? "#101214" : "#1f2937"}
              projectProgressColor={isDarkMode ? "#1f2937" : "#aeb8c2"}
              projectProgressSelectedColor={isDarkMode ? "#000" : "#9ba1a6"}
              
              // Custom List Header
              TaskListHeader={({ headerHeight }) => (
                <div 
                   className="flex items-center font-bold pl-4 border-r border-[#e0e0e0] dark:border-dark-tertiary bg-gray-100 dark:bg-dark-tertiary text-gray-700 dark:text-white"
                   style={{ height: headerHeight, width: "340px" }} // Explicit width matching table
                >
                    <div className="w-40">Name</div>
                    <div className="w-24 text-center">From</div>
                    <div className="w-24 text-center">To</div>
                </div>
              )}
              
              // Custom List Table (The Rows)
              TaskListTable={({ rowHeight, tasks, fontFamily, fontSize }) => (
                  <div className="border-r border-[#e0e0e0] dark:border-dark-tertiary" style={{ width: "340px" }}>
                      {tasks.map((task) => (
                           <div 
                              key={task.id} 
                              className="flex items-center pl-4 border-b border-gray-100 dark:border-dark-tertiary hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                              style={{ height: rowHeight, fontFamily, fontSize }}
                           >
                               <div className="w-40 truncate">{task.name}</div>
                               <div className="w-24 text-center text-xs text-gray-500 dark:text-gray-400">
                                   {task.start.toLocaleDateString()}
                               </div>
                               <div className="w-24 text-center text-xs text-gray-500 dark:text-gray-400">
                                   {task.end.toLocaleDateString()}
                               </div>
                           </div>
                      ))}
                  </div>
              )}
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

export default Timeline;
