import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const buttonVariants = cva(
  'group inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm border text-xs font-semibold uppercase tracking-[0.14em] font-heading transition-all duration-300 outline-none ring-offset-transparent active:translate-y-[1px] disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50 focus-visible:ring-2 focus-visible:ring-lab-cyan/70',
  {
    variants: {
      variant: {
        default:
          'border-lab-cyan/55 bg-lab-cyan/15 text-lab-cyan hover:bg-lab-cyan/25 hover:shadow-[0_0_12px_rgba(34,211,238,0.45)]',
        secondary:
          'border-lab-gray/60 bg-zinc-950/75 text-zinc-300 hover:border-lab-cyan/40 hover:text-lab-cyan',
        amber:
          'border-lab-amber/55 bg-lab-amber/15 text-lab-amber hover:bg-lab-amber/25 hover:shadow-[0_0_12px_rgba(251,191,36,0.45)]',
        ghost:
          'border-transparent bg-transparent text-zinc-400 hover:text-lab-cyan hover:bg-lab-cyan/10',
        danger:
          'border-rose-400/45 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 hover:shadow-[0_0_10px_rgba(239,68,68,0.35)]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 text-[0.65rem]',
        icon: 'h-9 w-9 px-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button };
