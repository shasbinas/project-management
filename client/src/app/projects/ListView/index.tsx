"use client";

import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard";
import { Task, useGetTasksQuery } from "@/state/api";
import React from "react";
import { motion } from "framer-motion";
import { fadeInVariants } from "@/lib/animations";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  searchQuery: string;
};

const ListView = ({ id, setIsModalNewTaskOpen, searchQuery }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-rose-500 font-bold">An error occurred while fetching tasks</div>;

  // Filter tasks based on search query
  const filteredTasks = tasks
    ? tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className="px-4 pb-8 xl:px-6">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center rounded bg-blue-primary px-3 py-2 text-white hover:bg-blue-600 transition-colors"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </motion.button>
          }
          isSmallText
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {filteredTasks.map((task: Task, index: number) => (
          <motion.div
            key={task.id}
            variants={fadeInVariants}
            initial="initial"
            animate="animate"
            custom={index}
          >
            <TaskCard task={task} />
          </motion.div>
        ))}
        
        {filteredTasks.length === 0 && (
          <div className="col-span-full py-10 text-center text-gray-400">
            No tasks found.
          </div>
        )}
      </div>
    </div>
  );
};

export default ListView;
