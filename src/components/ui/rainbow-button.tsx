
import React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";

interface RainbowButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function RainbowButton({
  children,
  className,
  asChild = false,
  ...props
}: RainbowButtonProps) {
  const Comp = asChild ? Slot : "button";
  
  return (
    <Comp
      className={cn(
        "group relative inline-flex h-11 items-center justify-center rounded-xl px-8 py-2 font-medium text-white transition-all",
        
        // Base styles with solid dark background
        "bg-[#1A1F2C] hover:bg-[#2A2F3C]",
        
        // Shadow and border effects
        "shadow-lg border border-slate-700/50",
        
        // Rainbow gradient on hover
        "before:absolute before:inset-0 before:rounded-xl before:transition-opacity before:duration-500",
        "before:bg-gradient-to-r before:from-indigo-500 before:via-purple-500 before:to-pink-500",
        "before:opacity-0 hover:before:opacity-10",
        
        // Scale effect on hover
        "hover:scale-[1.02] active:scale-[0.98]",
        
        // Disabled state
        "disabled:pointer-events-none disabled:opacity-50",
        
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
