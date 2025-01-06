import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

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
              <TableCell>{supplier.email}</TableCell>
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