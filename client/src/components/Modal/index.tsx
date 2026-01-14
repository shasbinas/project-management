"use client";

import React from "react";
import ReactDOM from "react-dom";
import Header from "../Header";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { modalVariants } from "@/lib/animations";

type Props = {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  name: string;
};

const Modal = ({ children, isOpen, onClose, name }: Props) => {
  if (typeof window === "undefined") return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex h-full w-full items-center justify-center overflow-hidden p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-2xl rounded-lg bg-white p-4 shadow-xl dark:bg-dark-secondary"
          >
            <Header
              name={name}
              buttonComponent={
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-primary text-white hover:bg-blue-600 transition-colors"
                  onClick={onClose}
                >
                  <X size={18} />
                </motion.button>
              }
              isSmallText
            />
            <div className="mt-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default Modal;
