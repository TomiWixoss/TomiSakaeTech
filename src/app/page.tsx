"use client";
import React, { useState } from "react";
import { TechLayout, TechHeader, TechSidebar } from "@/components/layout";
import { TechFileList } from "@/components/files";
import { ParticleField, NeonBorder, TechBadge, WaveformVisualizer } from "@/components/ui/tech";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toaster } from "react-hot-toast";
import useDrive from "@/components/hooks/drive";
import { Menu, FolderPlus, Terminal } from "lucide-react";

export default function Home() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    files,
    isLoading,
    isSidebarLoading,
    driveInfo,
    currentFolderId,
    currentFolderName,
    folderPath,
    searchTerm,
    isAISearch,
    handleSearchChange,
    handleSearchClick,
    handleFolderClick,
    handleBreadcrumbClick,
    handleBackClick,
    handleToggleAISearch,
    handleDelete,
    formatBytes,
    handleCreateFolder,
    handleCreateFolderSubmit,
    handleUploadFile,
    handleUploadFolder,
    checkFolderContent,
    handleDownload,
    isCreatingFolder,
    isCreateFolderModalOpen,
    setIsCreateFolderModalOpen,
    newFolderName,
    setNewFolderName,
    handleReloadCache,
    isReloading,
  } = useDrive();

  return (
    <TechLayout showGrid showCircuits showCyberGrid={false} showScanLine={false}>
      {/* Background particles */}
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField 
          color="#00ff88" 
          particleCount={40} 
          speed={0.2} 
          connectDistance={120}
          className="opacity-20"
        />
      </div>

      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#00ff88",
            color: "#000",
            borderRadius: 0,
            fontSize: "11px",
            fontFamily: "monospace",
            fontWeight: "bold",
          },
        }}
      />

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border bg-background/95 relative z-50">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-muted-foreground hover:text-[#00ff88] transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 border border-[#00ff88] flex items-center justify-center">
            <Terminal className="w-3 h-3 text-[#00ff88]" />
          </div>
          <span className="text-xs font-mono font-bold">DA22TTC</span>
        </div>
        <TechBadge variant="success" size="sm" pulse>
          ONLINE
        </TechBadge>
      </div>

      <TechHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isAISearch={isAISearch}
        onToggleAISearch={handleToggleAISearch}
        onSearch={handleSearchClick}
        onReloadCache={handleReloadCache}
        isReloading={isReloading}
      />

      <div className="flex flex-1 overflow-hidden relative z-10">
        <TechSidebar
          driveInfo={driveInfo}
          onCreateFolder={handleCreateFolder}
          onUploadFile={handleUploadFile}
          onUploadFolder={handleUploadFolder}
          formatBytes={formatBytes}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          fileInputRef={React.useRef<HTMLInputElement>(null)}
          isLoading={isSidebarLoading}
        />

        <TechFileList
          files={files}
          isLoading={isLoading}
          currentFolderId={currentFolderId}
          currentFolderName={currentFolderName}
          folderPath={folderPath}
          onFolderClick={(id) => {
            const folder = files.find((f) => f.id === id);
            handleFolderClick(id, folder?.name);
          }}
          onBreadcrumbClick={handleBreadcrumbClick}
          onBackClick={handleBackClick}
          onDownload={handleDownload}
          onUploadFile={handleUploadFile}
          onUploadFolder={handleUploadFolder}
          onCheckFolderContent={checkFolderContent}
          onDelete={handleDelete}
        />
      </div>

      {/* Create Folder Dialog */}
      <Dialog
        open={isCreateFolderModalOpen}
        onOpenChange={(open) => {
          if (!isCreatingFolder) setIsCreateFolderModalOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md border-[#00ff88]/30 rounded-none bg-background p-0 overflow-hidden">
          {/* Header */}
          <div className="border-b border-[#00ff88]/20 bg-[#00ff88]/5 px-6 py-4">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 font-mono">
                <div className="w-8 h-8 border border-[#00ff88] flex items-center justify-center">
                  <FolderPlus className="w-4 h-4 text-[#00ff88]" />
                </div>
                <span>NEW_FOLDER</span>
                <TechBadge variant="success" size="sm">
                  CREATE
                </TechBadge>
              </DialogTitle>
            </DialogHeader>
          </div>

          <form onSubmit={handleCreateFolderSubmit} className="p-6">
            <NeonBorder color="#00ff88" intensity="low">
              <Input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="FOLDER_NAME"
                disabled={isCreatingFolder}
                className="rounded-none border-0 bg-transparent font-mono text-sm h-12"
                autoFocus
              />
            </NeonBorder>

            <div className="flex items-center justify-between mt-4">
              <WaveformVisualizer 
                color="#00ff88" 
                bars={8} 
                height={20} 
                active={newFolderName.length > 0} 
              />
            </div>

            <DialogFooter className="mt-6 gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={() => !isCreatingFolder && setIsCreateFolderModalOpen(false)}
                disabled={isCreatingFolder}
                className="rounded-none font-mono text-xs"
              >
                CANCEL
              </Button>
              <Button
                type="submit"
                disabled={isCreatingFolder || !newFolderName.trim()}
                className="rounded-none font-mono text-xs bg-[#00ff88] text-black hover:bg-[#00ff88]/90"
              >
                {isCreatingFolder ? "CREATING..." : "CREATE_FOLDER"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </TechLayout>
  );
}
