import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { CompletedJobsChart } from "@/components/dashboard/CompletedJobsChart";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        <DashboardStats />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompletedJobsChart />
        <ProfitLossChart />
      </div>
    </div>
  );
};

export default Dashboard;