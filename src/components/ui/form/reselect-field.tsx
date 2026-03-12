import { useField } from ".";
import Select, { SingleValue, MultiValue, ActionMeta } from "react-select";

interface Option {
  label: string;
  value: any;
}

interface ReselectFieldProps {
  label?: string;
  name: string;
  options: Option[];
  isMulti?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
}

export const ReselectField = ({
  label,
  name,
  options,
  isMulti = false,
  placeholder = "Select...",
  isSearchable = true,
  isClearable = true,
}: ReselectFieldProps) => {
  const { value, onChange, error } = useField(name, isMulti);

  const handleChange = (
    selected: SingleValue<Option> | MultiValue<Option>,
    _actionMeta: ActionMeta<Option>,
  ) => {
    if (isMulti) {
      onChange((selected as Option[])?.map((option) => option.value) || []);
    } else {
      onChange((selected as Option)?.value);
    }
  };

  const getValue = () => {
    if (isMulti) {
      return options.filter((option) =>
        (value as any[])?.includes(option.value),
      );
    }
    return options.find((option) => option.value === value);
  };

  return (
    <div>
      {label && <div className="text-sm">{label}</div>}
      <Select
        value={getValue()}
        onChange={handleChange}
        options={options}
        isMulti={isMulti}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        styles={{
          control: (base) => ({
            ...base,
            borderColor: error ? "red" : base.borderColor,
          }),
          menu(base, props) {
            return {
              ...base,
              zIndex: 1000,
            };
          },
        }}
      />
      {error && <div className="error">{error}</div>}
    </div>
  );
};
