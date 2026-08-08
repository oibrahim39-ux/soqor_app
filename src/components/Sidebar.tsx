import {
  LayoutDashboard,
  Users,
  Truck,
  Briefcase,
  FileText,
  Wallet,
  AlertTriangle,
  Fuel,
  BarChart3,
  Bell,
  Settings,
  Shield,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "لوحة التحكم", icon: LayoutDashboard },
  { id: "delegates", label: "إدارة المناديب", icon: Users },
  { id: "fleet", label: "السيارات والأسطول", icon: Truck },
  { id: "projects", label: "المشاريع", icon: Briefcase },
  { id: "contracts", label: "العقود والمستندات", icon: FileText },
  { id: "finance", label: "الرواتب والمالية", icon: Wallet },
  { id: "violations", label: "المخالفات", icon: AlertTriangle },
  { id: "fuel", label: "إدارة الوقود", icon: Fuel },
  { id: "reports", label: "التقارير التحليلية", icon: BarChart3 },
  { id: "notifications", label: "التنبيهات النظامية", icon: Bell },
  { id: "users", label: "المستخدمون والصلاحيات", icon: Shield },
  { id: "settings", label: "إعدادات النظام", icon: Settings },
];

export default function Sidebar({
  isOpen,
  onClose,
  activeItem = "dashboard",
  onItemClick,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed right-0 top-0 z-40 h-screen w-64 border-l border-border bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-6">
          <h2 className="font-semibold text-foreground">القائمة</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="space-y-1 p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-right my-1",
                  isActive
                    ? "bg-primary text-white shadow-md hover:bg-primary/90"
                    : "text-foreground hover:bg-secondary"
                )}
                onClick={() => {
                  onItemClick?.(item.id);
                  onClose?.();
                }}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1 text-right">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4" />}
              </Button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}