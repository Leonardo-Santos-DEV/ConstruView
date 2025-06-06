import React from 'react';
import { cn } from "@/lib/utils";
import type {ToggleSwitchProps} from "@/interfaces/componentsInterfaces.ts";

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, onChange, disabled = false }) => {
  const handleToggle = () => {
    if (!disabled) {
      onChange(!enabled);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={cn(
        "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-sky-800",
        {
          "bg-green-500": enabled,
          "bg-red-500": !enabled,
          "cursor-not-allowed opacity-50": disabled,
        }
      )}
      disabled={disabled}
      aria-checked={enabled}
      role="switch"
    >
      <span
        aria-hidden="true"
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          {
            "translate-x-5": enabled,
            "translate-x-0": !enabled,
          }
        )}
      />
    </button>
  );
};
