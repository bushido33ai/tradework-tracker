import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";

interface Supplier {
  id: string;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  business_type: string;
  status: "active" | "inactive";
}

interface SuppliersListProps {
  suppliers: Supplier[];
  isLoading: boolean;
}

const SuppliersList = ({ suppliers, isLoading }: SuppliersListProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isLoading) {
    return <div>Loading suppliers...</div>;
  }

  if (suppliers.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No suppliers found. Add your first supplier to get started.
      </div>
    );
  }

  if (!isDesktop) {
    return (
      <div className="space-y-4">
        {suppliers.map((supplier) => (
          <Card key={supplier.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{supplier.company_name}</h3>
                  <p className="text-sm text-muted-foreground">{supplier.contact_name}</p>
                </div>
                <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                  {supplier.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-muted-foreground">Email:</div>
                <div className="break-all">{supplier.email}</div>
                <div className="text-muted-foreground">Phone:</div>
                <div>{supplier.phone}</div>
                <div className="text-muted-foreground">Business Type:</div>
                <div>{supplier.business_type}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Business Type</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map((supplier) => (
            <TableRow key={supplier.id}>
              <TableCell className="font-medium">{supplier.company_name}</TableCell>
              <TableCell>{supplier.contact_name}</TableCell>
              <TableCell className="break-all">{supplier.email}</TableCell>
              <TableCell>{supplier.phone}</TableCell>
              <TableCell>{supplier.business_type}</TableCell>
              <TableCell>
                <Badge variant={supplier.status === "active" ? "default" : "secondary"}>
                  {supplier.status}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default SuppliersList;