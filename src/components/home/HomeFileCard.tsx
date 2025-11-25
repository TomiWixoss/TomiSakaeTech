"use client";
import React, { useRef, useEffect } from "react";
import gsap from "gsap";
import { NeonBorder, TechBadge, TechProgress } from "@/components/ui/tech";
import { FolderTechIcon, FileTechIcon } from "@/components/icons/TechIcons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Copy, Download, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface HomeFileCardProps {
  id: string;
  name: string;
  mimeType: string;
  createdTime: string;
  size?: number;
  isUploading?: boolean;
  uploadProgress?: number;
  isAdmin: boolean;
  onFolderClick: () => void;
  onCopyLink: () => void;
  onDownload: () => void;
  onDelete: () => void;
  formatFileSize: (bytes: number) => string;
}

export const HomeFileCard: React.FC<HomeFileCardProps> = ({
  id,
  name,
  mimeType,
  createdTime,
  size,
  isUploading,
  uploadProgress,
  isAdmin,
  onFolderClick,
  onCopyLink,
  onDownload,
  onDelete,
  formatFileSize,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isFolder = mimeType === "application/vnd.google-apps.folder";

  useEffect(() => {
    if (!cardRef.current) return;

    const card = cardRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        y: -6,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        y: 0,
        duration: 0.3,
        ease: "power2.out",
      });
    };

    card.addEventListener("mouseenter", handleMouseEnter);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mouseenter", handleMouseEnter);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClick = () => {
    if (isFolder && !isUploading) {
      gsap.to(cardRef.current, {
        scale: 0.98,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        onComplete: onFolderClick,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        "group cursor-pointer",
        isUploading && "opacity-60 pointer-events-none"
      )}
      onClick={handleClick}
    >
      <NeonBorder
        color={isFolder ? "#00ff88" : "#00aaff"}
        animated={false}
        intensity="low"
        className="bg-card h-full"
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {isFolder ? (
                <FolderTechIcon size={36} className="text-[#00ff88]" />
              ) : (
                <FileTechIcon size={36} className="text-[#00aaff]" />
              )}
              <TechBadge
                variant={isFolder ? "success" : "info"}
                size="sm"
              >
                {isFolder ? "FOLDER" : name.split(".").pop()?.toUpperCase() || "FILE"}
              </TechBadge>
            </div>

            {!isUploading && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-none border-border font-mono">
                  {!isFolder && (
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onCopyLink(); }} className="text-xs">
                      <Copy className="w-4 h-4 mr-2" />
                      COPY_LINK
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDownload(); }} className="text-xs">
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-xs text-destructive focus:text-destructive"
                        onClick={(e) => { e.stopPropagation(); onDelete(); }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        DELETE
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Name */}
          <h3 className="text-sm font-mono font-medium truncate mb-2 group-hover:text-[#00ff88] transition-colors">
            {name}
          </h3>

          {/* Meta */}
          <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
            <span>{new Date(createdTime).toLocaleDateString("vi-VN")}</span>
            {size && <span>{formatFileSize(size)}</span>}
          </div>

          {/* Upload progress */}
          {isUploading && (
            <div className="mt-4">
              <TechProgress
                value={uploadProgress || 0}
                max={100}
                height="sm"
                color="#00ff88"
              />
              <div className="text-[10px] font-mono text-[#00ff88] text-right mt-1">
                {uploadProgress}%
              </div>
            </div>
          )}
        </div>
      </NeonBorder>
    </div>
  );
};

export default HomeFileCard;
