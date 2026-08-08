import { Bell, Globe, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white">
      <div className="flex h-16 items-center justify-between px-6">
        {/* Left Section Menu & Logo */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white font-bold">
              ص
            </div>
            <span className="hidden font-bold text-foreground sm:inline">
              صقور الغد
            </span>
          </div>
        </div>

        {/* Center Section Date & Status */}
        <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
          <span>{new Date().toLocaleDateString("ar-SA")}</span>
        </div>

        {/* Right Section Actions */}
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <Button variant="ghost" size="icon">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
          <div className="ml-2 flex items-center gap-3 border-l border-border pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-foreground">عثمان إبراهيم</p>
              <p className="text-xs text-muted-foreground">مدير الأسطول</p>
            </div>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-foreground">
              <User className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}