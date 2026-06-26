"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-primary-foreground shadow-[0_10px_28px_-12px_var(--primary)] hover:shadow-[0_18px_40px_-12px_var(--primary)] hover:-translate-y-0.5",
        accent:
          "bg-accent text-accent-foreground shadow-[0_10px_28px_-12px_var(--accent)] hover:-translate-y-0.5 hover:brightness-105",
        outline:
          "border border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/40",
        ghost: "bg-transparent text-foreground hover:bg-muted",
        link: "bg-transparent text-primary underline-offset-4 hover:underline px-0",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type CommonProps = VariantProps<typeof buttonVariants> & { className?: string };

type ButtonAsButton = CommonProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };
type ButtonAsLink = CommonProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const { className, variant, size } = props;
  const classes = cn(buttonVariants({ variant, size }), className);

  if (props.href !== undefined) {
    const { href, variant: _v, size: _s, className: _c, ...rest } = props;
    return <Link href={href} className={classes} {...rest} />;
  }

  const { variant: _v, size: _s, className: _c, href: _h, ...rest } = props;
  return <button className={classes} {...rest} />;
}

export { buttonVariants };
