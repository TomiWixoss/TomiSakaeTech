"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { FileText, Search, Sparkles, Sun, Moon, RefreshCw } from "lucide-react";

interface HeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAISearch: boolean;
  onToggleAISearch: () => void;
  onSearch: () => void;
  onReloadCache?: () => void;
  isReloading?: boolean;
}

export default function Header({
  searchTerm,
  onSearchChange,
  isAISearch,
  onToggleAISearch,
  onSearch,
  onReloadCache,
  isReloading,
}: HeaderProps) {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  return (
    <header className="border-b bg-background">
      <div className="flex items-center justify-between h-14 px-6">
        {/* Logo */}
        <div className="flex items-center gap-8">
          <span className="text-sm font-medium tracking-tight">DA22TTC</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchTerm}
              onChange={onSearchChange}
              placeholder={isAISearch ? "Tìm kiếm bằng AI..." : "Tìm kiếm tài liệu..."}
              className="w-full bg-transparent border-b border-transparent focus:border-foreground pl-6 pr-20 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground"
              onKeyDown={(e) => {
                if (e.key === "Enter") onSearch();
              }}
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isAISearch && (
                <button
                  onClick={onSearch}
                  className="text-xs text-foreground hover:text-primary transition-colors"
                >
                  Tìm
                </button>
              )}
              <button
                onClick={onToggleAISearch}
                className={`p-1 transition-colors ${
                  isAISearch ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
                title={isAISearch ? "Đang dùng AI" : "Chuyển sang AI"}
              >
                <Sparkles className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {onReloadCache && (
            <button
              onClick={onReloadCache}
              disabled={isReloading}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30"
              title="Tải lại"
            >
              <RefreshCw className={`w-4 h-4 ${isReloading ? "animate-spin" : ""}`} />
            </button>
          )}

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground transition-colors"
            title={theme === "dark" ? "Giao diện sáng" : "Giao diện tối"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => router.push("/txt")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>Ghi chú</span>
          </button>
        </div>
      </div>
    </header>
  );
}
