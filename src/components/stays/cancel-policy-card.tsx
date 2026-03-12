
export function CancelPolicyCard({ data }: { data: any }) {
  return (
    <div
      className={`border rounded-xl p-3`}
    >
      <div className="flex gap-2 items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-500">
            {data.description}
          </span>
        </div>
        <div className="flex-none w-24">
          <div className={`w-full text-left leading-4`}>
            <div className="flex flex-col">
              <span className="text-yellow-500 font-semibold text-2xl">
                {data.percent}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
