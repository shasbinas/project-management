"use client";

import {
  Priority,
  Project,
  Task,
  useGetProjectsQuery,
  useGetTasksQuery,
} from "@/state/api";
import React, { useMemo } from "react";
import { useAppSelector } from "../redux";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Header from "@/components/Header";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { dataGridClassNames, dataGridSxStyles } from "@/lib/utils";
import { motion } from "framer-motion";
import { fadeInVariants } from "@/lib/animations";
import { 
  CheckCircle2, 
  Clock, 
  Layers, 
  AlertCircle, 
  TrendingUp,
  Layout
} from "lucide-react";

const taskColumns: GridColDef[] = [
  { 
    field: "title", 
    headerName: "Title", 
    width: 250,
    renderCell: (params) => (
      <span className="font-bold text-gray-800 dark:text-gray-100">{params.value}</span>
    )
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
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
    width: 150,
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
    field: "dueDate", 
    headerName: "Due Date", 
    width: 150,
    renderCell: (params) => (
      <span className="text-gray-600 dark:text-gray-400 font-medium">
        {params.value ? new Date(params.value).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : "-"}
      </span>
    )
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-xl dark:border-gray-800 dark:bg-dark-tertiary">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">{label}</p>
        <p className="text-sm font-black dark:text-white">
          <span className="text-blue-500">Value: </span>
          {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const HomePage = () => {
  const {
    data: tasks,
    isLoading: tasksLoading,
    isError: tasksError,
  } = useGetTasksQuery({});
  const { data: projects, isLoading: isProjectsLoading } =
    useGetProjectsQuery();

  const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

  const priorityCount = useMemo(() => {
    if (!tasks) return [];
    const count = tasks.reduce((acc: Record<string, number>, task: Task) => {
      const { priority } = task;
      acc[priority as Priority] = (acc[priority as Priority] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(count).map((key) => ({ name: key, count: count[key] }));
  }, [tasks]);

  const projectStatus = useMemo(() => {
    if (!tasks) return [];
    const count = tasks.reduce((acc: Record<string, number>, task: Task) => {
      const status = task.status || "To Do";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(count).map((key) => ({ name: key, count: count[key] }));
  }, [tasks]);

  const stats = useMemo(() => {
    if (!tasks || !projects) return null;
    return {
      totalTasks: tasks.length,
      completedTasks: tasks.filter(t => t.status === "Completed").length,
      activeProjects: projects.length,
      urgentTasks: tasks.filter(t => t.priority === "Urgent").length
    };
  }, [tasks, projects]);

  if (tasksLoading || isProjectsLoading) return <div className="p-8 font-medium animate-pulse text-gray-500">Aligning stars...</div>;
  if (tasksError && !projects?.length) return <div className="p-8 text-center text-rose-500 font-bold">Please create a project to get started.</div>;
  if (!tasks || !projects) return <div className="p-8 text-center text-rose-500 font-bold">Error fetching data</div>;

  const chartColors = isDarkMode
    ? {
        barGrid: "#1f2937",
        text: "#94a3b8",
      }
    : {
        barGrid: "#f1f5f9",
        text: "#64748b",
      };

  return (
    <div className="container h-full w-full p-6 lg:p-10">
      <div className="mb-8">
        <Header name="Project Management Dashboard" />
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 font-medium">Welcome back! Here's a summary of your workspace.</p>
      </div>

      {/* STAT CARDS */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats?.totalTasks || 0} 
          icon={<Layers className="h-5 w-5" />} 
          color="blue"
          delay={0.1}
        />
        <StatCard 
          title="Completed" 
          value={stats?.completedTasks || 0} 
          icon={<CheckCircle2 className="h-5 w-5" />} 
          color="emerald"
          delay={0.2}
        />
        <StatCard 
          title="Active Projects" 
          value={stats?.activeProjects || 0} 
          icon={<Layout className="h-5 w-5" />} 
          color="purple"
          delay={0.3}
        />
        <StatCard 
          title="Urgent Alerts" 
          value={stats?.urgentTasks || 0} 
          icon={<AlertCircle className="h-5 w-5" />} 
          color="rose"
          delay={0.4}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
        {/* PRIORITY CHART */}
        <motion.div 
          variants={fadeInVariants}
          initial="initial"
          animate="animate"
          custom={0.5}
          className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 dark:bg-[#1a1c1e] dark:shadow-none border border-transparent dark:border-gray-800"
        >
          <div className="mb-6 flex items-center justify-between">
             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Task Priority Distribution
             </h3>
             <TrendingUp className="h-4 w-4 text-blue-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priorityCount}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={chartColors.barGrid}
                vertical={false}
              />
              <XAxis 
                dataKey="name" 
                stroke={chartColors.text} 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke={chartColors.text} 
                fontSize={11} 
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: isDarkMode ? '#2d2d2d' : '#f9fafb' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]} barSize={40}>
                {priorityCount.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      (
                        {
                          Urgent: "#F43F5E",
                          High: "#F59E0B",
                          Medium: "#EAB308",
                          Low: "#3B82F6",
                          Backlog: "#94A3B8",
                        } as Record<string, string>
                      )[entry.name] || "#3B82F6"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* STATUS CHART */}
        <motion.div 
          variants={fadeInVariants}
          initial="initial"
          animate="animate"
          custom={0.6}
          className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 dark:bg-[#1a1c1e] dark:shadow-none border border-transparent dark:border-gray-800"
        >
          <div className="mb-6 flex items-center justify-between">
             <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Project Success Rate
             </h3>
             <Clock className="h-4 w-4 text-emerald-500" />
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie 
                dataKey="count" 
                data={projectStatus} 
                innerRadius={60}
                outerRadius={80}
                paddingAngle={8}
                stroke="none"
              >
                {projectStatus.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      (
                        {
                          "To Do": "#6366F1",
                          "Work In Progress": "#F59E0B",
                          "Under Review": "#F97316",
                          "Completed": "#10B981",
                        } as Record<string, string>
                      )[entry.name] || COLORS[index % COLORS.length]
                    }
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* TABLE */}
        <motion.div 
          variants={fadeInVariants}
          initial="initial"
          animate="animate"
          custom={0.7}
          className="rounded-2xl bg-white p-6 shadow-xl shadow-gray-200/50 dark:bg-[#1a1c1e] dark:shadow-none border border-transparent dark:border-gray-800 lg:col-span-2 overflow-hidden"
        >
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Recent Tasks Activity
            </h3>
          </div>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={tasks}
              columns={taskColumns}
              loading={tasksLoading}
              className={`${dataGridClassNames} rounded-xl overflow-hidden`}
              sx={{
                ...dataGridSxStyles(isDarkMode),
                border: "none",
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: isDarkMode ? "#1d1f21 !important" : "#f8fafc !important",
                    color: isDarkMode ? "#94a3b8 !important" : "#64748b !important",
                    borderBottom: isDarkMode ? "1px solid #2d3135" : "1px solid #e2e8f0",
                },
                "& .MuiDataGrid-columnHeader": {
                    backgroundColor: isDarkMode ? "#1d1f21 !important" : "#f8fafc !important",
                },
                "& .MuiDataGrid-filler": {
                    backgroundColor: isDarkMode ? "#1d1f21 !important" : "#f8fafc !important",
                },
                "& .MuiDataGrid-scrollbarFiller": {
                    backgroundColor: isDarkMode ? "#1d1f21 !important" : "#f8fafc !important",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    fontWeight: "bold",
                    fontSize: "11px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                },
                "& .MuiDataGrid-cell": {
                    color: isDarkMode ? "#e2e8f0" : "#1f2937",
                    borderBottom: isDarkMode ? "1px solid #2d3135" : "1px solid #f1f5f9",
                    display: "flex",
                    alignItems: "center"
                },
                "& .MuiDataGrid-row:hover": {
                    backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.03) !important" : "rgba(0, 0, 0, 0.02) !important",
                },
                "& .MuiDataGrid-footerContainer": {
                    backgroundColor: isDarkMode ? "#1d1f21" : "#f8fafc",
                    color: isDarkMode ? "#94a3b8" : "#64748b",
                    borderTop: isDarkMode ? "1px solid #2d3135" : "1px solid #e2e8f0",
                }
              }}
              rowHeight={64}
              disableRowSelectionOnClick
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "emerald" | "purple" | "rose";
  delay: number;
}

const StatCard = ({ title, value, icon, color, delay }: StatCardProps) => {
  const colorMap = {
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 dark:text-emerald-400",
    purple: "text-purple-600 bg-purple-50 dark:bg-purple-500/10 dark:text-purple-400",
    rose: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 dark:text-rose-400",
  };

  return (
    <motion.div
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      whileHover={{ y: -5 }}
      custom={delay}
      className="flex items-center gap-4 rounded-2xl bg-white p-6 shadow-lg shadow-gray-100 dark:bg-[#1a1c1e] dark:shadow-none border border-transparent dark:border-gray-800"
    >
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">{title}</p>
        <h4 className="text-2xl font-black text-gray-800 dark:text-white mt-1">{value}</h4>
      </div>
    </motion.div>
  );
};

export default HomePage;
