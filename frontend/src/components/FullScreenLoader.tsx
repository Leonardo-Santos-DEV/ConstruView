import React from "react";
import { ImSpinner2 } from "react-icons/im";

export const FullScreenLoader: React.FC = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-800 bg-opacity-80 backdrop-blur-sm">
    <ImSpinner2 className="h-12 w-12 animate-spin text-cyan-400" />
  </div>
);
