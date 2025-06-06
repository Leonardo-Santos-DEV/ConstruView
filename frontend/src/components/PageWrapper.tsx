import React from 'react';
import { cn } from "@/lib/utils";
import type {PageWrapperProps} from "@/interfaces/PageWrapperProps.ts";

export const PageWrapper: React.FC<PageWrapperProps> = ({children, className, omitFooter = false, hasSidebar = false}) => {
  return (
    <>
      <div
        className={cn(
          "min-h-screen bg-sky-800 text-white flex flex-col rounded-none border-0 shadow-none",
          hasSidebar ? 'pb-24 md:pb-0' : 'pb-8 md:pb-4',
          className
        )}
      >
        <div className={"flex-grow p-0 flex"}>
          {children}
        </div>
      </div>

      {!omitFooter && (
        <footer className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-center h-8 text-center text-xs text-slate-400 bg-sky-900 md:hidden">
          www.construview.ai
        </footer>
      )}
    </>
  );
};
