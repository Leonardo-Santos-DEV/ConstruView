import type {Category} from "@/interfaces/categoryInterfaces.ts";
import type {Project} from "@/interfaces/projectInterfaces.ts";
import type {Content} from "@/interfaces/contentInterfaces.ts";
import React, {type ReactNode} from "react";
import type {APIError} from "@/interfaces/apiErrorsInterfaces.ts";

export interface AppHeaderProps {
  projectTitle?: string;
  screenTitle?: string;
  screenIcon?: React.ElementType;
}

export interface ProjectCardProps {
  project: Project;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void
}

export interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export interface ContentListItemProps {
  view: Content;
  onClick: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export interface ScreenStatusHandlerProps<TData> {
  isLoading: boolean;
  error?: APIError | null;
  data: TData | null | undefined;
  navItems?: any[];
  notFoundMessage?: string;
  children: (data: TData) => ReactNode;
}

export interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export interface FloatingActionButtonProps {
  onClick: () => void;
  ariaLabel: string;
}
