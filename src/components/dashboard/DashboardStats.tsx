
import { Briefcase, CheckCircle, PoundSterling, Receipt, Banknote } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useAdminRole } from "@/hooks/useAdminRole";
import { StatCard } from "./StatCard";
import { 
  useCurrentJobs, 
  useCompletedJobs, 
  useTotalSpend, 
  useTotalCosts,
  useTotalReceived
} from "@/hooks/dashboard/useDashboardStats";

export const DashboardStats = () => {
  const { session } = useSessionContext();
  const { data: isAdmin } = useAdminRole(session?.user?.id);
  const userId = !isAdmin ? session?.user?.id : undefined;

  const { data: currentJobs = 0 } = useCurrentJobs(userId);
  const { data: completedJobs = 0 } = useCompletedJobs(userId);
  const { data: totalSpend = 0 } = useTotalSpend(userId);
  const { data: totalCosts = 0 } = useTotalCosts(userId);
  const { data: totalReceived = 0 } = useTotalReceived(userId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Active Jobs"
        value={currentJobs}
        icon={Briefcase}
        href="/jobs"
      />
      <StatCard
        title="Completed Jobs (YTD)"
        value={completedJobs}
        icon={CheckCircle}
        href="/jobs?status=completed"
      />
      <StatCard
        title="Total Spend (YTD)"
        value={totalSpend}
        icon={PoundSterling}
        isCurrency={true}
      />
      <StatCard
        title="Total Costs (YTD)"
        value={totalCosts}
        icon={Receipt}
        isCurrency={true}
      />
      <StatCard
        title="Total Received (YTD)"
        value={totalReceived}
        icon={Banknote}
        isCurrency={true}
      />
    </div>
  );
};

