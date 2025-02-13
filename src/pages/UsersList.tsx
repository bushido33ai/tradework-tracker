
import { Loader2, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useUsers } from "@/hooks/useUsers";
import { useDeleteUser } from "@/hooks/useDeleteUser";
import { UsersTable } from "@/components/users/UsersTable";

const UsersList = () => {
  const navigate = useNavigate();
  const { data: users, isLoading } = useUsers();
  const deleteUserMutation = useDeleteUser();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/admin")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Admin
        </Button>
        <h1 className="text-3xl font-bold">User Details</h1>
      </div>

      <UsersTable 
        users={users || []} 
        onDeleteUser={(userId) => deleteUserMutation.mutate(userId)} 
      />
    </div>
  );
};

export default UsersList;
