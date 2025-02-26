import { ChatbotUIContext } from "@/context/context"
import { getAssistantCollectionsByAssistantId } from "@/db/assistant-collections"
import { getAssistantFilesByAssistantId } from "@/db/assistant-files"
import { getAssistantToolsByAssistantId } from "@/db/assistant-tools"
import { updateChat } from "@/db/chats"
import { getCollectionFilesByCollectionId } from "@/db/collection-files"
import { deleteMessagesIncludingAndAfter } from "@/db/messages"
import { buildFinalMessages } from "@/lib/build-prompt"
import { Tables } from "@/supabase/types"
import { ChatMessage, ChatPayload, LLMID, ModelProvider } from "@/types"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useRef, useState, useCallback } from "react"
import { LLM_LIST } from "../../../lib/models/llm/llm-list"
import {
  createTempMessages,
  handleCreateChat,
  handleCreateMessages,
  handleHostedChat,
  handleLocalChat,
  handleRetrieval,
  processResponse,
  validateChatSettings
} from "../chat-helpers"
import { buildCSVPrompt, processCSVMessage } from "@/lib/csv-chat-handler"
import { parseCSV } from "@/lib/csv-parser"
import { getEmbeddedCSVPath } from "@/lib/csv-file-reader"
import { toast } from "sonner"

export const useChatHandler = () => {
  const router = useRouter()

  const {
    userInput,
    chatFiles,
    setUserInput,
    setNewMessageImages,
    profile,
    setIsGenerating,
    setChatMessages,
    setFirstTokenReceived,
    selectedChat,
    selectedWorkspace,
    setSelectedChat,
    setChats,
    setSelectedTools,
    availableLocalModels,
    availableOpenRouterModels,
    abortController,
    setAbortController,
    chatSettings,
    newMessageImages,
    selectedAssistant,
    chatMessages,
    chatImages,
    setChatImages,
    setChatFiles,
    setNewMessageFiles,
    setShowFilesDisplay,
    newMessageFiles,
    chatFileItems,
    setChatFileItems,
    setToolInUse,
    useRetrieval,
    sourceCount,
    setIsPromptPickerOpen,
    setIsFilePickerOpen,
    selectedTools,
    selectedPreset,
    setChatSettings,
    models,
    isPromptPickerOpen,
    isFilePickerOpen,
    isToolPickerOpen
  } = useContext(ChatbotUIContext)

  const chatInputRef = useRef<HTMLTextAreaElement>(null)

  // Add a state to track if CSV data is loaded
  const [csvDataLoaded, setCsvDataLoaded] = useState(false)
  const [csvData, setCsvData] = useState<{
    headers: string[]
    rows: string[][]
  } | null>(null)
  const [csvLoadError, setCsvLoadError] = useState<string | null>(null)

  // Load embedded CSV data when component mounts
  useEffect(() => {
    const loadEmbeddedCSVData = async () => {
      try {
        const response = await fetch("/api/embedded-csv")

        if (!response.ok) {
          throw new Error(`Failed to load CSV data: ${response.status}`)
        }

        const data = await response.json()

        // The API now returns the data directly, not wrapped in a csvData property
        setCsvData(data)
        setCsvDataLoaded(true)
        setCsvLoadError(null)
      } catch (error) {
        console.error("Error loading embedded CSV data:", error)
        setCsvLoadError(
          error instanceof Error
            ? error.message
            : "Unknown error loading CSV data"
        )
        setCsvDataLoaded(false)
      }
    }

    loadEmbeddedCSVData()
  }, [])

  useEffect(() => {
    if (!isPromptPickerOpen || !isFilePickerOpen || !isToolPickerOpen) {
      chatInputRef.current?.focus()
    }
  }, [isPromptPickerOpen, isFilePickerOpen, isToolPickerOpen])

  const handleNewChat = async () => {
    if (!selectedWorkspace) return

    setUserInput("")
    setChatMessages([])
    setSelectedChat(null)
    setChatFileItems([])

    setIsGenerating(false)
    setFirstTokenReceived(false)

    setChatFiles([])
    setChatImages([])
    setNewMessageFiles([])
    setNewMessageImages([])
    setShowFilesDisplay(false)
    setIsPromptPickerOpen(false)
    setIsFilePickerOpen(false)

    setSelectedTools([])
    setToolInUse("none")

    if (selectedAssistant) {
      setChatSettings({
        model: selectedAssistant.model as LLMID,
        prompt: selectedAssistant.prompt,
        temperature: selectedAssistant.temperature,
        contextLength: selectedAssistant.context_length,
        includeProfileContext: selectedAssistant.include_profile_context,
        includeWorkspaceInstructions:
          selectedAssistant.include_workspace_instructions,
        embeddingsProvider: selectedAssistant.embeddings_provider as
          | "openai"
          | "local"
      })

      let allFiles = []

      const assistantFiles = (
        await getAssistantFilesByAssistantId(selectedAssistant.id)
      ).files
      allFiles = [...assistantFiles]
      const assistantCollections = (
        await getAssistantCollectionsByAssistantId(selectedAssistant.id)
      ).collections
      for (const collection of assistantCollections) {
        const collectionFiles = (
          await getCollectionFilesByCollectionId(collection.id)
        ).files
        allFiles = [...allFiles, ...collectionFiles]
      }
      const assistantTools = (
        await getAssistantToolsByAssistantId(selectedAssistant.id)
      ).tools

      setSelectedTools(assistantTools)
      setChatFiles(
        allFiles.map(file => ({
          id: file.id,
          name: file.name,
          type: file.type,
          file: null
        }))
      )

      if (allFiles.length > 0) setShowFilesDisplay(true)
    } else if (selectedPreset) {
      setChatSettings({
        model: selectedPreset.model as LLMID,
        prompt: selectedPreset.prompt,
        temperature: selectedPreset.temperature,
        contextLength: selectedPreset.context_length,
        includeProfileContext: selectedPreset.include_profile_context,
        includeWorkspaceInstructions:
          selectedPreset.include_workspace_instructions,
        embeddingsProvider: selectedPreset.embeddings_provider as
          | "openai"
          | "local"
      })
    } else if (selectedWorkspace) {
      // setChatSettings({
      //   model: (selectedWorkspace.default_model ||
      //     "gpt-4-1106-preview") as LLMID,
      //   prompt:
      //     selectedWorkspace.default_prompt ||
      //     "You are a friendly, helpful AI assistant.",
      //   temperature: selectedWorkspace.default_temperature || 0.5,
      //   contextLength: selectedWorkspace.default_context_length || 4096,
      //   includeProfileContext:
      //     selectedWorkspace.include_profile_context || true,
      //   includeWorkspaceInstructions:
      //     selectedWorkspace.include_workspace_instructions || true,
      //   embeddingsProvider:
      //     (selectedWorkspace.embeddings_provider as "openai" | "local") ||
      //     "openai"
      // })
    }

    return router.push(`/${selectedWorkspace.id}/chat`)
  }

  const handleFocusChatInput = () => {
    chatInputRef.current?.focus()
  }

  const handleStopMessage = () => {
    if (abortController) {
      abortController.abort()
    }
  }

  const handleSendMessage = async (
    messageContent: string,
    deleteCount = 0,
    customChatSettings = chatSettings
  ) => {
    // Check if CSV data is loaded before proceeding
    if (!csvDataLoaded || !csvData) {
      if (csvLoadError) {
        toast.error(`CSV data could not be loaded: ${csvLoadError}`)
      } else {
        toast.error("CSV data is still loading. Please try again in a moment.")
      }
      return
    }

    const startingInput = messageContent

    try {
      // Process the message to ensure it's valid for CSV data
      const processResult = await processCSVMessage(messageContent, csvData)
      if (!processResult.isValid) {
        throw new Error(processResult.response)
      }

      // Update chat settings with CSV-specific prompt and mode
      const csvPrompt = buildCSVPrompt(csvData)
      setChatSettings(prev => ({
        ...prev!,
        prompt: csvPrompt,
        csvMode: {
          enabled: true,
          fileId: getEmbeddedCSVPath(),
          headers: csvData.headers
        }
      }))

      // Continue with existing message handling
      setUserInput("")
      setIsGenerating(true)
      setIsPromptPickerOpen(false)
      setIsFilePickerOpen(false)
      setNewMessageImages([])

      const newAbortController = new AbortController()
      setAbortController(newAbortController)

      const modelData = [
        ...models.map(model => ({
          modelId: model.model_id as LLMID,
          modelName: model.name,
          provider: "custom" as ModelProvider,
          hostedId: model.id,
          platformLink: "",
          imageInput: false
        })),
        ...LLM_LIST,
        ...availableLocalModels,
        ...availableOpenRouterModels
      ].find(llm => llm.modelId === customChatSettings?.model)

      validateChatSettings(
        customChatSettings,
        modelData,
        profile,
        selectedWorkspace,
        messageContent
      )

      let currentChat = selectedChat ? { ...selectedChat } : null

      const b64Images = newMessageImages.map(image => image.base64)

      let retrievedFileItems: Tables<"file_items">[] = []

      if (
        (newMessageFiles.length > 0 || chatFiles.length > 0) &&
        useRetrieval
      ) {
        setToolInUse("retrieval")

        retrievedFileItems = await handleRetrieval(
          userInput,
          newMessageFiles,
          chatFiles,
          customChatSettings!.embeddingsProvider,
          sourceCount
        )
      }

      const { tempUserChatMessage, tempAssistantChatMessage } =
        createTempMessages(
          messageContent,
          chatMessages,
          customChatSettings!,
          b64Images,
          false,
          setChatMessages,
          selectedAssistant
        )

      let payload: ChatPayload = {
        chatSettings: customChatSettings!,
        workspaceInstructions: selectedWorkspace!.instructions || "",
        chatMessages: [...chatMessages, tempUserChatMessage],
        assistant: selectedChat?.assistant_id ? selectedAssistant : null,
        messageFileItems: retrievedFileItems,
        chatFileItems: chatFileItems
      }

      let generatedText = ""

      if (selectedTools.length > 0) {
        setToolInUse("Tools")

        const formattedMessages = await buildFinalMessages(
          payload,
          profile!,
          chatImages
        )

        const response = await fetch("/api/chat/tools", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            chatSettings: payload.chatSettings,
            messages: formattedMessages,
            selectedTools
          })
        })

        setToolInUse("none")

        generatedText = await processResponse(
          response,
          tempAssistantChatMessage,
          true,
          newAbortController,
          setFirstTokenReceived,
          setChatMessages,
          setToolInUse
        )
      } else {
        if (modelData!.provider === "ollama") {
          generatedText = await handleLocalChat(
            payload,
            profile!,
            customChatSettings!,
            tempAssistantChatMessage,
            false,
            newAbortController,
            setIsGenerating,
            setFirstTokenReceived,
            setChatMessages,
            setToolInUse
          )
        } else {
          generatedText = await handleHostedChat(
            payload,
            profile!,
            modelData!,
            tempAssistantChatMessage,
            false,
            newAbortController,
            newMessageImages,
            chatImages,
            setIsGenerating,
            setFirstTokenReceived,
            setChatMessages,
            setToolInUse
          )
        }
      }

      if (!currentChat) {
        currentChat = await handleCreateChat(
          customChatSettings!,
          profile!,
          selectedWorkspace!,
          messageContent,
          selectedAssistant!,
          newMessageFiles,
          setSelectedChat,
          setChats,
          setChatFiles
        )
      } else {
        const updatedChat = await updateChat(currentChat.id, {
          updated_at: new Date().toISOString()
        })

        setChats(prevChats => {
          const updatedChats = prevChats.map(prevChat =>
            prevChat.id === updatedChat.id ? updatedChat : prevChat
          )

          return updatedChats
        })
      }

      await handleCreateMessages(
        chatMessages,
        currentChat,
        profile!,
        modelData!,
        messageContent,
        generatedText,
        newMessageImages,
        false,
        retrievedFileItems,
        setChatMessages,
        setChatFileItems,
        setChatImages,
        selectedAssistant
      )

      setIsGenerating(false)
      setFirstTokenReceived(false)
    } catch (error) {
      setIsGenerating(false)
      setFirstTokenReceived(false)
      setUserInput(startingInput)
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unexpected error occurred")
      }
    }
  }

  const handleSendEdit = async (
    editedContent: string,
    sequenceNumber: number
  ) => {
    if (!selectedChat) return

    await deleteMessagesIncludingAndAfter(
      selectedChat.user_id,
      selectedChat.id,
      sequenceNumber
    )

    const filteredMessages = chatMessages.filter(
      chatMessage => chatMessage.message.sequence_number < sequenceNumber
    )

    setChatMessages(filteredMessages)

    handleSendMessage(editedContent)
  }

  return {
    chatInputRef,
    prompt,
    handleNewChat,
    handleSendMessage,
    handleFocusChatInput,
    handleStopMessage,
    handleSendEdit,
    csvDataLoaded
  }
}
