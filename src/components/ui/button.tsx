import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-entersys-primary disabled:pointer-events-none disabled:opacity-60 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "bg-entersys-primary text-white rounded-[10px] shadow-[0_4px_6px_-1px_rgba(0,156,166,0.3),0_2px_4px_-1px_rgba(0,156,166,0.2),inset_0_-2px_0_rgba(0,0,0,0.1)] hover:bg-entersys-dark hover:shadow-[0_6px_8px_-1px_rgba(9,61,83,0.4),0_4px_6px_-1px_rgba(9,61,83,0.3),inset_0_-2px_0_rgba(0,0,0,0.15)] hover:-translate-y-0.5 active:translate-y-0 active:shadow-[0_2px_4px_-1px_rgba(0,156,166,0.3),0_1px_2px_-1px_rgba(0,156,166,0.2),inset_0_2px_4px_rgba(0,0,0,0.15)]",
        destructive: "bg-red-600 text-white rounded-[10px] shadow-[0_4px_6px_-1px_rgba(220,38,38,0.3)] hover:bg-red-700 hover:shadow-[0_6px_8px_-1px_rgba(185,28,28,0.4)] hover:-translate-y-0.5",
        outline: "border-2 border-gray-300 bg-white text-gray-700 rounded-[10px] shadow-sm hover:bg-gray-50 hover:border-entersys-primary hover:text-entersys-primary",
        secondary: "bg-gray-100 text-gray-900 rounded-[10px] shadow-sm hover:bg-gray-200",
        ghost: "hover:bg-gray-100 hover:text-gray-900 rounded-lg",
        link: "text-entersys-primary underline-offset-4 hover:underline hover:text-entersys-dark",
      },
      size: {
        default: "h-11 px-6 text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-8 text-lg",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
