import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  // Whitespace-nowrap: Badges should never wrap.
  "whitespace-nowrap inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-soft backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-[var(--glass-stroke)] bg-primary/20 text-primary shadow-xs",
        secondary: "border-[var(--glass-stroke)] bg-secondary/15 text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive/90 text-destructive-foreground shadow-xs",

        outline: "border-[var(--badge-outline)] bg-white/60 text-foreground shadow-xs",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants }
