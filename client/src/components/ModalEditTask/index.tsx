import Modal from "@/components/Modal";
import { Priority, Status, Task, useGetUsersQuery, useUpdateTaskMutation } from "@/state/api";
import React, { useEffect, useState } from "react";
import { formatISO } from "date-fns";
import { useAppSelector } from "@/app/redux";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
};

const ModalEditTask = ({ isOpen, onClose, task }: Props) => {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const { data: users } = useGetUsersQuery();
  const currentUser = useAppSelector((state) => state.global.user);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");

  useEffect(() => {
    if (task) {
        setTitle(task.title);
        setDescription(task.description || "");
        setStatus(task.status || Status.ToDo);
        setPriority(task.priority || Priority.Backlog);
        setTags(task.tags || "");
        setStartDate(task.startDate ? new Date(task.startDate).toISOString().split("T")[0] : "");
        setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
        setAssignedUserId(task.assignedUserId ? String(task.assignedUserId) : "");
        setProjectId(task.projectId ? String(task.projectId) : "");
    }
  }, [task]);

  const handleSubmit = async () => {
    if (!title || !task) return;

    const formattedStartDate = startDate ? formatISO(new Date(startDate), {
      representation: "complete",
    }) : undefined;
    
    const formattedDueDate = dueDate ? formatISO(new Date(dueDate), {
      representation: "complete",
    }) : undefined;

    try {
      await updateTask({
        taskId: task.id,
        task: {
            title,
            description,
            status,
            priority,
            tags,
            startDate: formattedStartDate,
            dueDate: formattedDueDate,
            assignedUserId: assignedUserId ? parseInt(assignedUserId) : undefined,
            projectId: Number(projectId),
        },
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const isFormValid = () => {
    return title;
  };

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Edit Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          placeholder="Title (Required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as Status)
            }
          >
            <option value={Status.ToDo}>To Do</option>
            <option value={Status.WorkInProgress}>Work In Progress</option>
            <option value={Status.UnderReview}>Under Review</option>
            <option value={Status.Completed}>Completed</option>
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) =>
              setPriority(e.target.value as Priority)
            }
          >
            <option value={Priority.Urgent}>Urgent</option>
            <option value={Priority.High}>High</option>
            <option value={Priority.Medium}>Medium</option>
            <option value={Priority.Low}>Low</option>
            <option value={Priority.Backlog}>Backlog</option>
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          placeholder="Tags (comma separated)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Start Date</label>
            <input
              type="date"
              className={inputStyles}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-gray-300">Due Date</label>
            <input
              type="date"
              className={inputStyles}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <select
          className={selectStyles}
          value={assignedUserId}
          onChange={(e) => setAssignedUserId(e.target.value)}
        >
          <option value="">Assign To (Optional)</option>
          {users?.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.username}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className={`focus-offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-primary px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
            !isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""
          }`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Updating..." : "Update Task"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalEditTask;
