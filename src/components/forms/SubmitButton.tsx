import { MouseEventHandler } from "react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

interface ButtonProps {
  isLoading?: boolean
  className?: string
  children: React.ReactNode
  onClick?: MouseEventHandler<HTMLButtonElement>
}

const SubmitButton = ({
  isLoading = false,
  className,
  children,
  onClick,
}: ButtonProps) => {
  return (
    <Button
      onClick={onClick}
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src="/assets/icons/loader.svg"
            alt="loader"
            width={24}
            height={24}
            className="animate-spin"
          />
        </div>
      ) : (
        children
      )}
    </Button>
  )
}

export default SubmitButton
