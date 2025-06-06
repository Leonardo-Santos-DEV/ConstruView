import React from "react";

export interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
  omitFooter?: boolean;
  hasSidebar?: boolean;
}
