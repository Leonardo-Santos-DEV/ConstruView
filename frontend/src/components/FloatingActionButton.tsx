import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import type {FloatingActionButtonProps} from "@/interfaces/componentsInterfaces.ts";

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick, ariaLabel }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-28 md:bottom-10 right-10 z-40 h-14 w-14 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-cyan-600 transition-all transform hover:scale-110"
      aria-label={ariaLabel}
    >
      <FaPlus size={24} />
    </button>
  );
};
