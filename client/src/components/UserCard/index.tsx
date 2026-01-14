"use client";

import { User } from "@/state/api";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";
import { fadeInVariants, hoverScaleVariants } from "@/lib/animations";

type Props = {
  user: User;
};

const UserCard = ({ user }: Props) => {
  return (
    <motion.div 
      variants={fadeInVariants}
      initial="initial"
      animate="animate"
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="flex items-center rounded border p-4 shadow dark:bg-dark-secondary dark:text-white dark:border-dark-tertiary transition-shadow hover:shadow-lg"
    >
      {user.profilePictureUrl && (
        <Image
          src={user.profilePictureUrl && user.profilePictureUrl.startsWith("http") 
            ? user.profilePictureUrl 
            : `https://pmdevs3bucket.s3.ap-south-1.amazonaws.com/${user.profilePictureUrl}`}
          alt="profile picture"
          width={32}
          height={32}
          className="rounded-full shadow-sm"
        />
      )}
      <div className="ml-4">
        <h3 className="font-bold">{user.username}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>
    </motion.div>
  );
};

export default UserCard;
