"use client";
import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { TechLayout, TechSidebar } from "@/shared/components/layout";
import {
  HomeFileCard,
  HomeBreadcrumb,
  HomeToolbar,
  HomeEmptyState,
  HomeDropZone,
} from "@/worlds/home/components";
import { FilePreviewDialog } from "@/worlds/storage/components/FilePreviewDialog";
import { QRUploadModal } from "@/worlds/storage/components/QRUploadModal";
import { CreateFolderModal } from "@/worlds/storage/components/CreateFolderModal";
import { AdminLoginModal, AdminConfigModal } from "@/shared/components/admin";
import {
  ParticleField,
  TechBadge,
  DataStream,
  LoadingDots,
  RadarScan,
  TerminalText,
  NeonText,
} from "@/shared/components/tech";
import { useFileList } from "@/worlds/storage/hooks/useFileList";
import { Toaster, toast } from "react-hot-toast";
import { useDriveQuery } from "@/worlds/storage/hooks/useDriveQuery";
import { Menu, FolderPlus, Search, Sparkles, RefreshCw, Home, Settings } from "lucide-react";
import Link from "next/link";

export default function FilesPage() {
  return (
    <Suspense fallback={<FilesPageLoading />}>
      <FilesPageContent />
    </Suspense>
  );
}

function FilesPageLoading() {
  return (
    <TechLayout showGrid showCircuits accentColor="#00ff88">
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RadarScan size={80} color="#00ff88" speed={2} />
          <LoadingDots color="#00ff88" size={6} />
        </div>
      </div>
    </TechLayout>
  );
}

function FilesPageContent() {
  const searchParams = useSearchParams();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<{ id: string; name: string } | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Check for ?admin in URL
  useEffect(() => {
    if (searchParams.has("admin") && !isAdmin) {
      setShowLoginModal(true);
      // Remove ?admin from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("admin");
      window.history.replaceState({}, "", url.pathname);
    }
  }, [searchParams, isAdmin]);

  const handleAdminLogin = (password: string) => {
    setAdminPassword(password);
    setIsAdmin(true);
  };

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
    startDeleteEffect,
    handleDeleteComplete,
    deletingFileId,
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
  } = useDriveQuery();

  const {
    files: sortedFiles,
    uniqueExtensions,
    showFolders,
    setShowFolders,
    selectedExtension,
    setSelectedExtension,
    sortCriteria,
    setSortCriteria,
    isGridView,
    setIsGridView,
    isDragging,
    handleDragEnter,
    handleDragLeave,
    handleDragOver,
    handleDrop,
    generateDownloadLink,
    handleDownloadFolder,
    isAdminMode,
    formatFileSize,
    SortCriteria,
  } = useFileList({
    files,
    isLoading,
    currentFolderId,
    currentFolderName,
    folderPath,
    onFolderClick: handleFolderClick,
    onBreadcrumbClick: handleBreadcrumbClick,
    onBackClick: handleBackClick,
    onDownload: handleDownload,
    onUploadFile: handleUploadFile,
    onUploadFolder: handleUploadFolder,
    onCheckFolderContent: checkFolderContent,
    onDelete: handleDelete,
  });

  // Animation handled by framer-motion instead of GSAP

  const triggerFileUpload = () => fileInputRef.current?.click();

  return (
    <TechLayout showGrid showCircuits accentColor="#00ff88">
      <div className="fixed inset-0 pointer-events-none">
        <ParticleField color="#00ff88" particleCount={35} speed={0.2} connectDistance={100} className="opacity-15" />
        <DataStream color="#00ff88" density={8} speed={60} className="opacity-10" />
      </div>

      <Toaster position="bottom-center" toastOptions={{ style: { background: "#00ff88", color: "#000", borderRadius: 0, fontSize: "11px", fontFamily: "monospace", fontWeight: "bold" } }} />

      {/* Fixed full-height layout */}
      <div className="h-screen flex flex-col overflow-hidden">
        {/* Header - Fixed */}
        <header className="shrink-0 z-50 bg-background/95 border-b border-border backdrop-blur-xs">
          <div className="flex items-center justify-between px-4 md:px-6 h-14">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="md:hidden p-2 text-muted-foreground hover:text-[#00ff88]">
                <Menu className="w-5 h-5" />
              </button>
              <Link href="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <Home className="w-4 h-4" />
                <span className="text-xs font-mono hidden sm:inline">HOME</span>
              </Link>
              <div className="h-4 w-px bg-border" />
              <NeonText className="text-sm font-mono font-bold" color="#00ff88" flickerSpeed="slow" glowIntensity="medium">FILE_SYSTEM</NeonText>
            </div>

            <div className="flex-1 max-w-xl mx-4 hidden md:block">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={isAISearch ? "// AI SEARCH..." : "// SEARCH..."}
                  className="w-full bg-muted/30 border border-border pl-10 pr-20 py-2 text-sm font-mono outline-hidden focus:border-[#00ff88]/50"
                  onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
                />
                <button onClick={handleToggleAISearch} className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 ${isAISearch ? "text-[#00ff88]" : "text-muted-foreground"}`}>
                  <Sparkles className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {handleReloadCache && (
                <button onClick={handleReloadCache} disabled={isReloading} className="p-2 text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <RefreshCw className={`w-4 h-4 ${isReloading ? "animate-spin" : ""}`} />
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => setShowConfigModal(true)}
                  className="p-2 text-[#00ff88] hover:bg-[#00ff88]/10 transition-colors border border-[#00ff88]/30"
                  title="Admin Config"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
              <TechBadge variant={isAdmin ? "warning" : "success"} size="sm" pulse>
                {isAdmin ? "ADMIN" : "ONLINE"}
              </TechBadge>
            </div>
          </div>
        </header>

        {/* Main area - Sidebar fixed, content scrolls */}
        <div className="flex flex-1 overflow-hidden relative z-10">
          {/* Sidebar - Fixed height, internal scroll if needed */}
          <TechSidebar
            driveInfo={driveInfo}
            onCreateFolder={handleCreateFolder}
            onUploadFile={handleUploadFile}
            onUploadFolder={handleUploadFolder}
            formatBytes={formatBytes}
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            fileInputRef={fileInputRef}
            isLoading={isSidebarLoading}
            onQRUpload={() => setShowQRModal(true)}
          />

          {/* Main content area */}
          <main
            className="flex-1 flex flex-col overflow-hidden relative"
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <HomeDropZone isVisible={isDragging} />

            {/* Fixed: Breadcrumb + Toolbar */}
            <div className="shrink-0 p-4 md:px-6 md:pt-4 md:pb-2 border-b border-border/50 bg-background">
              <HomeBreadcrumb
                currentFolderId={currentFolderId}
                currentFolderName={currentFolderName}
                folderPath={folderPath}
                onNavigate={(id, index) => {
                  if (id === null) handleBackClick();
                  else if (index !== undefined) handleBreadcrumbClick(id, index);
                }}
                onBack={handleBackClick}
              />

              <HomeToolbar
                totalItems={sortedFiles.length}
                showFolders={showFolders}
                onToggleFolders={() => setShowFolders(!showFolders)}
                selectedExtension={selectedExtension}
                onSelectExtension={setSelectedExtension}
                uniqueExtensions={uniqueExtensions}
                sortCriteria={sortCriteria}
                onSortChange={(criteria) => setSortCriteria(criteria as typeof SortCriteria[keyof typeof SortCriteria])}
                isGridView={isGridView}
                onToggleView={() => setIsGridView(!isGridView)}
                isLoading={isLoading}
              />
            </div>

            {/* Scrollable: File list only */}
            <div className="flex-1 overflow-y-auto p-4 md:px-6">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="flex flex-col items-center gap-4">
                    <RadarScan size={80} color="#00ff88" speed={2} />
                    <div className="flex items-center gap-2">
                      <LoadingDots color="#00ff88" size={6} />
                      <TerminalText color="#00ff88" prefix="// " typingSpeed={80}>SCANNING_FILES...</TerminalText>
                    </div>
                  </div>
                </div>
              ) : sortedFiles.length === 0 ? (
                <HomeEmptyState onCreateFolder={handleCreateFolder} onUploadFile={triggerFileUpload} />
              ) : (
                <div className={isGridView ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "flex flex-col gap-1"}>
                  <AnimatePresence mode="popLayout">
                    {sortedFiles.map((file, index) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        layout
                      >
                        <HomeFileCard
                          id={file.id}
                          name={file.name}
                          mimeType={file.mimeType}
                          createdTime={file.createdTime}
                          size={file.size}
                          isUploading={file.isUploading}
                          uploadProgress={file.uploadProgress}
                          isAdmin={isAdminMode}
                          viewMode={isGridView ? "grid" : "list"}
                          isDeleting={deletingFileId === file.id}
                          onFolderClick={() => handleFolderClick(file.id, file.name)}
                          onCopyLink={() => { navigator.clipboard.writeText(generateDownloadLink(file.id)); toast.success("LINK_COPIED"); }}
                          onDownload={() => { file.mimeType === "application/vnd.google-apps.folder" ? handleDownloadFolder(file.id, file.name) : handleDownload(file.id, file.name); }}
                          onDelete={() => startDeleteEffect(file.id)}
                          onDeleteComplete={handleDeleteComplete}
                          onPreview={() => setPreviewFile({ id: file.id, name: file.name })}
                          formatFileSize={formatFileSize}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <input ref={fileInputRef} type="file" multiple onChange={handleUploadFile} className="hidden" />

      {/* File Preview Dialog */}
      <FilePreviewDialog
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        fileId={previewFile?.id || ""}
        fileName={previewFile?.name || ""}
        onDownload={() => {
          if (previewFile) {
            handleDownload(previewFile.id, previewFile.name);
          }
        }}
      />

      {/* Admin Modals */}
      <AdminLoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleAdminLogin}
      />
      <AdminConfigModal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        adminPassword={adminPassword}
      />

      {/* QR Upload Modal */}
      <QRUploadModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        currentFolderId={currentFolderId}
        currentFolderName={currentFolderName}
      />

      {/* Create Folder Modal */}
      <CreateFolderModal
        isOpen={isCreateFolderModalOpen}
        onClose={() => setIsCreateFolderModalOpen(false)}
        folderName={newFolderName}
        onFolderNameChange={setNewFolderName}
        onSubmit={handleCreateFolderSubmit}
        isCreating={isCreatingFolder}
      />
    </TechLayout>
  );
}
