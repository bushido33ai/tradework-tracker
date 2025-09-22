import { PaymentForm } from "../PaymentForm";
import { PaymentsList } from "../PaymentsList";

interface PaymentsTabProps {
  jobId: string;
}

export const PaymentsTab = ({ jobId }: PaymentsTabProps) => {
  return (
    <div className="space-y-6">
      <PaymentForm jobId={jobId} />
      <PaymentsList jobId={jobId} />
    </div>
  );
};