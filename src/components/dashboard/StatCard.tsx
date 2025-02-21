
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  href?: string;
  isCurrency?: boolean;
}

export const StatCard = ({ title, value, icon: Icon, href, isCurrency = false }: StatCardProps) => {
  const formattedValue = isCurrency
    ? `£${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : value;

  const Content = () => (
    <div className="text-2xl font-bold hover:text-primary transition-colors">
      {formattedValue}
    </div>
  );

  return (
    <Card className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary-600">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {href ? (
          <Link to={href}>
            <Content />
          </Link>
        ) : (
          <Content />
        )}
      </CardContent>
    </Card>
  );
};

