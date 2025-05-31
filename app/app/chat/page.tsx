"use client"

import type React from "react"

import { useChat as useAIChat } from "ai/react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Bot, User, Sparkles, Plus, MessageSquare, Trash2, LogOut, Menu } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useChat } from "@/lib/chat-context"
import { useRouter } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function ChatPage() {
  const { user, logout } = useAuth()
  const { chats, currentChat, currentChatId, createNewChat, selectChat, addMessageToChat, deleteChat } = useChat()
  const router = useRouter()
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useAIChat({
    api: "/api/chat",
    onFinish: (message) => {
      if (currentChatId) {
        addMessageToChat(currentChatId, { role: "assistant", content: message.content })
      }
    },
  })

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }
  }, [user, router])

  useEffect(() => {
    if (currentChat) {
      setMessages(
        currentChat.messages.map((msg) => ({
          id: msg.id,
          role: msg.role,
          content: msg.content,
        })),
      )
    } else {
      setMessages([])
    }
  }, [currentChat, setMessages])

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleNewChat = () => {
    createNewChat()
    setSidebarOpen(false)
  }

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (input.trim() && currentChatId) {
      addMessageToChat(currentChatId, { role: "user", content: input })
    } else if (input.trim() && !currentChatId) {
      const newChatId = createNewChat()
      addMessageToChat(newChatId, { role: "user", content: input })
    }
    handleSubmit(e)
  }

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  const Sidebar = () => (
    <div className="w-64 bg-slate-50 border-r border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-slate-800">Proton AI</h2>
            <p className="text-xs text-slate-600">{user?.name}</p>
          </div>
        </div>
        <Button onClick={handleNewChat} className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Chat
        </Button>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1 p-2">
        <div className="space-y-1">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`group flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-slate-100 ${
                currentChatId === chat.id ? "bg-slate-100" : ""
              }`}
              onClick={() => {
                selectChat(chat.id)
                setSidebarOpen(false)
              }}
            >
              <MessageSquare className="w-4 h-4 text-slate-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">{chat.title}</p>
                <p className="text-xs text-slate-500">{formatDate(chat.updatedAt)}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation()
                  deleteChat(chat.id)
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200">
        <Button variant="ghost" onClick={handleLogout} className="w-full justify-start" size="sm">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )

  if (!user) {
    return null
  }

  return (
    <div className="h-screen flex bg-white">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-64">
          <Sidebar />
        </SheetContent>
      </Sheet>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center gap-3 p-4 border-b border-slate-200">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <h1 className="font-semibold text-slate-800">Proton AI</h1>
          </div>
        </div>

        {/* Chat Messages */}
        <Card className="flex-1 flex flex-col m-4 border-0 shadow-lg">
          <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-slate-800">Start a new conversation</h2>
                  <p className="text-slate-600 mt-2 max-w-md">
                    Ask me anything and I'll help you with information, analysis, creative tasks, and more.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="w-8 h-8 border-2 border-blue-200">
                        <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                          <Bot className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-slate-100 text-slate-800"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                    {message.role === "user" && (
                      <Avatar className="w-8 h-8 border-2 border-slate-200">
                        <AvatarFallback className="bg-slate-200 text-slate-600 text-xs">
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="w-8 h-8 border-2 border-blue-200">
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-slate-100 rounded-2xl px-4 py-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="border-t border-slate-200 p-4">
            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask Proton AI anything..."
                className="flex-1 border-slate-300 focus:border-blue-500"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4"
              >
                <Send className="w-4 h-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  )
}
