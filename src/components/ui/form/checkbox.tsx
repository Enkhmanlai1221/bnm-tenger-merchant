import { cn } from "@/utils";
import { useField } from ".";

type Props = {
  label: string;
  name: string;
  description?: string;
};

const Checkbox = ({ label, description, name }: Props) => {
  const { error, value, onChange } = useField(name);

  return (
    <div className="relative flex items-start">
      <div className="flex h-6 items-center">
        <input
          id={name}
          type="checkbox"
          // className={cn(
          //   "focus:ring-gray-500 h-5 w-5 text-gray-600 border-gray-300 rounded",
          //   error !== undefined
          //     ? "border-red-500 focus:border-red-500 focus:ring-red-500"
          //     : "border-gray-300 focus:border-gray-500 focus:ring-gray-500",
          // )}
          aria-describedby="comments-description"
          onChange={(e) => onChange(e.target.checked)}
          checked={!!value}
        />
      </div>
      <div className="ml-3 text-sm leading-6">
        <label htmlFor={name} className="text-gray-900">
          {label}
        </label>
        {description && (
          <p id="description" className="text-gray-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default Checkbox;
