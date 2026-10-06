import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

import { cn } from '@/lib/utils'

// Graphical Button assignments (gui/themes/untitled-components.md → Button),
// mapped onto shadcn's variant names: default = primary, destructive = danger.
// Edges are inset box shadows (native border 0); text is the ui role, medium.
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-[var(--space-xs)] whitespace-nowrap rounded-[var(--radius-s)] border-0 font-[family-name:var(--font-ui)] [font-weight:var(--weight-ui-medium)] text-[length:var(--size-m)] leading-[var(--line-m)] tracking-[var(--letter-spacing-m)] transition-[background-color,box-shadow,color,transform] duration-[var(--motion-duration)] ease-[var(--motion-easing)] focus-visible:[outline:var(--focus-ring-outline)] focus-visible:outline-offset-2 active:translate-y-[var(--motion-press-distance)] disabled:pointer-events-none disabled:bg-[var(--neutral-3)] disabled:text-[var(--cte-text-muted)] disabled:shadow-[inset_0_0_0_var(--border-s)_var(--neutral-4-transparent)] [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-[var(--color-1)] text-[var(--cte-accent-text)] shadow-[inset_0_0_0_var(--border-s)_var(--color-1-transparent)] hover:shadow-[inset_0_0_0_var(--border-s)_var(--color-1-transparent),var(--shadow-s)]',
        destructive:
          'bg-[var(--error)] text-[var(--neutral-1)] shadow-[inset_0_0_0_var(--border-s)_var(--error-transparent)] hover:shadow-[inset_0_0_0_var(--border-s)_var(--error-transparent),var(--shadow-s)]',
        outline:
          'bg-transparent text-[var(--neutral-10)] shadow-[inset_0_0_0_var(--border-s)_var(--neutral-4)] hover:bg-[var(--neutral-3-transparent)]',
        secondary:
          'bg-[var(--neutral-3)] text-[var(--neutral-10)] shadow-[inset_0_0_0_var(--border-s)_var(--neutral-3-transparent)] hover:bg-[var(--neutral-4-transparent)]',
        ghost:
          'bg-transparent text-[var(--neutral-10)] hover:bg-[var(--neutral-3-transparent)]',
        link: 'text-[var(--cte-text)] underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-10 px-[var(--space-m)] py-[var(--space-xs)]',
        sm: 'h-9 px-[var(--space-s)] text-[length:var(--size-s)] leading-[var(--line-s)] tracking-[var(--letter-spacing-s)]',
        lg: 'h-11 px-[var(--space-xl)]',
        icon: 'h-10 w-10'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
