import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"
import { FC } from "react"

const spinnerVariants = cva("text-muted-foreground animate-spin", {
  variants: {
    size: {
      default: "size-4",
      sm: "size-3",
      lg: "size-6",
      xl: "size-8"
    }
  },
  defaultVariants: {
    size: "default"
  }
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string
}

export const Spinner: FC<SpinnerProps> = ({ size, className }) => {
  return <Loader2 className={cn(spinnerVariants({ size }), className)} />
}
