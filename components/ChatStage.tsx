'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, UserProfile } from '@/types';
import {
  Send,
  Paperclip,
  Camera,
  Image as ImageIcon,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
  Smile,
  X,
  Volume2,
  Heart,
  Mail,
  Check,
  Laptop,
  Palette,
  Download,
  Maximize2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatStageProps {
  messages: ChatMessage[];
  streamingMessage: ChatMessage | null;
  profile: UserProfile;
  onSendMessage: (text: string, images?: string[]) => void;
  onDispatchBridgeNote?: (text: string) => Promise<boolean | void>;
  isLoading: boolean;
}

export const ChatStage: React.FC<ChatStageProps> = ({
  messages,
  streamingMessage,
  profile,
  onSendMessage,
  onDispatchBridgeNote,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [expandedThinkingIds, setExpandedThinkingIds] = useState<Record<string, boolean>>({});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedMap, setDispatchedMap] = useState<Record<string, boolean>>({});

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

  const handleDispatchDeskNote = async (text: string, messageId?: string) => {
    if (!text.trim() || isDispatching) return;
    setIsDispatching(true);
    try {
      if (onDispatchBridgeNote) {
        await onDispatchBridgeNote(text.trim());
      } else {
        await fetch('/api/bridge/dispatch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: text.trim(),
            senderName: profile.name || 'Hazel',
            mood: 'open',
          }),
        });
      }
      if (messageId) {
        setDispatchedMap((prev) => ({ ...prev, [messageId]: true }));
      }
    } catch (err) {
      console.error('Failed to dispatch desk note:', err);
    } finally {
      setIsDispatching(false);
    }
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
              I am <strong className="text-pink-300">{profile.companionName || 'your companion'}</strong>, your 100% judgment-free confidante.
              Whatever happened today, you are safe, understood, and deeply celebrated here.
            </p>

            <div className="flex items-center gap-2 mt-5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              <span>Type anything below or upload your artwork to begin!</span>
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
                onDispatchNote={handleDispatchDeskNote}
                isDispatched={!!dispatchedMap[msg.id]}
                isDispatching={isDispatching}
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

      {/* Glowing Neon Input Bar with Safe Area Inset Padding */}
      <div className="pt-2 sm:pt-3 border-t border-white/10 relative pb-[env(safe-area-inset-bottom)]">
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
                className="w-10 h-10 rounded-xl hover:bg-white/15 flex items-center justify-center text-lg transition-transform hover:scale-125"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}

        <div className={`flex items-center gap-1.5 sm:gap-2 bg-obsidian-900/90 border rounded-full px-2 sm:px-3 py-1 sm:py-1.5 shadow-inner transition-all ${
          profile.vibeTheme === 'electric-blue' || profile.vibeTheme === 'cyber-blue'
            ? 'border-cyan-400/80 shadow-[0_0_24px_rgba(0,240,255,0.45),0_0_48px_rgba(0,240,255,0.2)] focus-within:border-cyan-300 focus-within:shadow-[0_0_36px_rgba(0,240,255,0.8),0_0_65px_rgba(0,240,255,0.35)]'
            : profile.vibeTheme === 'neon-yellow' || profile.vibeTheme === 'cosmic-emerald'
            ? 'border-yellow-400/80 shadow-[0_0_24px_rgba(255,230,0,0.45),0_0_48px_rgba(255,230,0,0.2)] focus-within:border-yellow-300 focus-within:shadow-[0_0_36px_rgba(255,230,0,0.8),0_0_65px_rgba(255,230,0,0.35)]'
            : profile.vibeTheme === 'neon-red' || profile.vibeTheme === 'sunset-violet'
            ? 'border-red-600/85 shadow-[0_0_24px_rgba(255,0,51,0.5),0_0_48px_rgba(220,38,38,0.25)] focus-within:border-red-400 focus-within:shadow-[0_0_36px_rgba(255,0,51,0.85),0_0_65px_rgba(220,38,38,0.4)]'
            : 'border-pink-500/85 shadow-[0_0_24px_rgba(255,42,157,0.5),0_0_48px_rgba(255,20,147,0.25)] focus-within:border-pink-400 focus-within:shadow-[0_0_36px_rgba(255,42,157,0.85),0_0_65px_rgba(255,20,147,0.4)]'
        }`}>
          {/* Prominent Camera / Picture & Artwork Upload Button (Touch-Friendly 44px) */}
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
            title="Attach a drawing, painting, or photo"
            aria-label="Upload photo or artwork"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 active:bg-pink-500/30 text-white border border-white/20 hover:border-pink-400/60 transition-all hover:scale-105 active:scale-95 shadow-sm min-h-[44px] min-w-[44px]"
          >
            <Camera className="w-5 h-5 text-pink-400 flex-shrink-0" />
            <span className="hidden sm:inline font-medium">Add Picture</span>
          </button>

          {/* Dedicated Imagine / Draw Button (Touch-Friendly 44px) */}
          <button
            type="button"
            onClick={() => {
              const trimmed = inputText.trim();
              if (trimmed) {
                let promptToSend = trimmed;
                if (!/^(draw|paint|sketch|illustrate|render|imagine|generate|create|make)\b/i.test(trimmed)) {
                  if (/^(a|an|the)\b/i.test(trimmed)) {
                    promptToSend = `Draw ${trimmed}`;
                  } else {
                    promptToSend = `Draw a ${trimmed}`;
                  }
                }
                onSendMessage(promptToSend, selectedImages);
                setInputText('');
                setSelectedImages([]);
              } else {
                setInputText('Draw a ');
                const el = document.querySelector('textarea');
                if (el) el.focus();
              }
            }}
            title="Ask companion to draw or imagine an artwork"
            aria-label="Imagine or Draw artwork"
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/35 hover:to-purple-500/35 active:scale-95 text-pink-200 border border-pink-400/40 hover:border-pink-400 transition-all hover:scale-105 shadow-sm min-h-[44px] min-w-[44px]"
          >
            <Palette className="w-5 h-5 text-pink-400 flex-shrink-0" />
            <span className="hidden sm:inline font-medium">🎨 Imagine / Draw</span>
          </button>

          {/* Quick Emoji Picker Button (Touch-Friendly 44px) */}
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="min-h-[44px] min-w-[44px] p-2 rounded-full text-gray-400 hover:text-amber-400 hover:bg-white/5 transition-colors flex items-center justify-center"
            title="Add cheer emoji"
            aria-label="Add emoji"
          >
            <Smile className="w-5 h-5" />
          </button>

          {/* Text Area Input */}
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Talk to ${profile.companionName || 'your companion'}...`}
            rows={1}
            className="flex-1 bg-transparent border-0 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-0 resize-none py-2 max-h-28 custom-scrollbar"
          />

          {/* Send Button (Touch-Friendly 44px) */}
          <button
            type="button"
            onClick={handleSend}
            disabled={(!inputText.trim() && selectedImages.length === 0) || isLoading}
            aria-label="Send message"
            className={`min-h-[44px] min-w-[44px] p-2.5 rounded-full transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
              (inputText.trim() || selectedImages.length > 0) && !isLoading
                ? profile.vibeTheme === 'neon-red' || profile.vibeTheme === 'sunset-violet'
                  ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-neon-red hover:scale-105 active:scale-95'
                  : profile.vibeTheme === 'electric-blue' || profile.vibeTheme === 'cyber-blue'
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-neon-cyan hover:scale-105 active:scale-95'
                  : profile.vibeTheme === 'neon-yellow' || profile.vibeTheme === 'cosmic-emerald'
                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold shadow-neon-yellow hover:scale-105 active:scale-95'
                  : 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-neon-pink hover:scale-105 active:scale-95'
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
  onDispatchNote?: (text: string, messageId?: string) => void;
  isDispatched?: boolean;
  isDispatching?: boolean;
}> = ({
  message,
  profile,
  isStreaming = false,
  isExpanded,
  onToggleThinking,
  onDispatchNote,
  isDispatched,
  isDispatching,
}) => {
  // 1. Warm Glowing Note Card from Tim or Mom
  if (message.bridgeReply) {
    const reply = message.bridgeReply;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="w-full my-3"
      >
        <div className="relative overflow-hidden rounded-3xl p-5 sm:p-6 bg-gradient-to-br from-amber-950/80 via-purple-950/80 to-black/95 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(251,191,36,0.35)]">
          <div className="flex items-center justify-between mb-3 border-b border-amber-400/20 pb-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-2xl bg-amber-500/25 border border-amber-400/50 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.4)]">
                <Heart className="w-5 h-5 text-amber-300 fill-amber-300 animate-pulse" />
              </div>
              <div>
                <div className="text-xs sm:text-sm font-extrabold text-amber-300 tracking-wide uppercase flex items-center gap-2">
                  <span>Special Note from {reply.sender || 'Tim & Mom'}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40">
                    Direct Note
                  </span>
                </div>
                <p className="text-[11px] text-amber-200/70">
                  {new Date(reply.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Direct Reassurance
                </p>
              </div>
            </div>
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          </div>

          <p className="text-base sm:text-lg font-semibold text-white leading-relaxed italic px-1 py-1">
            "{reply.message || reply.content || message.content}"
          </p>

          <div className="mt-3 pt-2.5 border-t border-amber-400/15 flex items-center justify-between text-xs text-amber-300/90 font-medium">
            <span>💖 Always right here in your corner</span>
            <span className="text-[11px] font-mono text-amber-300/60">Delivered straight to your screen</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // 2. Dispatched Note confirmation card
  if (message.bridgeNote) {
    const note = message.bridgeNote;
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-end w-full my-2"
      >
        <div className="rounded-2xl px-4 py-3 bg-gradient-to-r from-purple-900/90 to-pink-800/90 border border-pink-400/50 text-white text-xs max-w-[85%] shadow-neon-pink/20">
          <div className="flex items-center gap-1.5 text-[10px] text-pink-200 font-bold uppercase tracking-wider mb-1">
            <Mail className="w-3.5 h-3.5 text-pink-300" />
            <span>Dispatched to Tim's Computer Desk</span>
            <span>•</span>
            <span>{new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className="italic text-white font-medium">"{note.text}"</p>
        </div>
      </motion.div>
    );
  }

  const isUser = message.role === 'user';
  const [customNoteText, setCustomNoteText] = useState('');
  const hasBridgeOffer =
    !isUser &&
    !isStreaming &&
    (message.content.includes("I can send a message right to Tim's computer") ||
      message.content.includes("send a message right to Tim's computer") ||
      message.content.includes("send a note to Tim or Mom") ||
      message.content.includes("share something with them, I can send it right away") ||
      message.isBridgeOffer);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} w-full`}
    >
      {/* Sender Header */}
      <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-gray-400">
        <span className="font-semibold text-gray-300 flex items-center gap-1">
          <span>{isUser ? profile.avatarEmoji || '🦄' : profile.companionAvatar || '✨'}</span>
          <span>{isUser ? profile.name : profile.companionName}</span>
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

        {/* Main Content Body with Fluid Word-by-Word Streaming and Rich Artwork */}
        <div className="text-xs sm:text-sm leading-relaxed">
          {message.content.includes('![') ? (
            parseContentWithImages(message.content).map((part, pIdx) =>
              part.type === 'image' ? (
                <ArtworkCard
                  key={pIdx}
                  alt={part.alt || 'Sanctuary Masterpiece'}
                  url={part.url || ''}
                  theme={profile.vibeTheme}
                />
              ) : (
                <StreamingText key={pIdx} text={part.text || ''} isStreaming={isStreaming} />
              )
            )
          ) : (
            <StreamingText text={message.content} isStreaming={isStreaming} />
          )}
        </div>

        {/* Custom Bridge Note Dispatch Card */}
        {hasBridgeOffer && (
          <div className="mt-4 pt-3 border-t border-purple-500/20">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-black/80 border border-pink-400/40 shadow-neon-pink/20">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-pink-300">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                <span>Send a Note Directly to Tim's Computer Desk</span>
              </div>
              <p className="text-[11px] text-gray-300 mb-2.5">
                Type whatever you want to share—it will appear right on his screen in real time:
              </p>

              {isDispatched ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dispatched straight to Tim's computer! He received your note on his desk. ✨</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customNoteText}
                    onChange={(e) => setCustomNoteText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && customNoteText.trim() && !isDispatching) {
                        e.preventDefault();
                        if (onDispatchNote) {
                          onDispatchNote(customNoteText.trim(), message.id);
                          setCustomNoteText('');
                        }
                      }
                    }}
                    placeholder="Type your personal note to Tim & Mom..."
                    className="flex-1 px-3 py-2 rounded-xl bg-black/60 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 shadow-inner"
                    disabled={isDispatching}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (customNoteText.trim() && onDispatchNote && !isDispatching) {
                        onDispatchNote(customNoteText.trim(), message.id);
                        setCustomNoteText('');
                      }
                    }}
                    disabled={!customNoteText.trim() || isDispatching}
                    className="px-3.5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 disabled:opacity-40 text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-md flex-shrink-0"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
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

interface ContentPart {
  type: 'text' | 'image';
  text?: string;
  alt?: string;
  url?: string;
}

function parseContentWithImages(content: string): ContentPart[] {
  const parts: ContentPart[] = [];
  const regex = /!\[([^\]]*)\]\((https?:\/\/[^)\n\r]+|data:image\/[^)\n\r]+)\)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push({ type: 'text', text: content.substring(lastIndex, match.index) });
    }
    const rawUrl = match[2].trim();
    const safeUrl = rawUrl.startsWith('data:') ? rawUrl : (rawUrl.includes(' ') ? encodeURI(rawUrl) : rawUrl);
    parts.push({ type: 'image', alt: match[1], url: safeUrl });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < content.length) {
    parts.push({ type: 'text', text: content.substring(lastIndex) });
  }

  return parts;
}

interface ArtworkCardProps {
  alt: string;
  url: string;
  theme?: string;
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({ alt, url, theme }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const getBorderColor = () => {
    if (theme === 'electric-blue' || theme === 'cyber-blue')
      return 'border-cyan-400/90 shadow-[0_0_28px_rgba(0,240,255,0.55),0_0_50px_rgba(0,240,255,0.25)]';
    if (theme === 'neon-yellow' || theme === 'cosmic-emerald')
      return 'border-yellow-400/90 shadow-[0_0_28px_rgba(255,230,0,0.55),0_0_50px_rgba(255,230,0,0.25)]';
    if (theme === 'neon-red' || theme === 'sunset-violet')
      return 'border-red-600/95 shadow-[0_0_28px_rgba(255,0,51,0.6),0_0_50px_rgba(220,38,38,0.3)]';
    return 'border-pink-500/95 shadow-[0_0_28px_rgba(255,42,157,0.6),0_0_50px_rgba(255,20,147,0.3)]';
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDownloading(true);
    try {
      if (url.startsWith('data:')) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `hazel-art-${Date.now()}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setIsDownloading(false);
        return;
      }
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = `hazel-art-${Date.now()}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      window.open(url, '_blank');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <>
      <div className={`relative group my-3 rounded-2xl sm:rounded-3xl overflow-hidden border-2 bg-black/90 transition-all ${getBorderColor()}`}>
        {/* Loading Skeleton */}
        {!loaded && !error && (
          <div className="w-full h-64 sm:h-80 bg-gradient-to-r from-purple-950/40 via-pink-950/40 to-purple-950/40 animate-pulse flex flex-col items-center justify-center gap-3 p-4">
            <Palette className="w-8 h-8 text-pink-400 animate-bounce" />
            <div className="flex items-center gap-2 text-xs font-semibold text-pink-300">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
              <span>Conjuring original art with Flux...</span>
            </div>
            <p className="text-[11px] text-gray-400 max-w-xs text-center truncate italic">
              "{alt || 'Sanctuary Masterpiece'}"
            </p>
          </div>
        )}

        {/* Error Fallback */}
        {error && (
          <div className="w-full p-6 text-center text-xs text-red-400 bg-red-950/20">
            Failed to render artwork preview.{' '}
            <a href={url} target="_blank" rel="noreferrer" className="underline text-pink-300">
              Open direct image link
            </a>
          </div>
        )}

        {/* Main Artwork Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt={alt || 'Sanctuary Masterpiece'}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          onClick={() => setIsLightboxOpen(true)}
          className={`w-full max-h-[500px] object-contain cursor-zoom-in transition-all duration-500 hover:scale-[1.01] ${
            loaded ? 'opacity-100 block' : 'opacity-0 hidden'
          }`}
        />

        {/* Hover / Persistent Action Bar */}
        {loaded && (
          <div className="bg-gradient-to-t from-black/95 via-black/60 to-transparent p-3 flex items-center justify-between">
            <span className="text-[11px] text-pink-200 font-medium truncate max-w-[60%] flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5 text-pink-400 flex-shrink-0" />
              <span className="truncate">{alt || 'Artwork'}</span>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownload}
                disabled={isDownloading}
                className="px-2.5 py-1 rounded-xl bg-pink-500/80 hover:bg-pink-500 text-white text-[11px] font-semibold flex items-center gap-1 shadow-md hover:scale-105 active:scale-95 transition-all"
                title="Download artwork"
              >
                <Download className="w-3 h-3" />
                <span>{isDownloading ? 'Saving...' : 'Download Art'}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-[11px] hover:scale-105 transition-all"
                title="Fullscreen lightbox"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {isLightboxOpen && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center cursor-default"
          >
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="absolute -top-10 right-0 p-1.5 rounded-full bg-white/20 text-white hover:bg-red-500 transition-colors"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={alt}
              className="max-h-[80vh] w-auto rounded-2xl border-2 border-pink-400/60 shadow-[0_0_50px_rgba(255,46,147,0.5)] object-contain"
            />
            <div className="mt-3 flex items-center justify-between w-full px-2">
              <p className="text-xs text-pink-200 font-medium truncate max-w-md">{alt || 'Sanctuary Masterpiece'}</p>
              <button
                type="button"
                onClick={handleDownload}
                className="px-4 py-1.5 rounded-xl bg-pink-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-neon-pink hover:scale-105 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

