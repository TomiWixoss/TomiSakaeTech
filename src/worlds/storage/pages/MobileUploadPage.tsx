"use client";
import { useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { driveService } from "@/worlds/storage/services/driveService";
import {
  Upload,
  CheckCircle,
  XCircle,
  FileUp,
  Loader2,
  Camera,
  Image as ImageIcon,
  File,
  Smartphone,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

function MobileUploadContent() {
  const searchParams = useSearchParams();
  const folderId = searchParams.get("folderId");
  const sessionId = searchParams.get("session");

  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [uploadStatus, setUploadStatus] = useState<Record<string, "pending" | "uploading" | "success" | "error">>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles((prev) => [...prev, ...selectedFiles]);
      const newStatus: Record<string, "pending"> = {};
      selectedFiles.forEach((f) => {
        newStatus[f.name + f.size] = "pending";
      });
      setUploadStatus((prev) => ({ ...prev, ...newStatus }));
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);

    for (const file of files) {
      const fileKey = file.name + file.size;
      setUploadStatus((prev) => ({ ...prev, [fileKey]: "uploading" }));

      try {
        await driveService.uploadFile(file, folderId, (progress) => {
          setUploadProgress((prev) => ({ ...prev, [fileKey]: progress }));
        });
        setUploadStatus((prev) => ({ ...prev, [fileKey]: "success" }));
        toast.success(`${file.name} uploaded!`);
      } catch {
        setUploadStatus((prev) => ({ ...prev, [fileKey]: "error" }));
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploading(false);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="w-5 h-5" />;
    return <File className="w-5 h-5" />;
  };

  const allUploaded = files.length > 0 && files.every((f) => uploadStatus[f.name + f.size] === "success");

  return (
    <div className="min-h-screen bg-black text-white">
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: "#00ff88",
            color: "#000",
            borderRadius: 0,
            fontSize: "12px",
            fontFamily: "monospace",
          },
        }}
      />

      <header className="sticky top-0 z-50 bg-black/95 border-b border-[#00ff88]/30 backdrop-blur-sm">
        <div className="px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-[#00ff88] flex items-center justify-center">
              <Smartphone className="w-5 h-5 text-[#00ff88]" />
            </div>
            <div>
              <h1 className="text-sm font-mono font-bold text-[#00ff88]">QUICK_UPLOAD</h1>
              <p className="text-[10px] font-mono text-[#00ff88]/60">
                {sessionId ? `SESSION: ${sessionId.slice(0, 15)}...` : "MOBILE_UPLOAD"}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-4 pb-32">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#00ff88]/50 bg-[#00ff88]/5 active:bg-[#00ff88]/10 transition-colors disabled:opacity-50"
          >
            <FileUp className="w-8 h-8 text-[#00ff88]" />
            <span className="text-xs font-mono text-[#00ff88]">CHON FILE</span>
          </button>

          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={uploading}
            className="flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed border-[#00ff88]/50 bg-[#00ff88]/5 active:bg-[#00ff88]/10 transition-colors disabled:opacity-50"
          >
            <Camera className="w-8 h-8 text-[#00ff88]" />
            <span className="text-xs font-mono text-[#00ff88]">CHUP ANH</span>
          </button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />

        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#00ff88]/60">
                FILES ({files.length})
              </span>
              {!uploading && !allUploaded && (
                <button
                  onClick={() => setFiles([])}
                  className="text-xs font-mono text-red-400 hover:text-red-300"
                >
                  XOA TAT CA
                </button>
              )}
            </div>

            <AnimatePresence>
              {files.map((file, index) => {
                const fileKey = file.name + file.size;
                const status = uploadStatus[fileKey] || "pending";
                const progress = uploadProgress[fileKey] || 0;

                return (
                  <motion.div
                    key={fileKey}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    className="relative border border-[#00ff88]/30 bg-[#00ff88]/5 p-3"
                  >
                    {status === "uploading" && (
                      <div
                        className="absolute inset-0 bg-[#00ff88]/10 transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    )}

                    <div className="relative flex items-center gap-3">
                      <div className="shrink-0 text-[#00ff88]/60">
                        {getFileIcon(file)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-mono text-[#00ff88] truncate">
                          {file.name}
                        </p>
                        <p className="text-[10px] font-mono text-[#00ff88]/50">
                          {formatFileSize(file.size)}
                          {status === "uploading" && ` - ${progress}%`}
                        </p>
                      </div>

                      <div className="shrink-0">
                        {status === "pending" && !uploading && (
                          <button
                            onClick={() => removeFile(index)}
                            className="p-2 text-red-400 hover:text-red-300"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        )}
                        {status === "uploading" && (
                          <Loader2 className="w-5 h-5 text-[#00ff88] animate-spin" />
                        )}
                        {status === "success" && (
                          <CheckCircle className="w-5 h-5 text-[#00ff88]" />
                        )}
                        {status === "error" && (
                          <XCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {files.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 border-2 border-dashed border-[#00ff88]/30 flex items-center justify-center mb-4">
              <Upload className="w-8 h-8 text-[#00ff88]/30" />
            </div>
            <p className="text-sm font-mono text-[#00ff88]/60">
              Chon file hoac chup anh de upload
            </p>
          </div>
        )}
      </main>

      {files.length > 0 && !allUploaded && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 border-t border-[#00ff88]/30">
          <button
            onClick={uploadFiles}
            disabled={uploading || files.length === 0}
            className="w-full py-4 bg-[#00ff88] text-black font-mono font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                DANG UPLOAD...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                UPLOAD {files.length} FILE
              </>
            )}
          </button>
        </div>
      )}

      {allUploaded && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-black/95 border-t border-[#00ff88]/30">
          <div className="text-center mb-3">
            <CheckCircle className="w-8 h-8 text-[#00ff88] mx-auto mb-2" />
            <p className="text-sm font-mono text-[#00ff88]">UPLOAD HOAN TAT!</p>
          </div>
          <button
            onClick={() => {
              setFiles([]);
              setUploadProgress({});
              setUploadStatus({});
            }}
            className="w-full py-3 border-2 border-[#00ff88] text-[#00ff88] font-mono font-bold text-sm"
          >
            UPLOAD THEM FILE
          </button>
        </div>
      )}
    </div>
  );
}

export default function MobileUploadPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#00ff88] animate-spin" />
        </div>
      }
    >
      <MobileUploadContent />
    </Suspense>
  );
}
