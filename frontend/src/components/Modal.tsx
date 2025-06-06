import React, { type ReactNode } from 'react';
import { IoClose } from 'react-icons/io5';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        onClick={(e) => e.stopPropagation()} // Impede que o clique no modal o feche
        className="relative bg-sky-800 border border-sky-700 rounded-xl shadow-2xl w-full max-w-md m-4 animate-slide-in-up"
      >
        <div className="flex items-center justify-between p-4 border-b border-sky-700">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-sky-200 hover:bg-sky-700 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};
