import { useLanguage } from "@/providers/language";
export default function GuestPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  const { translate } = useLanguage();
  const updateValue = (increment: number) => {
    onChange(Math.max(0, value + increment));
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-1">
        {translate("who_s_coming", "Who's coming?")}
      </h3>

      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-sm font-medium text-gray-800">
            {translate("guest", "Guest")}
          </h4>
          <p className="text-xs text-gray-500">
            {translate("count_of_guests", "Count of guests")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateValue(-1);
            }}
            className="w-8 h-8 text-lg rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            −
          </button>
          <span className="w-6 text-center text-sm font-semibold text-gray-800">
            {value}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              updateValue(1);
            }}
            className="w-8 h-8 text-lg rounded-full border border-gray-300 hover:bg-gray-100 transition-colors flex items-center justify-center"
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
