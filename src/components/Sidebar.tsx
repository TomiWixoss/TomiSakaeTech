"use client";
import React from "react";
import { DriveInfo } from "../types";
import { FolderPlus, FileUp, FolderUp, HardDrive, X } from "lucide-react";
import { cn } from "@/lib/utils";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    webkitdirectory?: string;
    directory?: string;
  }
}

interface SidebarProps {
  driveInfo: DriveInfo | null;
  onCreateFolder: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadFolder: (e: React.ChangeEvent<HTMLInputElement>) => void;
  formatBytes: (bytes: number) => string;
  isOpen: boolean;
  onClose: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  isLoading?: boolean;
}

export default function Sidebar({
  driveInfo,
  onCreateFolder,
  onUploadFile,
  onUploadFolder,
  formatBytes,
  isOpen,
  onClose,
  fileInputRef,
  isLoading = false,
}: SidebarProps) {
  const folderInputRef = React.useRef<HTMLInputElement>(null);

  const handleCreateFolder = () => {
    onClose();
    onCreateFolder();
  };

  const storagePercent = driveInfo ? (driveInfo.used / driveInfo.total) * 100 : 0;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 md:top-14 w-64 bg-background border-r z-50",
          "flex flex-col h-screen md:h-[calc(100vh-56px)]",
          "transition-transform duration-200",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <span className="text-sm font-medium">Menu</span>
          <button onClick={onClose} className="p-1 text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-4 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-muted animate-pulse" />
              ))}
            </div>
          ) : (
            <nav className="space-y-1">
              <button
                onClick={handleCreateFolder}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left hover:bg-muted transition-colors"
              >
                <FolderPlus className="w-4 h-4" />
                <span>Tạo thư mục</span>
              </button>

              <label
                htmlFor="fileInput"
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer hover:bg-muted transition-colors"
              >
                <FileUp className="w-4 h-4" />
                <span>Tải file lên</span>
              </label>

              <label
                htmlFor="folderInput"
                className="w-full flex items-center gap-3 px-3 py-2.5 text-sm cursor-pointer hover:bg-muted transition-colors"
              >
                <FolderUp className="w-4 h-4" />
                <span>Tải thư mục lên</span>
              </label>

              <div className="pt-4 mt-4 border-t">
                <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-muted-foreground">
                  <HardDrive className="w-4 h-4" />
                  <span>DA22TTC</span>
                </div>
              </div>
            </nav>
          )}

          {/* Hidden Inputs */}
          <input
            id="fileInput"
            type="file"
            multiple
            onChange={(e) => {
              onUploadFile(e);
              onClose();
            }}
            className="hidden"
            ref={fileInputRef}
          />
          <input
            id="folderInput"
            type="file"
            webkitdirectory=""
            directory=""
            multiple
            onChange={(e) => {
              onUploadFolder(e);
              onClose();
            }}
            className="hidden"
            ref={folderInputRef}
          />
        </div>

        {/* Storage Info */}
        {driveInfo && !isLoading && (
          <div className="p-4 border-t">
            <div className="text-xs text-muted-foreground mb-2">Bộ nhớ</div>
            <div className="h-1 bg-muted overflow-hidden">
              <div
                className="h-full bg-foreground transition-all"
                style={{ width: `${storagePercent}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              {formatBytes(driveInfo.remaining)} còn trống
            </div>
          </div>
        )}

        {isLoading && (
          <div className="p-4 border-t">
            <div className="h-3 w-16 bg-muted animate-pulse mb-2" />
            <div className="h-1 bg-muted" />
            <div className="h-3 w-24 bg-muted animate-pulse mt-2" />
          </div>
        )}
      </aside>
    </>
  );
}
