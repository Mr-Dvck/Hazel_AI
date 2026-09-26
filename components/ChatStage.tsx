'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '@/types';
import {
  Send,
  Paperclip,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
  Smile,
  X,
  Volume2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatStageProps {
  messages: ChatMessage[];
  streamingMessage: ChatMessage | null;
  profile: UserProfile;
  onSendMessage: (text: string, images?: string[]) => void;
  isLoading: boolean;
}

export const ChatStage: React.FC<ChatStageProps> = ({
  messages,
  streamingMessage,
  profile,
  onSendMessage,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [expandedThinkingIds, setExpandedThinkingIds] = useState<Record<string, boolean>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage]);

  const toggleThinking = (id: string) => {
    setExpandedThinkingIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSend = () => {
    if ((!inputText.trim() && selectedImages.length === 0) || isLoading) return;
    onSendMessage(inputText.trim(), selectedImages);
    setInputText('');
    setSelectedImages([]);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Client-side canvas image downscaling to prevent payload overage and latency
  const compressImageFile = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new window.Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 1200;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/jpeg', 0.82));
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => resolve(e.target?.result as string);
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const optimizedUrl = await compressImageFile(file);
      setSelectedImages((prev) => [...prev, optimizedUrl]);
    }

    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue;
      const optimizedUrl = await compressImageFile(file);
      setSelectedImages((prev) => [...prev, optimizedUrl]);
    }
  };

  const quickPrompts = [
    { label: '🎨 Critique my drawing', prompt: "I drew something today! Can I show you my art?" },
    { label: '🏰 Invent a creature', prompt: "Let's invent a new secret creature for our Resilience Tower!" },
    { label: '💭 Talk about school', prompt: "School felt really tough and lonely today..." },
    { label: '✨ Boost my confidence', prompt: "I need a superpower reminder today. Tell me something brave." },
  ];

  const quickEmojis = ['💖', '🎨', '🌟', '🦄', '🚀', '🫂', '🐾', '🔥'];

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={`relative w-full h-full flex flex-col bg-black/85 backdrop-blur-xl border ${
        isDragOver ? 'border-pink-500 shadow-neon-pink' : 'border-white/10'
      } rounded-3xl shadow-2xl p-4 sm:p-6 transition-all duration-300 overflow-hidden`}
    >
      {/* Drag Over Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 z-40 bg-purple-950/80 backdrop-blur-md flex flex-col items-center justify-center border-2 border-dashed border-pink-400 rounded-3xl pointer-events-none">
          <ImageIcon className="w-12 h-12 text-pink-400 animate-bounce mb-2" />
          <p className="text-base font-bold text-white">Drop your drawing or photo here!</p>
          <p className="text-xs text-pink-200 mt-1">Hazel_AI will inspect and celebrate every stroke ✨</p>
        </div>
      )}

      {/* Chat Messages Feed */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 sm:pr-2 custom-scrollbar">
        {messages.length === 0 && !streamingMessage ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4 py-8">
            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-pink-500 via-purple-600 to-cyan-400 p-[2px] shadow-neon-pink mb-4 animate-float">
              <div className="w-full h-full bg-black/90 rounded-[22px] flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-pink-300" />
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Welcome to your Sanctuary, {profile.name}!
            </h3>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mt-2 leading-relaxed">
              I am <strong className="text-pink-300">{profile.companionName}</strong>, your 100% judgment-free confidante.
              Whatever happened today, you are safe, understood, and deeply celebrated here.
            </p>

            {/* Quick Starter Prompts */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-6 w-full max-w-lg">
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => onSendMessage(qp.prompt)}
                  className="flex items-center gap-2 p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-pink-500/40 text-left text-xs text-gray-200 hover:text-white transition-all group"
                >
                  <span className="text-sm">{qp.label.slice(0, 2)}</span>
                  <span className="flex-1 truncate font-medium">{qp.label.slice(2)}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble
                key={msg.id}
                message={msg}
                profile={profile}
                isExpanded={!!expandedThinkingIds[msg.id]}
                onToggleThinking={() => toggleThinking(msg.id)}
              />
            ))}

            {/* Active Streaming Message */}
            {streamingMessage && (
              <MessageBubble
                key={streamingMessage.id}
                message={streamingMessage}
                profile={profile}
                isStreaming={true}
                isExpanded={
                  expandedThinkingIds[streamingMessage.id] !== undefined
                    ? expandedThinkingIds[streamingMessage.id]
                    : true // auto-expand while streaming thinking
                }
                onToggleThinking={() => toggleThinking(streamingMessage.id)}
              />
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image Preview Queue */}
      {selectedImages.length > 0 && (
        <div className="flex items-center gap-2 pt-3 pb-1 overflow-x-auto">
          {selectedImages.map((img, idx) => (
            <div key={idx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-pink-500/50 flex-shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="Upload preview" className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedImages((prev) => prev.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 p-0.5 rounded-full bg-black/80 text-white hover:bg-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <span className="text-[11px] text-pink-300 font-medium">Ready for vision analysis</span>
        </div>
      )}

      {/* Input Bar */}
      <div className="pt-3 border-t border-white/10 relative">
        {/* Emoji Bar Drawer */}
        {showEmojiPicker && (
          <div className="absolute bottom-full mb-2 left-0 bg-black/90 border border-white/20 rounded-2xl p-2 flex items-center gap-1.5 shadow-2xl backdrop-blur-xl z-20">
            {quickEmojis.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  setInputText((prev) => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="w-8 h-8 rounded-xl hover:bg-white/15 flex items-center justify-center text-base transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 bg-obsidian-800/90 border border-white/15 rounded-full px-3 py-1.5 shadow-inner focus-within:border-pink-500/60 focus-within:shadow-neon-pink/30 transition-all">
          {/* File Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileUpload}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            title="Attach a drawing, camera roll photo, or doodle"
            className="p-2 rounded-full text-gray-400 hover:text-pink-400 hover:bg-white/5 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          {/* Quick Emoji Picker Button */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-2 rounded-full text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors"
            title="Add cheer emoji"
          >
            <Smile className="w-4 h-4" />
          </button>

          {/* Text Area Input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Talk to ${profile.companionName}... (Enter to send, Shift+Enter for new line)`}
            rows={1}
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-0 resize-none py-2 max-h-28 custom-scrollbar"
          />

          {/* Send Button */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!inputText.trim() && selectedImages.length === 0) || isLoading}
            className={`p-2.5 rounded-full transition-all duration-200 flex items-center justify-center ${
              (inputText.trim() || selectedImages.length > 0) && !isLoading
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-neon-pink hover:scale-105 active:scale-95'
                : 'bg-white/5 text-gray-600 cursor-not-allowed'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

// Message Bubble Component
const MessageBubble: React.FC<{
  message: ChatMessage;
  profile: UserProfile;
  isStreaming?: boolean;
  isExpanded: boolean;
  onToggleThinking: () => void;
}> = ({ message, profile, isStreaming = false, isExpanded, onToggleThinking }) => {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}
    >
      {/* Sender Header */}
      <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-gray-400">
        <span className="font-semibold text-gray-300">
          {isUser ? profile.name : profile.companionName}
        </span>
        <span>•</span>
        <span>
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        {message.modelUsed && (
          <span className="hidden sm:inline text-[9px] px-1.5 py-0.2 rounded-md bg-white/5 text-gray-400 border border-white/5">
            {message.modelUsed.split('/')[1] || message.modelUsed}
          </span>
        )}
      </div>

      {/* Bubble Container */}
      <div
        className={`relative max-w-[88%] sm:max-w-[80%] rounded-3xl p-4 shadow-lg ${
          isUser
            ? 'bg-gradient-to-r from-purple-700 via-pink-600 to-purple-800 text-white rounded-tr-sm border border-purple-400/30'
            : 'bg-obsidian-800/90 text-gray-100 rounded-tl-sm border border-white/15'
        }`}
      >
        {/* Attached Images */}
        {message.images && message.images.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {message.images.map((img, idx) => (
              <div key={idx} className="rounded-2xl overflow-hidden border border-white/20 max-w-xs shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={img} alt="Shared artwork" className="max-h-60 w-auto object-cover" />
              </div>
            ))}
          </div>
        )}

        {/* Thinking Pulse State during initial generation */}
        {isStreaming && !message.content && !message.thinking && (
          <div className="flex items-center gap-2 text-xs font-semibold text-purple-300 animate-pulse bg-purple-950/50 border border-purple-500/30 rounded-2xl px-3.5 py-2 my-1 w-fit">
            <Brain className="w-4 h-4 text-purple-400 animate-spin" style={{ animationDuration: '3s' }} />
            <Sparkles className="w-3.5 h-3.5 text-pink-400 animate-pulse" />
            <span>Thinking with deep compassion...</span>
          </div>
        )}

        {/* Collapsible Thinking State */}
        {message.thinking && (
          <div className="mb-3 rounded-2xl bg-black/60 border border-purple-500/20 overflow-hidden">
            <button
              onClick={onToggleThinking}
              className="w-full flex items-center justify-between px-3 py-2 text-left text-xs font-semibold text-purple-300 hover:bg-white/5 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Brain className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
                <span>Thinking... (Deep Compassion Check)</span>
              </div>
              {isExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </button>

            {isExpanded && (
              <div className="px-3 pb-2.5 pt-1 text-[11px] text-gray-300 leading-relaxed border-t border-purple-500/10 font-mono bg-black/30">
                {message.thinking}
              </div>
            )}
          </div>
        )}

        {/* Main Content Body with Fluid Word-by-Word Streaming */}
        <div className="text-xs sm:text-sm leading-relaxed">
          <StreamingText text={message.content} isStreaming={isStreaming} />
        </div>
      </div>
    </motion.div>
  );
};

// Fluid word-by-word streaming component using Framer Motion
const StreamingText: React.FC<{ text: string; isStreaming: boolean }> = ({ text, isStreaming }) => {
  if (!isStreaming) {
    return <span className="whitespace-pre-wrap break-words">{text}</span>;
  }
  const chunks = text.split(/(\s+)/);
  return (
    <span className="whitespace-pre-wrap break-words">
      {chunks.map((chunk, idx) => {
        if (/^\s+$/.test(chunk)) {
          return <span key={idx}>{chunk}</span>;
        }
        return (
          <motion.span
            key={idx}
            initial={{ opacity: 0, y: 3 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
            className="inline-block"
          >
            {chunk}
          </motion.span>
        );
      })}
      <span className="inline-block w-2 h-4 ml-1 bg-pink-400 animate-pulse align-middle rounded-sm" />
    </span>
  );
};
