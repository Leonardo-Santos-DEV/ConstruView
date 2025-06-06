import React from "react";
import type {ContentCardProps} from "@/interfaces/componentsInterfaces.ts";

export const ContentCard: React.FC<ContentCardProps> = ({ view, onClick }) => {
  const imageUrlToDisplay = view.previewImageUrl || 'https://via.placeholder.com/400x300.png?text=Preview+Not+Available';
  return (
    <button
      onClick={onClick}
      className="group w-full text-center transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-sky-800 focus:ring-cyan-400 rounded-xl"
      aria-label={`View: ${view.contentName}`}
    >
      <img
        src={imageUrlToDisplay}
        alt={`Preview for ${view.contentName}`}
        className="w-full aspect-square object-cover rounded-xl shadow-md"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.onerror = null;
          target.src = 'https://via.placeholder.com/400x300.png?text=Image+Error';
        }}
      />
      <div className="mt-2">
        <p className="text-sm font-medium text-white text-center truncate group-hover:text-cyan-400 transition-colors">
          {view.contentName}
        </p>
      </div>
    </button>
  );
};
