"use client";
import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { HackerText, WaveformVisualizer } from "@/shared/components/tech";
import { QrCode, Smartphone, Copy, Check, RefreshCw, X } from "lucide-react";

interface QRUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentFolderId?: string | null;
  currentFolderName?: string;
}

export const QRUploadModal: React.FC<QRUploadModalProps> = ({
  isOpen,
  onClose,
  currentFolderId,
  currentFolderName,
}) => {
  const [uploadUrl, setUploadUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    if (isOpen) {
      const newSessionId = `qr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      setSessionId(newSessionId);

      const baseUrl = window.location.origin;
      const params = new URLSearchParams();
      params.set("session", newSessionId);
      if (currentFolderId) {
        params.set("folderId", currentFolderId);
      }

      setUploadUrl(`${baseUrl}/files/mobile-upload?${params.toString()}`);
    }
  }, [isOpen, currentFolderId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(uploadUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const regenerateQR = () => {
    const newSessionId = `qr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    setSessionId(newSessionId);

    const baseUrl = window.location.origin;
    const params = new URLSearchParams();
    params.set("session", newSessionId);
    if (currentFolderId) {
      params.set("folderId", currentFolderId);
    }

    setUploadUrl(`${baseUrl}/files/mobile-upload?${params.toString()}`);
  };

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
            onClick={onClose}
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
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: -10,
              transition: { duration: 0.15 }
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
                onClick={onClose}
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
                      <QrCode className="w-6 h-6 text-[#00ff88]" />
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
                      QR_UPLOAD
                    </HackerText>
                    <p className="text-[10px] text-[#00ff88]/60 font-mono mt-1">
                      SCAN_TO_UPLOAD_FROM_MOBILE
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Content */}
              <div className="p-6 relative">
                {/* Target folder info */}
                {currentFolderName && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-4 p-3 border border-[#00ff88]/30 bg-[#00ff88]/5"
                  >
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <span className="text-[#00ff88]/60">TARGET:</span>
                      <span className="text-[#00ff88]">{currentFolderName}</span>
                    </div>
                  </motion.div>
                )}

                {/* QR Code */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.15, type: "spring", damping: 20 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative p-4 bg-white rounded-sm">
                    <QRCodeSVG
                      value={uploadUrl}
                      size={200}
                      level="H"
                      marginSize={0}
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                    {/* Corner decorations */}
                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#00ff88]" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#00ff88]" />
                    <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#00ff88]" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#00ff88]" />
                  </div>

                  {/* Waveform */}
                  <div className="mt-4">
                    <WaveformVisualizer color="#00ff88" bars={15} height={20} active />
                  </div>

                  {/* Instructions */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-center space-y-2"
                  >
                    <div className="flex items-center justify-center gap-2 text-[#00ff88]">
                      <Smartphone className="w-4 h-4" />
                      <span className="text-xs font-mono">SCAN_WITH_PHONE</span>
                    </div>
                    <p className="text-[10px] text-[#00ff88]/60 font-mono max-w-[250px]">
                      Quet ma QR bang camera dien thoai de mo trang upload file nhanh
                    </p>
                  </motion.div>
                </motion.div>

                {/* URL display */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mt-6 p-3 border border-[#00ff88]/30 bg-black/50"
                >
                  <p className="text-[10px] text-[#00ff88]/60 font-mono mb-1">URL:</p>
                  <div className="flex items-start gap-2">
                    <p className="text-[10px] font-mono text-[#00ff88] break-all flex-1">
                      {uploadUrl}
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleCopy}
                      className="shrink-0 h-6 w-6 p-0 text-[#00ff88] hover:bg-[#00ff88]/10"
                    >
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    </Button>
                  </div>
                </motion.div>

                {/* Session info */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="mt-4 flex items-center justify-between gap-2 text-[10px] font-mono text-[#00ff88]/40"
                >
                  <span>SESSION: {sessionId.slice(0, 12)}...</span>
                  <button
                    onClick={regenerateQR}
                    className="flex items-center gap-1 hover:text-[#00ff88] transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>REGENERATE</span>
                  </button>
                </motion.div>

                {/* Bottom decoration */}
                <div className="mt-6 flex items-center justify-center gap-2">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#00ff88]/30" />
                  <span className="text-[8px] font-mono text-[#00ff88]/30">QR.UPLOAD</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#00ff88]/30" />
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default QRUploadModal;
