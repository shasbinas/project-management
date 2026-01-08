"use client";

import Header from "@/components/Header";
import React, { useState } from "react";
import { useAppDispatch, useAppSelector } from "../redux";
import { useUpdateUserMutation, useUploadImageMutation, useGetTeamsQuery } from "@/state/api";
import { setAuth } from "@/state";
import Image from "next/image";

const Settings = () => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.global.user);
  const token = useAppSelector((state) => state.global.token);
  
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const { data: teams, isLoading: isTeamsLoading } = useGetTeamsQuery();

  const [username, setUsername] = useState(currentUser?.username || "");
  const [email, setEmail] = useState(currentUser?.email || "");
  const [teamId, setTeamId] = useState(currentUser?.teamId?.toString() || "");
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  if (!currentUser) return <div className="p-8">Please login to view settings.</div>;

  const handleSave = async () => {
    try {
      let profilePictureUrl = currentUser.profilePictureUrl;
      
      if (profilePicture) {
        const formData = new FormData();
        formData.append("file", profilePicture);
        const uploadResult = await uploadImage(formData).unwrap();
        profilePictureUrl = uploadResult.imageUrl;
      }

      const result = await updateUser({
        userId: currentUser.userId!,
        userData: { 
          username, 
          email, 
          profilePictureUrl,
          teamId: teamId ? Number(teamId) : undefined 
        },
      }).unwrap();

      dispatch(setAuth({ user: result.updatedUser, token: token! }));
      setSuccess("Profile updated successfully!");
      setError("");
    } catch (err: any) {
      setError(err.data?.message || "Failed to update profile");
      setSuccess("");
    }
  };

  const labelStyles = "block text-sm font-medium dark:text-white";
  const inputStyles =
    "mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 bg-white dark:bg-dark-secondary dark:text-white dark:border-gray-600";

  return (
    <div className="p-8 max-w-2xl">
      <Header name="Settings" />
      <div className="mt-6 space-y-6">
        {success && <div className="p-3 bg-green-100 text-green-700 rounded-md">{success}</div>}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

        <div className="flex flex-col items-center mb-6">
          <div className="relative h-24 w-24 mb-4">
             <Image
              src={currentUser.profilePictureUrl 
                ? (currentUser.profilePictureUrl.startsWith("http")
                  ? currentUser.profilePictureUrl
                  : `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${currentUser.profilePictureUrl}`)
                : "/i1.jpg"}
              alt="Profile"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-full object-cover border-2 border-blue-500"
            />
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div>
          <label className={labelStyles}>Username</label>
          <input
            type="text"
            className={inputStyles}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div>
          <label className={labelStyles}>Email</label>
          <input
            type="email"
            className={inputStyles}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className={labelStyles}>Team</label>
          <select
            className={inputStyles}
            value={teamId}
            onChange={(e) => setTeamId(e.target.value)}
            disabled={isTeamsLoading}
          >
            <option value="">Select a Team</option>
            {teams?.map((team) => (
              <option key={team.id} value={team.id}>
                {team.teamName}
              </option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleSave}
          disabled={isUpdating || isUploading}
          className="w-full bg-blue-600 text-white rounded-md py-2 px-4 font-semibold hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
        >
          {isUpdating || isUploading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default Settings;
