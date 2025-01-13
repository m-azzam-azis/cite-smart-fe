"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { IconRobot, IconUser } from "@tabler/icons-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProjects } from "@/contexts/ProjectContext";
import ReactMarkdown from "react-markdown";
import { gqlRequest } from "@/utils/graphql";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  isLoading?: boolean;
}

const sendMessage = async (
  userId: string,
  prompt: string,
  projectId?: string
): Promise<string> => {
  const data = await gqlRequest<{ citationChatbot: string }>(
    `
      query CitationChatbot($userId: String!, $prompt: String!, $projectId: String) {
        citationChatbot(userId: $userId, prompt: $prompt, projectId: $projectId)
      }
    `,
    { userId, prompt, projectId }
  );
  return data?.citationChatbot || "";
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Hello! How can I help you find citations today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { projects } = useProjects();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !user) return;

    const userMessage: Message = {
      id: messages.length + 1,
      content: input,
      sender: "user",
      timestamp: new Date(),
    };

    const loadingMessage: Message = {
      id: messages.length + 2,
      content: "...",
      sender: "bot",
      timestamp: new Date(),
      isLoading: true,
    };

    setMessages((prev) => [...prev, userMessage, loadingMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await sendMessage(
        user.id,
        input,
        selectedProject || undefined
      );

      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove loading message
        {
          id: messages.length + 2,
          content: response,
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove loading message
        {
          id: messages.length + 2,
          content: "Sorry, I encountered an error. Please try again.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleProjectChange = (value: string) => {
    // If value is "none", clear the selection
    setSelectedProject(value === "none" ? null : value);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] p-4">
      <Card className="flex-1 flex flex-col max-w-4xl mx-auto">
        <div className="p-4 border-b">
          <Select
            onValueChange={handleProjectChange}
            value={selectedProject || "none"}
          >
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Select a project for context (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No project selected</SelectItem>
              {projects?.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <ScrollArea className="flex-1 p-4 h-full">
          <div className="space-y-4 min-h-full">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-2.5 break-words",
                  message.sender === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    message.sender === "user" ? "bg-primary" : "bg-muted"
                  )}
                >
                  {message.sender === "user" ? (
                    <IconUser className="w-5 h-5 text-white" />
                  ) : (
                    <IconRobot className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-3 overflow-hidden",
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-muted rounded-bl-none"
                  )}
                >
                  {message.isLoading ? (
                    <div className="flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce delay-100">.</span>
                      <span className="animate-bounce delay-200">.</span>
                    </div>
                  ) : (
                    <div className="text-sm break-words prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown
                        components={{
                          p: ({ children }) => (
                            <p className="mb-1 last:mb-0">{children}</p>
                          ),
                          a: ({ href, children }) => (
                            <a
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              {children}
                            </a>
                          ),
                          strong: ({ children }) => (
                            <strong className="font-semibold">
                              {children}
                            </strong>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc ml-4 space-y-2 my-4">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal ml-4 space-y-2 my-4 [counter-reset:_counter] marker:text-foreground/80">
                              {children}
                            </ol>
                          ),
                          li: ({ children, ordered }) => (
                            <li
                              className={`pl-2 ${
                                ordered ? "[counter-increment:_counter]" : ""
                              }`}
                            >
                              {children}
                            </li>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        <div className="p-4 border-t mt-auto">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              onKeyPress={(e) =>
                e.key === "Enter" && !e.shiftKey && handleSend()
              }
              disabled={isTyping}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={isTyping}>
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
