import React from "react";
import { Link } from "react-router-dom";
import logoImage from "@/assets/Logo.png";
import { useAuth } from "@/context/AuthContext";
import { APP_ROUTES } from "@/helpers/constants";
import { IoLogOutOutline } from "react-icons/io5";
import type { AppHeaderProps } from "@/interfaces/componentsInterfaces.ts";

export const AppHeader: React.FC<AppHeaderProps> = ({
  projectTitle,
  screenTitle,
  screenIcon: ScreenIconComponent,
  actions,
}) => {
  const { user, logoutUser } = useAuth();

  const isScreenSpecificMode = !!(
    projectTitle ||
    screenTitle ||
    ScreenIconComponent
  );

  return (
    <header className="p-4 flex justify-between items-center sticky top-0 bg-sky-800/80 backdrop-blur-md z-20 shrink-0 border-b border-white/10 md:border-b-transparent">
      <div className="flex items-center space-x-2 sm:space-x-3 flex-grow min-w-0">
        {isScreenSpecificMode ? (
          <>
            {ScreenIconComponent && (
              <div className="bg-cyan-400 p-2 sm:p-2.5 rounded-lg shadow flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 shrink-0">
                <ScreenIconComponent size={20} className="text-white" />
              </div>
            )}
            <div className="min-w-0">
              {projectTitle && (
                <h1 className="text-md sm:text-lg font-semibold text-white truncate">
                  {projectTitle}
                </h1>
              )}
              {screenTitle && (
                <p className="text-xs sm:text-sm text-sky-200 truncate">
                  {screenTitle}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to={APP_ROUTES.PROJECTS} aria-label="Projects home page">
              <img
                src={logoImage}
                alt="Logo"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg"
              />
            </Link>
            {user ? (
              <div className="min-w-0 ml-2">
                <h1 className="text-md sm:text-lg font-semibold text-white truncate">
                  Hello, {user.userName}
                </h1>
                {user.clientName && (
                  <p className="text-xs sm:text-sm text-sky-200 truncate">
                    {user.clientName}
                  </p>
                )}
              </div>
            ) : (
              <div className="min-w-0 ml-2">
                <h1 className="text-md sm:text-lg font-semibold text-white">
                  Welcome
                </h1>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {actions}
        {user && (
          <button
            onClick={logoutUser}
            className="p-2 rounded-full text-sky-200 hover:bg-sky-700 hover:text-white transition-colors duration-150"
            aria-label="Log out"
          >
            <IoLogOutOutline size={24} />
          </button>
        )}
      </div>
    </header>
  );
};
