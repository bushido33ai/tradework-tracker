
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserTableRow } from "./UserTableRow";
import type { UserWithDetails } from "@/hooks/useUsers";

interface UsersTableProps {
  users: UserWithDetails[];
  onDeleteUser: (userId: string) => void;
}

export const UsersTable = ({ users, onDeleteUser }: UsersTableProps) => {
  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>User Type</TableHead>
            <TableHead>Role</TableHead>
            <TableHead className="text-right">Total Jobs</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user) => (
            <UserTableRow 
              key={user.id} 
              user={user} 
              onDelete={onDeleteUser} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
