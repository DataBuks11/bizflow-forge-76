import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 backdrop-blur-xl shadow-sm",
  {
    variants: {
      variant: {
        default: "border-primary/30 bg-primary/20 text-primary hover:bg-primary/30 hover:scale-105",
        secondary: "border-white/30 dark:border-gray-700/30 bg-white/40 dark:bg-gray-800/40 text-secondary-foreground hover:bg-white/60 dark:hover:bg-gray-800/60 hover:scale-105",
        destructive: "border-destructive/30 bg-destructive/20 text-destructive hover:bg-destructive/30 hover:scale-105",
        success: "border-success/30 bg-success/20 text-success hover:bg-success/30 hover:scale-105",
        warning: "border-warning/30 bg-warning/20 text-warning hover:bg-warning/30 hover:scale-105",
        outline: "border-white/40 dark:border-gray-700/40 bg-white/30 dark:bg-gray-900/30 text-foreground hover:bg-white/50 dark:hover:bg-gray-900/50 hover:scale-105",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
