import React, {useRef, useState, useEffect} from "react";
import type {ContentCardProps} from "@/interfaces/componentsInterfaces.ts";
import { FiEdit, FiMoreVertical, FiTrash2 } from 'react-icons/fi';

export const ContentCard: React.FC<ContentCardProps> = ({ view, onClick, onEdit, onDelete }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const imageUrlToDisplay = view.previewImageUrl || 'https://res.cloudinary.com/dfpdfsuv3/image/upload/v1749297418/vr6d7yslybmfi4ctrbxt.png';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMenuOpen(prev => !prev);
  }

  return (
    <div className="group relative">
      <button
        onClick={onClick}
        className="group w-full text-center transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-sky-800 focus:ring-cyan-400 rounded-xl"
        aria-label={`View: ${view.contentName}`}
      >
        <img
          src={imageUrlToDisplay}
          alt={`Preview for ${view.contentName}`}
          className="w-full aspect-square object-cover rounded-xl shadow-md"
        />
        <div className="mt-2">
          <p className="text-sm font-medium text-white text-center truncate group-hover:text-cyan-400 transition-colors">
            {view.contentName}
          </p>
        </div>
      </button>

      <div ref={menuRef} className="absolute top-2 right-2">
        <button
          onClick={handleMenuToggle}
          className="p-1.5 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
          aria-label="Content options"
        >
          <FiMoreVertical size={20} />
        </button>

        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-2 w-40 bg-sky-800 border border-sky-700 rounded-lg shadow-xl z-10 animate-fade-in">
            <ul className="py-1 text-sm text-sky-100">
              <li>
                <button onClick={handleEditClick} className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-sky-700">
                  <FiEdit size={16} /> Edit
                </button>
              </li>
              <li>
                <button onClick={handleDeleteClick} className="w-full text-left px-4 py-2 flex items-center gap-3 text-red-400 hover:bg-sky-700">
                  <FiTrash2 size={16} /> Delete
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
