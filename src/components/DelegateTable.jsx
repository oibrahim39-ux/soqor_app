import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2 } from "lucide-react";

const statusConfig = {
  active: { label: "نشط", className: "bg-green-100 text-green-800" },
  inactive: { label: "غير نشط", className: "bg-gray-100 text-gray-800" },
  on_leave: { label: "في إجازة", className: "bg-yellow-100 text-yellow-800" },
};

export default function DelegateTable({ delegates = [], isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </Card>
    );
  }

  if (delegates.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center py-12">
          <p className="text-lg font-medium text-foreground">لا توجد بيانات</p>
          <p className="mt-1 text-sm text-muted-foreground">لم يتم العثور على أي مناديب في النظام</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden animate-fade-in-up">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-secondary/50">
              <TableHead className="text-right">اسم المندوب</TableHead>
              <TableHead className="text-right">رقم الإقامة</TableHead>
              <TableHead className="text-right">الجوال</TableHead>
              <TableHead className="text-right">المشروع</TableHead>
              <TableHead className="text-right">المدينة</TableHead>
              <TableHead className="text-right">المشرف</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {delegates.map((delegate) => {
              const statusInfo = statusConfig[delegate.status] || statusConfig.inactive;
              return (
                <TableRow key={delegate.id} className="hover:bg-secondary/30 transition-colors">
                  <TableCell className="font-medium">{delegate.name}</TableCell>
                  <TableCell className="text-sm">{delegate.idNumber}</TableCell>
                  <TableCell className="text-sm">{delegate.phone}</TableCell>
                  <TableCell className="text-sm">{delegate.project}</TableCell>
                  <TableCell className="text-sm">{delegate.city}</TableCell>
                  <TableCell className="text-sm">{delegate.supervisor}</TableCell>
                  <TableCell>
                    <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="ghost" size="sm" onClick={() => onEdit?.(delegate)}>
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" onClick={() => onDelete?.(delegate.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}