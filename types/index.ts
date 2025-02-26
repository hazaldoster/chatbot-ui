import { LLMID } from "./llms"

export * from "./announcement"
export * from "./assistant-retrieval-item"
export * from "./chat"
export * from "./chat-file"
export * from "./chat-message"
export * from "./collection-file"
export * from "./content-type"
export * from "./file-item-chunk"
export * from "./images/assistant-image"
export * from "./images/message-image"
export * from "./images/workspace-image"
export * from "./llms"
export * from "./models"
export * from "./sharing"
export * from "./sidebar-data"

export interface ChatSettings {
  model: LLMID
  prompt: string
  temperature: number
  contextLength: number
  includeProfileContext: boolean
  includeWorkspaceInstructions: boolean
  embeddingsProvider: "openai" | "local"
  csvMode?: {
    enabled: boolean
    fileId?: string
    headers?: string[]
  }
}
