import React from "react";
import { FiEdit, FiTrash2, FiShare2 } from "react-icons/fi";
import { TbView360Arrow } from "react-icons/tb";
import type { ContentListItemProps } from "@/interfaces/componentsInterfaces.ts";

export const ContentListItem: React.FC<ContentListItemProps> = ({
  view,
  onClick,
  onEdit,
  onDelete,
  onShare,
}) => {
  return (
    <li className="flex items-center justify-between p-4 bg-sky-900/50 rounded-lg transition-colors hover:bg-sky-800/60">
      <button
        onClick={onClick}
        className="flex items-center gap-4 flex-grow text-left"
      >
        <div className="p-2 bg-cyan-500/20 rounded-lg">
          <TbView360Arrow size={22} className="text-cyan-400" />
        </div>
        <div>
          <p className="font-semibold text-white">{view.contentName}</p>
          <p className="text-sm text-slate-400">Clique para visualizar</p>
        </div>
      </button>

      <div className="flex items-center gap-3 shrink-0 ml-4">
        <button
          onClick={onShare}
          className="p-2 rounded-full text-sky-200 hover:bg-sky-700 hover:text-white"
          aria-label="Share"
        >
          <FiShare2 size={18} />
        </button>
        <button
          onClick={onEdit}
          className="p-2 rounded-full text-sky-200 hover:bg-sky-700 hover:text-white"
          aria-label="Edit"
        >
          <FiEdit size={18} />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-full text-red-400 hover:bg-sky-700 hover:text-white"
          aria-label="Delete"
        >
          <FiTrash2 size={18} />
        </button>
      </div>
    </li>
  );
};
