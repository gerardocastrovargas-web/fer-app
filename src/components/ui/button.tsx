import { ButtonHTMLAttributes, forwardRef } from 'react'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--surface)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-[var(--radius-md)]'
    
    const variants = {
      primary: 'bg-white text-black hover:bg-white/90 focus:ring-white/50',
      secondary: 'bg-[var(--surface-elevated)] text-white hover:bg-white/10 focus:ring-white/20',
      outline: 'border border-[var(--border)] text-white hover:bg-white/5 focus:ring-white/20',
      danger: 'bg-[var(--danger)] text-white hover:bg-red-600 focus:ring-red-500/50',
    }

    const sizes = {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'
