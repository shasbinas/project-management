"use client";

import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { hoverScaleVariants } from "@/lib/animations";

type Props = {
  task: Task;
};

const TaskCard = ({ task }: Props) => {
  return (
    <motion.div 
      variants={hoverScaleVariants}
      whileHover="hover"
      whileTap="tap"
      className="mb-3 rounded bg-white p-4 shadow dark:bg-dark-secondary dark:text-white border border-transparent hover:border-blue-500/30 transition-colors"
    >
      {task.attachments && task.attachments.length > 0 && (
        <div className="mb-4">
          <strong>Attachments:</strong>
          <div className="mt-2 flex flex-wrap gap-2">
            <Image
              src={task.attachments[0].fileURL && task.attachments[0].fileURL.startsWith("http")
                ? task.attachments[0].fileURL
                : `https://pmdevs3bucket.s3.ap-south-1.amazonaws.com/${task.attachments[0].fileURL}`}
              alt={task.attachments[0].fileName}
              width={400}
              height={200}
              className="rounded-md object-cover"
            />
          </div>
        </div>
      )}
      <div className="space-y-1">
        <p>
          <strong className="text-gray-500 dark:text-gray-400">ID:</strong> {task.id}
        </p>
        <p>
          <strong className="text-gray-500 dark:text-gray-400">Title:</strong> {task.title}
        </p>
        <p>
          <strong className="text-gray-500 dark:text-gray-400">Description:</strong>{" "}
          {task.description || "No description provided"}
        </p>
        <p>
          <strong className="text-gray-500 dark:text-gray-400">Status:</strong> {task.status}
        </p>
        <p>
          <strong className="text-gray-500 dark:text-gray-400">Priority:</strong> {task.priority}
        </p>
        <p>
          <strong className="text-gray-500 dark:text-gray-400">Tags:</strong> {task.tags || "No tags"}
        </p>
        <div className="flex flex-wrap gap-x-4">
          <p>
            <strong className="text-gray-500 dark:text-gray-400">Start Date:</strong>{" "}
            {task.startDate ? format(new Date(task.startDate), "P") : "Not set"}
          </p>
          <p>
            <strong className="text-gray-500 dark:text-gray-400">Due Date:</strong>{" "}
            {task.dueDate ? format(new Date(task.dueDate), "P") : "Not set"}
          </p>
        </div>
        <div className="flex items-center gap-4 pt-2">
          <p className="text-xs">
            <strong className="text-gray-500 dark:text-gray-400">Author:</strong>{" "}
            {task.author ? task.author.username : "Unknown"}
          </p>
          <p className="text-xs">
            <strong className="text-gray-500 dark:text-gray-400">Assignee:</strong>{" "}
            {task.assignee ? task.assignee.username : "Unassigned"}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
