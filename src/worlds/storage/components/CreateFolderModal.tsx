"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  HackerText,
  WaveformVisualizer,
  RadarScan,
  LoadingDots,
  TerminalText,
} from "@/shared/components/tech";
import { FolderPlus, X } from "lucide-react";

interface CreateFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  folderName: string;
  onFolderNameChange: (name: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isCreating: boolean;
}

export const CreateFolderModal: React.FC<CreateFolderModalProps> = ({
  isOpen,
  onClose,
  folderName,
  onFolderNameChange,
  onSubmit,
  isCreating,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm"
            onClick={() => !isCreating && onClose()}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: -10,
              transition: { duration: 0.15 },
            }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2"
          >
            <div className="relative border border-[#00ff88]/40 bg-black/95 overflow-hidden shadow-[0_0_50px_rgba(0,255,136,0.2)]">
              {/* Glitch lines effect */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,136,0.02)_50%)] bg-[length:100%_4px]" />
              </div>

              {/* Corner accents with animation */}
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.1, duration: 0.2 }}
                className="absolute top-0 left-0 border-t-2 border-l-2 border-[#00ff88]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.15, duration: 0.2 }}
                className="absolute top-0 right-0 border-t-2 border-r-2 border-[#00ff88]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                className="absolute bottom-0 left-0 border-b-2 border-l-2 border-[#00ff88]"
              />
              <motion.div
                initial={{ width: 0, height: 0 }}
                animate={{ width: 24, height: 24 }}
                transition={{ delay: 0.25, duration: 0.2 }}
                className="absolute bottom-0 right-0 border-b-2 border-r-2 border-[#00ff88]"
              />

              {/* Close button */}
              <button
                onClick={() => !isCreating && onClose()}
                className="absolute right-4 top-4 z-20 p-1 text-[#00ff88]/60 hover:text-[#00ff88] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="border-b border-[#00ff88]/30 bg-[#00ff88]/5 px-6 py-5 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-[#00ff88]/10 to-transparent" />
                <div className="flex items-center gap-4 font-mono relative">
                  <div className="relative">
                    <div className="w-12 h-12 border-2 border-[#00ff88] flex items-center justify-center bg-[#00ff88]/10">
                      <FolderPlus className="w-6 h-6 text-[#00ff88]" />
                    </div>
                    <motion.div
                      animate={{ opacity: [1, 0.5, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff88]"
                    />
                  </div>
                  <div>
                    <HackerText
                      className="text-lg font-bold text-[#00ff88]"
                      color="#00ff88"
                      speed={50}
                      triggerOnHover={false}
                    >
                      NEW_FOLDER
                    </HackerText>
                    <p className="text-[10px] text-[#00ff88]/60 font-mono mt-1">
                      INITIALIZE_DIRECTORY
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Creating overlay */}
              <AnimatePresence>
                {isCreating && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-50 bg-black/90 flex flex-col items-center justify-center"
                  >
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"
                      />
                      <motion.div
                        animate={{ x: ["100%", "-100%"] }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00ff88] to-transparent"
                      />
                    </div>

                    <div className="relative mb-6">
                      <RadarScan size={100} color="#00ff88" speed={1.5} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <FolderPlus className="w-8 h-8 text-[#00ff88] animate-pulse" />
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <TerminalText color="#00ff88" prefix="$ " typingSpeed={50} showCursor>
                        {`mkdir ${folderName}`}
                      </TerminalText>
                      <div className="flex items-center gap-2 justify-center">
                        <LoadingDots color="#00ff88" size={6} />
                        <span className="text-[#00ff88]/80 font-mono text-xs">
                          CREATING_DIRECTORY...
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2 text-[10px] font-mono text-[#00ff88]/50">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00ff88] animate-pulse" />
                        <span>ALLOCATING_SPACE</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00ff88]/50 animate-pulse" />
                        <span>WRITING_METADATA</span>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 bg-[#00ff88]/30 animate-pulse" />
                        <span>SYNCING_TO_CLOUD</span>
                      </motion.div>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <span className="text-[8px] font-mono text-[#00ff88]/20">
                        01001101 01001011 01000100 01001001 01010010
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Form */}
              <form
                onSubmit={onSubmit}
                className={`p-6 relative ${isCreating ? "opacity-0" : ""}`}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="relative group"
                >
                  <div className="absolute -inset-px bg-gradient-to-r from-[#00ff88]/50 via-[#00ff88] to-[#00ff88]/50 opacity-50 group-focus-within:opacity-100 transition-opacity" />
                  <div className="relative bg-black">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#00ff88]/50 font-mono text-sm">
                      &gt;
                    </div>
                    <Input
                      type="text"
                      value={folderName}
                      onChange={(e) => onFolderNameChange(e.target.value)}
                      placeholder="ENTER_FOLDER_NAME"
                      disabled={isCreating}
                      className="rounded-none border-0 bg-transparent font-mono text-sm h-14 pl-8 text-[#00ff88] placeholder:text-[#00ff88]/30 focus-visible:ring-0"
                      autoFocus
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center justify-between mt-5 px-1"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        folderName.length > 0
                          ? "bg-[#00ff88] animate-pulse"
                          : "bg-[#00ff88]/30"
                      }`}
                    />
                    <span className="text-[10px] font-mono text-[#00ff88]/60">
                      {folderName.length > 0 ? "READY_TO_CREATE" : "AWAITING_INPUT"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-[#00ff88]/40">
                      {folderName.length}/255
                    </span>
                    <div className="w-16 h-1 bg-[#00ff88]/20 overflow-hidden">
                      <motion.div
                        className="h-full bg-[#00ff88]"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min((folderName.length / 255) * 100, 100)}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-4 flex justify-center"
                >
                  <WaveformVisualizer
                    color="#00ff88"
                    bars={20}
                    height={30}
                    active={folderName.length > 0}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-6 flex gap-3"
                >
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => !isCreating && onClose()}
                    disabled={isCreating}
                    className="flex-1 rounded-none font-mono text-xs h-11 border border-[#00ff88]/30 text-[#00ff88]/70 hover:text-[#00ff88] hover:bg-[#00ff88]/10 hover:border-[#00ff88]/50"
                  >
                    [ESC] CANCEL
                  </Button>
                  <Button
                    type="submit"
                    disabled={isCreating || !folderName.trim()}
                    className="flex-1 rounded-none font-mono text-xs h-11 bg-[#00ff88] text-black hover:bg-[#00ff88]/90 disabled:bg-[#00ff88]/30 disabled:text-black/50 shadow-[0_0_20px_rgba(0,255,136,0.3)]"
                  >
                    [ENTER] CREATE
                  </Button>
                </motion.div>

                <div className="mt-4 flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00ff88]/30" />
                  <span className="text-[8px] font-mono text-[#00ff88]/30">SYS.MKDIR</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00ff88]/30" />
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CreateFolderModal;
