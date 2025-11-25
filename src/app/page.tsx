"use client";
import React, { useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import FileList from "../components/FileList";
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
import useDrive from "../components/hooks/drive";
import { Menu } from "lucide-react";

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
    setSearchTerm,
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
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "hsl(var(--foreground))",
            color: "hsl(var(--background))",
            borderRadius: 0,
            fontSize: "13px",
          },
        }}
      />

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center h-14 px-4 border-b">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="ml-3 text-sm font-medium">DA22TTC</span>
      </div>

      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        isAISearch={isAISearch}
        onToggleAISearch={handleToggleAISearch}
        onSearch={handleSearchClick}
        onReloadCache={handleReloadCache}
        isReloading={isReloading}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
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

        <FileList
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
        <DialogContent className="sm:max-w-md rounded-none border-border">
          <DialogHeader>
            <DialogTitle className="text-lg font-normal">Tạo thư mục mới</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCreateFolderSubmit}>
            <Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Tên thư mục"
              disabled={isCreatingFolder}
              className="rounded-none border-border"
              autoFocus
            />

            <DialogFooter className="mt-4 gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => !isCreatingFolder && setIsCreateFolderModalOpen(false)}
                disabled={isCreatingFolder}
                className="rounded-none"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isCreatingFolder || !newFolderName.trim()}
                className="rounded-none"
              >
                {isCreatingFolder ? "Đang tạo..." : "Tạo"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
