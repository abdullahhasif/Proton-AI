"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "./auth-context"

interface Chat {
  id: string
  title: string
  messages: Array<{
    id: string
    role: "user" | "assistant"
    content: string
    timestamp: number
  }>
  createdAt: number
  updatedAt: number
}

interface ChatContextType {
  chats: Chat[]
  currentChatId: string | null
  currentChat: Chat | null
  createNewChat: () => string
  selectChat: (chatId: string) => void
  updateChatTitle: (chatId: string, title: string) => void
  addMessageToChat: (chatId: string, message: { role: "user" | "assistant"; content: string }) => void
  deleteChat: (chatId: string) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      // Load chats for the current user
      const savedChats = localStorage.getItem(`proton-chats-${user.id}`)
      if (savedChats) {
        const parsedChats = JSON.parse(savedChats)
        setChats(parsedChats)
        if (parsedChats.length > 0 && !currentChatId) {
          setCurrentChatId(parsedChats[0].id)
        }
      }
    } else {
      setChats([])
      setCurrentChatId(null)
    }
  }, [user])

  useEffect(() => {
    if (user && chats.length > 0) {
      localStorage.setItem(`proton-chats-${user.id}`, JSON.stringify(chats))
    }
  }, [chats, user])

  const createNewChat = (): string => {
    const newChat: Chat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    setChats((prev) => [newChat, ...prev])
    setCurrentChatId(newChat.id)
    return newChat.id
  }

  const selectChat = (chatId: string) => {
    setCurrentChatId(chatId)
  }

  const updateChatTitle = (chatId: string, title: string) => {
    setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, title, updatedAt: Date.now() } : chat)))
  }

  const addMessageToChat = (chatId: string, message: { role: "user" | "assistant"; content: string }) => {
    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === chatId) {
          const newMessage = {
            id: Date.now().toString(),
            ...message,
            timestamp: Date.now(),
          }

          const updatedChat = {
            ...chat,
            messages: [...chat.messages, newMessage],
            updatedAt: Date.now(),
          }

          // Auto-generate title from first user message
          if (chat.messages.length === 0 && message.role === "user") {
            updatedChat.title = message.content.slice(0, 50) + (message.content.length > 50 ? "..." : "")
          }

          return updatedChat
        }
        return chat
      }),
    )
  }

  const deleteChat = (chatId: string) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId))
    if (currentChatId === chatId) {
      const remainingChats = chats.filter((chat) => chat.id !== chatId)
      setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null)
    }
  }

  const currentChat = chats.find((chat) => chat.id === currentChatId) || null

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        currentChat,
        createNewChat,
        selectChat,
        updateChatTitle,
        addMessageToChat,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
