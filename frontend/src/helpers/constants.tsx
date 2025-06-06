import React from "react";
import type { NavigateFunction } from 'react-router-dom';
import type { Category } from "@/interfaces/categoryInterfaces.ts";
import { GoHome } from "react-icons/go";
import { PiFileCloudFill, PiDrone, PiVideoCameraFill } from "react-icons/pi";
import { TbView360Arrow } from "react-icons/tb";
import {MdOutlineAdminPanelSettings } from "react-icons/md";
import type {AuthenticatedUser} from "@/interfaces/authInterfaces.ts";

export const APP_ROUTES = {
  LOGIN: '/',
  PROJECTS: '/projects',
  CLIENTS: '/clients',
  PROJECT_DETAIL_BASE: '/project',
  CLIENT_USERS_BASE: '/clients',
  THREE_SIXTY_GALLERY_RELATIVE: '/360',
  THREE_SIXTY_VIEW_RELATIVE: '/360/view',
  DOCS_RELATIVE: '/docs',
  AERIAL_VIEWS_RELATIVE: '/aerial',
  LIVE_CAM_RELATIVE: '/livecam',
};

export const PROJECT_CATEGORIES: Category[] = [
  {name: "Docs", type: "doc", icon: PiFileCloudFill, pathSegment: APP_ROUTES.DOCS_RELATIVE.substring(1) },
  {name: "360 Views", type: "360view", icon: TbView360Arrow, pathSegment: APP_ROUTES.THREE_SIXTY_GALLERY_RELATIVE.substring(1) },
  {name: "Aerial", type: "aerial", icon: PiDrone, pathSegment: APP_ROUTES.AERIAL_VIEWS_RELATIVE.substring(1) },
  {name: "Live Cam", type: "livecam", icon: PiVideoCameraFill, pathSegment: APP_ROUTES.LIVE_CAM_RELATIVE.substring(1) },
];

export interface NavItemConfig {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string | number;
  action?: () => void;
}

export const getTopLevelNavItems = (user: AuthenticatedUser | null, _navigate: NavigateFunction): NavItemConfig[] => {
  const items: NavItemConfig[] = [
    {
      id: 'nav_projects',
      label: 'Projects',
      icon: GoHome,
      path: APP_ROUTES.PROJECTS
    },
  ];

  if (user?.isMasterAdmin) {
    items.push({
      id: 'nav_clients',
      label: 'Clients',
      icon: MdOutlineAdminPanelSettings ,
      path: APP_ROUTES.CLIENTS
    });
  }

  return items;
};

export const getProjectCategoryNavItems = (projectId: string, _navigate: NavigateFunction): NavItemConfig[] => [
  {
    id: 'nav_home_detail',
    label: 'Home',
    icon: GoHome,
    path: APP_ROUTES.PROJECTS
  },
  {
    id: 'nav_docs_detail',
    label: 'Docs',
    icon: PiFileCloudFill,
    path: `${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}${APP_ROUTES.DOCS_RELATIVE}`
  },
  {
    id: 'nav_360_detail',
    label: '360 Views',
    icon: TbView360Arrow,
    path: `${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}${APP_ROUTES.THREE_SIXTY_GALLERY_RELATIVE}`
  },
  {
    id: 'nav_aerial_detail',
    label: 'Aerial',
    icon: PiDrone,
    path: `${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}${APP_ROUTES.AERIAL_VIEWS_RELATIVE}`
  },
  {
    id: 'nav_livecam_detail',
    label: 'Live Cam',
    icon: PiVideoCameraFill,
    path: `${APP_ROUTES.PROJECT_DETAIL_BASE}/${projectId}${APP_ROUTES.LIVE_CAM_RELATIVE}`
  },
];
