import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import AddCustomerDialog from "@/components/customers/AddCustomerDialog";
import ViewCustomerDialog from "@/components/customers/ViewCustomerDialog";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Customers = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  
  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data: customerProfiles, error } = await supabase
        .from('customer_profiles')
        .select('*');
      
      if (error) throw error;
      return customerProfiles;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold break-words">Customers</h1>
          <p className="text-muted-foreground mt-2 text-sm md:text-base break-words">
            Manage your customer relationships
          </p>
        </div>
        <Button onClick={() => setShowAddDialog(true)} className="w-full sm:w-auto">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {!isDesktop ? (
        <div className="space-y-4">
          {customers?.map((customer) => (
            <Card key={customer.id} className="bg-blue-50/80 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 border-l-4 border-l-primary-600">
              <CardHeader>
                <button
                  onClick={() => setSelectedCustomer(customer)}
                  className="text-left hover:text-primary transition-colors"
                >
                  <h3 className="font-semibold">{customer.full_name}</h3>
                </button>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-muted-foreground">Email:</div>
                  <div className="break-all">{customer.email}</div>
                  <div className="text-muted-foreground">Phone:</div>
                  <div>{customer.telephone}</div>
                  <div className="text-muted-foreground">Address:</div>
                  <div>{customer.address}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50/80 rounded-lg shadow-lg border-l-4 border-l-primary-600">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.id} className="hover:bg-blue-100/50 transition-colors">
                  <TableCell>
                    <button
                      onClick={() => setSelectedCustomer(customer)}
                      className="font-medium hover:text-primary transition-colors text-left"
                    >
                      {customer.full_name}
                    </button>
                  </TableCell>
                  <TableCell className="break-all">{customer.email}</TableCell>
                  <TableCell>{customer.telephone}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <AddCustomerDialog 
        open={showAddDialog} 
        onOpenChange={setShowAddDialog} 
      />

      {selectedCustomer && (
        <ViewCustomerDialog
          open={!!selectedCustomer}
          onOpenChange={(open) => !open && setSelectedCustomer(null)}
          customer={selectedCustomer}
        />
      )}
    </div>
  );
};

export default Customers;