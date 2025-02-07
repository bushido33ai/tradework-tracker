
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { Navigate } from "react-router-dom";

const Admin = () => {
  const { session } = useSessionContext();
  const { data: isAdmin, isLoading } = useAdminRole(session?.user?.id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Admin Settings</h1>
        <p className="text-gray-500">Welcome to the admin dashboard. More features coming soon.</p>
      </div>
    </div>
  );
};

export default Admin;
