import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const glowVariants = cva("absolute w-full", {
  variants: {
    variant: {
      top: "top-0",
      above: "-top-[128px]",
      bottom: "bottom-0",
      below: "-bottom-[128px]",
      center: "top-[50%]",
    },
  },
  defaultVariants: {
    variant: "top",
  },
});

const Glow = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof glowVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(glowVariants({ variant }), className)}
    {...props}
  >
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 h-[200px] w-full bg-[radial-gradient(ellipse_at_center,_hsl(var(--brand)_/_0.15),_transparent_60%)] blur-2xl"
    />
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 h-[200px] w-full bg-[radial-gradient(ellipse_at_center,_hsl(var(--brand-foreground)_/_0.1),_transparent_50%)] blur-3xl"
    />
  </div>
));
Glow.displayName = "Glow";

export { Glow };
