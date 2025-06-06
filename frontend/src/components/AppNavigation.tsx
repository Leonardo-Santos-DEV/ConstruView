import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logoImage from '@/assets/Logo.png';
import { APP_ROUTES, type NavItemConfig } from '../helpers/constants.tsx';

interface AppNavigationProps {
  items: NavItemConfig[];
}

export const AppNavigation: React.FC<AppNavigationProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleInteraction = (item: NavItemConfig) => {
    if (item.action) {
      item.action();
    } else if (item.path !== undefined) {
      if (typeof item.path === 'number') {
        navigate(item.path);
      } else {
        navigate(item.path);
      }
    }
  };

  const renderNavItem = (item: NavItemConfig, isDesktop: boolean) => {
    const IconComponent = item.icon;

    if (typeof item.path === 'string' && !item.action) {
      return (
        <NavLink
          key={item.id}
          to={item.path}
          end={item.path === APP_ROUTES.PROJECTS}
          className={({ isActive }) => {
            const commonClassesBase = isDesktop
              ? "flex items-center space-x-3 p-3 rounded-lg w-full text-left"
              : "flex flex-col items-center justify-center p-2 rounded-lg space-y-1 min-w-[60px]";

            const activeClasses = isDesktop
              ? "bg-cyan-400 text-white font-semibold shadow-md"
              : "text-cyan-400 scale-110";

            const inactiveClasses = isDesktop
              ? "text-sky-200 hover:bg-sky-700 hover:text-white"
              : "text-sky-200 hover:text-white";

            return `${commonClassesBase} transition-all duration-150 ease-in-out ${isActive ? activeClasses : inactiveClasses}`;
          }}
          aria-label={item.label}
        >
          {({ isActive }) => (
            <>
              <IconComponent size={isDesktop ? 20 : 22} />
              <span className={
                isDesktop
                  ? `text-sm ${isActive ? 'font-semibold' : 'font-medium'}`
                  : `text-xs font-medium ${isActive ? '' : 'text-sky-200'}`
              }>{item.label}</span>
            </>
          )}
        </NavLink>
      );
    }

    return (
      <button
        key={item.id}
        onClick={() => handleInteraction(item)}
        className={
          isDesktop
            ? `flex items-center space-x-3 p-3 rounded-lg w-full text-left text-sky-200 hover:bg-sky-700 hover:text-white transition-all duration-150 ease-in-out`
            : `flex flex-col items-center justify-center p-2 rounded-lg space-y-1 min-w-[60px] text-sky-200 hover:text-white transition-all duration-150 ease-in-out`
        }
        aria-label={item.label}
      >
        <IconComponent size={isDesktop ? 20 : 22} strokeWidth={2} />
        <span className={isDesktop ? `text-sm font-medium` : `text-xs font-medium`}>
          {item.label}
        </span>
      </button>
    );
  };

  return (
    <>
      <nav className="md:hidden fixed bottom-8 left-0 right-0 bg-sky-900/95 backdrop-blur-md shadow-t-lg border-t border-white/10 p-1.5 z-40">
        <div className="max-w-md mx-auto flex justify-around items-center space-x-1">
          {items.map(item => renderNavItem(item, false))}
        </div>
      </nav>

      <aside className="hidden md:flex flex-col fixed left-0 top-0 h-full w-56 lg:w-64 bg-sky-900 border-r border-white/5 p-4 z-40">
        <div className="mb-6 mt-2 px-2">
          <Link to={APP_ROUTES.PROJECTS} className="flex items-center space-x-2.5 group" aria-label="Go to Projects Home">
            <img src={logoImage} alt="Logo" className="group-hover:scale-105 transition-transform duration-150 w-9 h-9 rounded-lg"/>
            <span className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-150">
              Constru<span className="text-cyan-400 group-hover:text-white transition-colors duration-150">VIEW</span>
            </span>
          </Link>
        </div>
        <nav className="flex flex-col space-y-1.5">
          {items.map(item => renderNavItem(item, true))}
        </nav>
        <div className="mt-auto text-center text-xs text-slate-400/80 pb-2">
          www.construview.ai
        </div>
      </aside>
    </>
  );
};
