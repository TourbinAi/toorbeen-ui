import dynamic from "next/dynamic"
import { icons, LucideProps } from "lucide-react"
import dynamicIconImports from "lucide-react/dynamicIconImports"

interface IconProps extends LucideProps {
  name: keyof typeof icons
}
export const Icon = ({ name, ...props }: IconProps) => {
  const LucideIcon = icons[name]

  return <LucideIcon {...props} />
}

interface DynamicIconProps extends LucideProps {
  name: keyof typeof dynamicIconImports
}
export const DynamicIcon = ({ name, ...props }: DynamicIconProps) => {
  const LucideIcon = dynamic(dynamicIconImports[name])
  return <LucideIcon {...props} />
}
