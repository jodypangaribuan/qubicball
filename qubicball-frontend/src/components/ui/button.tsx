import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium tracking-widest ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 uppercase duration-300 ease-natural",
    {
        variants: {
            variant: {
                default:
                    "bg-deep-forest text-white hover:bg-opacity-90 hover:scale-[1.02]",
                secondary:
                    "bg-transparent border border-sage text-sage hover:bg-sage/10",
                ghost: "hover:bg-sage/10 text-deep-forest",
                link: "text-deep-forest underline-offset-4 hover:underline",
                terracotta: "bg-terracotta text-white hover:bg-opacity-90 hover:scale-[1.02]",
            },
            size: {
                default: "h-12 px-8",
                sm: "h-10 px-6",
                lg: "h-14 px-10 text-base",
                icon: "h-12 w-12",
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
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
