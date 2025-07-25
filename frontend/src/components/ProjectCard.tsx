// CÓDIGO ATUALIZADO - COPIAR E COLAR
import React, {useEffect, useRef, useState} from "react";
import type {ProjectCardProps} from "@/interfaces/componentsInterfaces.ts";
import {FiEdit, FiMoreVertical, FiTrash2, FiUsers} from "react-icons/fi";
import {useAuth} from "@/context/AuthContext.tsx";
import {PermissionsModal} from "@/components/PermissionsModal.tsx";

export const ProjectCard: React.FC<ProjectCardProps> = ({project, onClick, onEdit, onDelete}) => {
  const defaultImageUrl = 'https://res.cloudinary.com/dfpdfsuv3/image/upload/v1749297418/vr6d7yslybmfi4ctrbxt.png';

  const {user} = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Função para fechar o menu ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  // Handlers internos para parar a propagação do evento
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

  const handlePermissionsClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Impede que o clique no botão abra o projeto
    setIsPermissionsModalOpen(true);
    setIsMenuOpen(false); // Fecha o outro menu se estiver aberto
  };

  return (
    <>
      <div className="group relative text-center">
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

        {user?.isMasterAdmin && (
          <div ref={menuRef} className="absolute top-2 right-2">
            <button
              onClick={handleMenuToggle}
              className="p-1.5 bg-black/40 rounded-full text-white hover:bg-black/60 transition-colors"
              aria-label="Project options"
            >
              <FiMoreVertical size={20}/>
            </button>
            {isMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-sky-800 ...">
                <ul>
                  <button onClick={handleEditClick}
                          className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-sky-700">
                    <FiEdit size={16}/> Edit
                  </button>
                  <li>
                    <button onClick={handlePermissionsClick}
                            className="w-full text-left px-4 py-2 flex items-center gap-3 hover:bg-sky-700">
                      <FiUsers size={16}/> Manage Permissions
                    </button>
                  </li>
                  <button onClick={handleDeleteClick}
                          className="w-full text-left px-4 py-2 flex items-center gap-3 text-red-400 hover:bg-sky-700">
                    <FiTrash2 size={16}/> Delete
                  </button>
                </ul>
              </div>
            )}
          </div>
        )}

      </div>
      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        project={project}
      />
    </>
  );
};
