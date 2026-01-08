import React, { useState } from "react";
import Modal from "@/components/Modal";
import { useCreateTeamMutation, useGetUsersQuery } from "@/state/api";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalNewTeam = ({ isOpen, onClose }: Props) => {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const { data: users } = useGetUsersQuery();
  
  const [teamName, setTeamName] = useState("");
  const [productOwnerUserId, setProductOwnerUserId] = useState("");
  const [projectManagerUserId, setProjectManagerUserId] = useState("");

  const handleSubmit = async () => {
    if (!teamName) return;

    await createTeam({
      teamName,
      productOwnerUserId: productOwnerUserId ? Number(productOwnerUserId) : undefined,
      projectManagerUserId: projectManagerUserId ? Number(projectManagerUserId) : undefined,
    });
    onClose();
    setTeamName("");
    setProductOwnerUserId("");
    setProjectManagerUserId("");
  };

  const isFormValid = () => {
    return teamName !== "";
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Team">
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
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        
        <select
          className={inputStyles}
          value={productOwnerUserId}
          onChange={(e) => setProductOwnerUserId(e.target.value)}
        >
          <option value="">Select Product Owner (Optional)</option>
          {users?.map((user) => (
            <option key={user.userId} value={user.userId}>
              {user.username}
            </option>
          ))}
        </select>

        <select
          className={inputStyles}
          value={projectManagerUserId}
          onChange={(e) => setProjectManagerUserId(e.target.value)}
        >
          <option value="">Select Project Manager (Optional)</option>
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
          {isLoading ? "Creating..." : "Create Team"}
        </button>
      </form>
    </Modal>
  );
};

export default ModalNewTeam;
