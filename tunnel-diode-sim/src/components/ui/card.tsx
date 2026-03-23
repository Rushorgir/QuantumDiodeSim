import * as React from 'react';
import { cn } from '../../lib/cn';

function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'interactive-panel panel-glass instrument-shell rounded-md border border-white/10 p-6 shadow-xl',
        className
      )}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mb-5 flex items-center justify-between border-b border-white/5 pb-4', className)} {...props} />;
}

function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('font-heading text-base font-bold uppercase tracking-[0.16em] text-lab-cyan', className)} {...props} />;
}

function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}

export { Card, CardHeader, CardTitle, CardContent };
