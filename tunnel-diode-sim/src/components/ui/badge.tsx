import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

const badgeVariants = cva(
  'inline-flex items-center rounded-sm border px-2.5 py-1 font-heading text-[0.62rem] font-semibold uppercase tracking-[0.14em]',
  {
    variants: {
      variant: {
        cyan: 'border-lab-cyan/45 bg-lab-cyan/15 text-lab-cyan',
        amber: 'border-lab-amber/55 bg-lab-amber/15 text-lab-amber',
        gray: 'border-lab-gray/70 bg-zinc-950/60 text-zinc-300',
      },
    },
    defaultVariants: {
      variant: 'gray',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
