import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-zinc-800",
  {
    variants: {
      variant: {
        default:
          "bg-zinc-900 text-zinc-50 shadow hover:bg-zinc-900/90 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-50/90",
        destructive:
          "bg-red-500 text-zinc-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-red-50 dark:hover:bg-red-900/90",
        outline:
          "border bg-stone-200 shadow-sm hover:bg-stone-50 hover:text-stone-950 dark:bg-zinc-800 dark:hover:bg-zinc-950 dark:hover:text-zinc-200 dark:text-zinc-300",
        secondary:
          "bg-stone-500 text-zinc-50 shadow-sm hover:bg-zinc-300 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-500",
        ghost:
          "hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-50",
        link: "text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-50",
        brand:
          "inline-block text-base transition-all duration-100 ease-linear font-medium hover:bg-black/90 group bg-black px-7 py-4 text-center text-white dark:bg-white dark:text-black dark:hover:bg-white/90",
        icon: "text-gray-400 hover:text-stone-900 dark:hover:text-neutral-200",
      },
      size: {
        default: "px-4 py-3",
        sm: "py-2 px-3 text-xs",
        lg: "py-3 px-8",
        xl: "py-4 px-8",
        icon: "",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };

{
  /* <div className="">
  <Button size="xl" className="w-full font-bold" variant="brand">
    <a
      href="https://github.com/lucky-chap/kaminari"
      target="_blank"
      rel="noreferrer"
      className="pb-1 dark:text-zinc-800 text-zinc-100"
    >
      Repo
    </a>{" "}
  </Button>
</div> */
}
