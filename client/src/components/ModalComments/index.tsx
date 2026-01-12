import Modal from "@/components/Modal";
import { Task, useCreateCommentMutation } from "@/state/api";
import React, { useState } from "react";
import Image from "next/image";
import { useAppSelector } from "@/app/redux";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
};

const ModalComments = ({ isOpen, onClose, task }: Props) => {
  const [createComment, { isLoading }] = useCreateCommentMutation();
  const currentUser = useAppSelector((state) => state.global.user);
  const [commentText, setCommentText] = useState("");

  if (!task) return null;

  const handleSubmit = async () => {
    if (!commentText || !currentUser) return;

    try {
      await createComment({
        taskId: task.id,
        content: commentText,
        authorUserId: currentUser.userId,
      }).unwrap();
      setCommentText("");
    } catch (error) {
      console.error("Failed to create comment:", error);
    }
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name={`Comments`}>
      <div className="flex flex-col gap-4 mt-2">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{task.title}</h3>
        
        {/* Comments List */}
        <div className="max-h-60 overflow-y-auto space-y-4 p-2 bg-gray-50 dark:bg-dark-secondary rounded-md">
          {task.comments && task.comments.length > 0 ? (
            task.comments.map((comment) => (
              <div key={comment.id} className="flex gap-2 items-start">
                 {comment.user && (
                  <Image
                    src={comment.user.profilePictureUrl && comment.user.profilePictureUrl.startsWith("http")
                      ? comment.user.profilePictureUrl
                      : `https://pmdevs3bucket.s3.ap-south-1.amazonaws.com/${comment.user.profilePictureUrl || "default.jpg"}`}
                    alt={comment.user.username}
                    width={30}
                    height={30}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                )}
                <div className="flex flex-col bg-white dark:bg-dark-tertiary p-2 rounded-lg shadow-sm w-full">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-200">
                      {comment.user ? comment.user.username : "Unknown User"}
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{comment.text}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center">No comments yet.</p>
          )}
        </div>

        {/* Add Comment */}
        <div className="flex gap-2 items-center">
            <input
              type="text"
              className={inputStyles}
              placeholder="Write a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSubmit();
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !commentText}
              className={`rounded-md bg-blue-primary px-4 py-2 text-white hover:bg-blue-600 ${
                isLoading || !commentText ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Send
            </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalComments;
