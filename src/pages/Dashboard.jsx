import React, { useState } from "react";
import { Users, Truck, AlertTriangle, Wallet, Plus } from "lucide-react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import DelegateTable from "../components/DelegateTable";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";

const mockDelegates = [
  {
    id: "1",
    name: "محمد أحمد",
    idNumber: "1234567890",
    phone: "+966501234567",
    project: "هنقرستيشن",
    city: "الرياض",
    supervisor: "علي محمد",
    status: "active",
  },
  {
    id: "2",
    name: "فاطمة علي",
    idNumber: "0987654321",
    phone: "+966509876543",
    project: "جاهز",
    city: "الرياض",
    supervisor: "سارة أحمد",
    status: "active",
  },
  {
    id: "3",
    name: "خالد سالم",
    idNumber: "5555555555",
    phone: "+966505555555",
    project: "هنقرستيشن",
    city: "الدمام",
    supervisor: "محمود علي",
    status: "on_leave",
  },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen flex-col bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          activeItem="dashboard"
        />

        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  إدارة المناديب والأسطول
                </h1>
                <p className="mt-1 text-muted-foreground">
                  متابعة كافة بيانات الأسطول والعمليات
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة مندوب جديد
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="إجمالي المناديب"
                value="3"
                icon={Users}
                trend="up"
                trendValue="2 هذا الشهر"
              />
              <StatCard
                title="السيارات النشطة"
                value="2"
                icon={Truck}
                trend="neutral"
                trendValue="جميعها في الخدمة"
              />
              <StatCard
                title="المخالفات"
                value="1"
                icon={AlertTriangle}
                trend="down"
                trendValue="-1 عن الشهر الماضي"
              />
              <StatCard
                title="إجمالي الرواتب"
                value="15,000"
                icon={Wallet}
                trend="neutral"
                trendValue="هذا الشهر"
              />
            </div>

            <Card className="p-6">
              <DelegateTable delegates={mockDelegates} />
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}