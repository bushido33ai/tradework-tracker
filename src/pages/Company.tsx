import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Company = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Company Settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Company Information</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Company settings coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Company;