import { CancelPolicyCard } from "./cancel-policy-card";

const CancelationPolicy = ({ data }: { data: any }) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {data.map((policy: any) => (
        <CancelPolicyCard data={policy} key={policy.description} />
      ))}
    </div>
  );
};

export { CancelationPolicy };
