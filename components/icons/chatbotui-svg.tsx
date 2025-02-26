import { FC } from "react"
import Image from "next/image"

interface ChatbotUISVGProps {
  theme: "dark" | "light"
  scale?: number
}

export const ChatbotUISVG: FC<ChatbotUISVGProps> = ({ theme, scale = 1 }) => {
  // Calculate dimensions based on scale
  const width = 189 * scale
  const height = 194 * scale

  return (
    <Image
      src="/icon-256x256.png" // Using the image from public directory
      alt="Chatbot UI Logo"
      width={width}
      height={height}
      priority
      className={`${theme === "dark" ? "dark-filter" : "light-filter"}`}
    />
  )
}
