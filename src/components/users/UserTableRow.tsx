
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { UserWithDetails } from "@/hooks/useUsers";
import { useNavigate } from "react-router-dom";

interface UserTableRowProps {
  user: UserWithDetails;
  onDelete: (userId: string) => void;
}

export const UserTableRow = ({ user, onDelete }: UserTableRowProps) => {
  const navigate = useNavigate();

  return (
    <TableRow>
      <TableCell 
        className="cursor-pointer hover:text-blue-600"
        onClick={() => navigate(`/admin/users/${user.id}/jobs`)}
      >
        {user.full_name || "N/A"}
      </TableCell>
      <TableCell>{user.email || "N/A"}</TableCell>
      <TableCell className="capitalize">{user.user_type}</TableCell>
      <TableCell>
        {user.isAdmin && (
          <div className="flex items-center text-primary gap-1">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin</span>
          </div>
        )}
      </TableCell>
      <TableCell className="text-right">{user.jobCount}</TableCell>
      <TableCell className="text-right">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this user? This action cannot be undone.
                All associated data will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={() => onDelete(user.id)}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};
