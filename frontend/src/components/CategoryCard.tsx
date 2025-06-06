import React from "react";
import type {CategoryCardProps} from "@/interfaces/componentsInterfaces.ts";

export const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  const IconComponent = category.icon;
  return (
    <button
      onClick={onClick}
      className="bg-sky-700 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 aspect-square transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:bg-sky-600 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-sky-800 focus:ring-cyan-400"
    >
      {IconComponent && <IconComponent size={48} className="text-cyan-400" />}
      <span className="text-md font-semibold text-white text-center">{category.name}</span>
    </button>
  );
};
