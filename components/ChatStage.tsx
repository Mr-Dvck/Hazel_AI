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
  Heart,
  Mail,
  Check,
  Laptop,
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
  const [showDeskNoteModal, setShowDeskNoteModal] = useState(false);
  const [deskNoteInput, setDeskNoteInput] = useState('');
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
      setShowDeskNoteModal(false);
      setDeskNoteInput('');
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
              I am <strong className="text-pink-300">{profile.companionName}</strong>, your 100% judgment-free confidante.
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

        <div className={`flex items-center gap-2 bg-obsidian-900/90 border rounded-full px-3 py-1.5 shadow-inner transition-all ${
          profile.vibeTheme === 'cyber-blue'
            ? 'border-cyan-400/60 shadow-[0_0_20px_rgba(0,240,255,0.35)] focus-within:border-cyan-300 focus-within:shadow-[0_0_30px_rgba(0,240,255,0.6)]'
            : profile.vibeTheme === 'cosmic-emerald'
            ? 'border-emerald-400/60 shadow-[0_0_20px_rgba(16,185,129,0.35)] focus-within:border-emerald-300 focus-within:shadow-[0_0_30px_rgba(16,185,129,0.6)]'
            : profile.vibeTheme === 'sunset-violet'
            ? 'border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.35)] focus-within:border-purple-300 focus-within:shadow-[0_0_30px_rgba(168,85,247,0.6)]'
            : 'border-pink-500/60 shadow-[0_0_20px_rgba(255,46,147,0.35)] focus-within:border-pink-400 focus-within:shadow-[0_0_30px_rgba(255,46,147,0.6)]'
        }`}>
          {/* Prominent Picture & Artwork Upload Button */}
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-pink-400/60 transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            <ImageIcon className="w-4 h-4 text-pink-400" />
            <span className="hidden sm:inline font-medium">Add Picture</span>
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

      {/* Quick Desk Note Dispatch Modal */}
      <AnimatePresence>
        {showDeskNoteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-obsidian-900 border border-pink-500/40 rounded-3xl p-6 shadow-neon-pink relative overflow-hidden"
            >
              <button
                onClick={() => setShowDeskNoteModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 rounded-xl bg-pink-500/20 text-pink-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>Send Note to Tim's Computer</span>
                    <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                  </h3>
                  <p className="text-xs text-pink-200/70">
                    Dispatched straight to Tim & Mom's Guardian Desk inbox
                  </p>
                </div>
              </div>

              {/* Quick Presets */}
              <div className="space-y-1.5 mb-3">
                <button
                  onClick={() => handleDispatchDeskNote("Hey Dad, having a hard day and could use a hug later.")}
                  disabled={isDispatching}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 text-xs text-gray-200 transition-colors"
                >
                  💙 "Hey Dad, having a hard day and could use a hug later."
                </button>
                <button
                  onClick={() => handleDispatchDeskNote("Hey Dad & Mom, thinking of you guys! Love you so much.")}
                  disabled={isDispatching}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 text-xs text-gray-200 transition-colors"
                >
                  🌸 "Hey Dad & Mom, thinking of you guys! Love you so much."
                </button>
                <button
                  onClick={() => handleDispatchDeskNote("Hey Dad, made something really cool in my sanctuary today!")}
                  disabled={isDispatching}
                  className="w-full text-left p-2.5 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-500/40 text-xs text-gray-200 transition-colors"
                >
                  🎨 "Hey Dad, made something really cool in my sanctuary today!"
                </button>
              </div>

              {/* Custom Note Input */}
              <div className="mt-3">
                <textarea
                  value={deskNoteInput}
                  onChange={(e) => setDeskNoteInput(e.target.value)}
                  placeholder="Or write your own note to Tim's desk..."
                  rows={3}
                  className="w-full p-3 rounded-2xl bg-black/60 border border-white/15 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-pink-500/70 resize-none"
                />
                <button
                  onClick={() => handleDispatchDeskNote(deskNoteInput)}
                  disabled={!deskNoteInput.trim() || isDispatching}
                  className="mt-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-xs uppercase tracking-wider disabled:opacity-50 hover:opacity-95 shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isDispatching ? 'Sending to Desk...' : "Send Straight to Tim's Desk"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
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
                  <span>Warm Note from {reply.sender}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/40">
                    Guardian Desk
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
            "{reply.message}"
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
  const hasBridgeOffer =
    !isUser &&
    !isStreaming &&
    (message.content.includes("I can send a message right to Tim's computer") ||
      message.content.includes("send a message right to Tim's computer") ||
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

        {/* Main Content Body with Fluid Word-by-Word Streaming */}
        <div className="text-xs sm:text-sm leading-relaxed">
          <StreamingText text={message.content} isStreaming={isStreaming} />
        </div>

        {/* One-Tap Bridge Offer Card */}
        {hasBridgeOffer && (
          <div className="mt-4 pt-3 border-t border-purple-500/20">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/60 via-pink-900/40 to-black/80 border border-pink-400/40 shadow-neon-pink/20">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-pink-300">
                <Heart className="w-4 h-4 text-pink-400 fill-pink-400 animate-pulse" />
                <span>One-Tap Note Dispatch to Tim's Desk</span>
              </div>
              <p className="text-[11px] text-gray-300 mb-3">
                Tap below to send a message straight to Tim's computer screen:
              </p>

              {isDispatched ? (
                <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Dispatched straight to Tim's computer! He received your note on his desk. ✨</span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <button
                    onClick={() =>
                      onDispatchNote &&
                      onDispatchNote(
                        "Hey Dad, having a hard time today. Could really use some quiet hugs later.",
                        message.id
                      )
                    }
                    disabled={isDispatching}
                    className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-400/50 text-xs text-pink-100 transition-all flex items-center justify-between group"
                  >
                    <span>💙 "Hey Dad, having a hard time today. Could use a hug later."</span>
                    <Send className="w-3 h-3 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() =>
                      onDispatchNote &&
                      onDispatchNote(
                        "Hey Dad & Mom, thinking of you guys and wanted to say hi!",
                        message.id
                      )
                    }
                    disabled={isDispatching}
                    className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-400/50 text-xs text-pink-100 transition-all flex items-center justify-between group"
                  >
                    <span>🌸 "Hey Dad & Mom, thinking of you guys and wanted to say hi!"</span>
                    <Send className="w-3 h-3 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                  <button
                    onClick={() =>
                      onDispatchNote &&
                      onDispatchNote(
                        "Hey Dad, I made something really cool in my sanctuary today!",
                        message.id
                      )
                    }
                    disabled={isDispatching}
                    className="w-full text-left p-2 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-400/50 text-xs text-pink-100 transition-all flex items-center justify-between group"
                  >
                    <span>🎨 "Hey Dad, I made something cool in my sanctuary today!"</span>
                    <Send className="w-3 h-3 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
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
