import { Card } from "@/components/ui/card";

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
  className,
}) {
  const trendColor = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600",
  };

  return (
    <Card className={`p-6 animate-fade-in-up ${className || ""}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-2xl font-bold text-foreground">{value}</p>
          {subtitle && <p className="mt-1 text-xs text-muted-foreground">{subtitle}</p>}
          {trend && trendValue && (
            <p className={`mt-2 text-xs font-semibold ${trendColor[trend]}`}>{trendValue}</p>
          )}
        </div>
        <div className="ml-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
        </div>
      </div>
    </Card>
  );
}