import React from "react";
import type {ProjectCardProps} from "@/interfaces/componentsInterfaces.ts";

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const defaultImageUrl = 'https://via.placeholder.com/400x300.png?text=No+Image';

  return (
    <button
      onClick={onClick}
      className="group w-full text-center transition-transform duration-300 ease-in-out hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-4 focus:ring-offset-sky-800 focus:ring-cyan-400 rounded-xl"
    >
      <img
        src={project.imageUrl || defaultImageUrl}
        alt={project.projectName}
        className="w-full aspect-[4/3] object-cover rounded-xl shadow-lg"
      />
      <h3 className="mt-3 text-lg font-semibold text-white truncate group-hover:text-cyan-400 transition-colors">
        {project.projectName}
      </h3>
    </button>
  );
};
