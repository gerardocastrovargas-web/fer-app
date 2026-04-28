import { HTMLAttributes, forwardRef } from 'react'

export interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-[var(--radius-full)] text-xs font-medium'
    
    const variants = {
      default: 'bg-white/10 text-white',
      success: 'bg-[var(--success)]/20 text-emerald-400',
      warning: 'bg-[var(--warning)]/20 text-amber-400',
      danger: 'bg-[var(--danger)]/20 text-red-400',
    }

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      />
    )
  }
)
Badge.displayName = 'Badge'
