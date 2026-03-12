"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { addressApi } from "@/apis";
import { useField } from ".";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { IAddress } from "@/interfaces/address";

interface Props {
  name: string;
  label?: string;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  countryName?: string;
}

export function CountrySelectField({
  name,
  label,
  onChange: onChangeValue,
  placeholder,
  countryName,
}: Props) {
  const ref = useRef<any>(null);
  const { value, error, onChange } = useField(name);
  const showError = !!error && !value;
  const [search, setSearch] = useState(countryName || "");
  const [debouncedSearch] = useDebouncedValue(search, 400);
  const [selectedItem, setSelectedItem] = useState<IAddress | null>(null);

  const { data = [], isLoading } = useSWR(
    ["swr-country-select-list", debouncedSearch],
    async ([, q]) => {
      const res = await addressApi.list({ levels: [0], query: q || undefined });
      return res || [];
    },
    { keepPreviousData: true }
  );

  const selectedValueItem = data.find((i: IAddress) => i._id === value);
  const inputValue =
    search || selectedItem?.name || selectedItem?.nameEng || selectedValueItem?.name || selectedValueItem?.nameEng || "";

  const filteredOptions = data.filter((item: IAddress) => {
    if (!debouncedSearch) return !item.parent;
    const q = debouncedSearch.toLowerCase();
    return !item.parent && (
      (item.name?.toLowerCase().includes(q)) ||
      (item.nameEng?.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {label && <div className={showError ? "text-sm mb-1 text-red-500" : "text-sm mb-1"}>{label}</div>}
      <Autocomplete
        ref={ref}
        variant="bordered"
        placeholder={placeholder}
        isLoading={isLoading}
        defaultItems={filteredOptions}
        inputValue={inputValue}

        errorMessage={showError ? error : undefined}
        isInvalid={showError}
        allowsCustomValue={false}

        isRequired
        className="w-full"
        selectedKey={value || null}
        onInputChange={(val) => {
          setSearch(val);
          if (!val) {
            onChange("");
            setSelectedItem(null);
          }
        }}
        onSelectionChange={(option) => {
          const selectedId = option?.toString() || "";
          const found = data.find((i: IAddress) => i._id === selectedId) || null;
          setSelectedItem(found);
          onChange(selectedId);
          onChangeValue?.(selectedId);
          setSearch(found?.name);
        }}
      >
        {(item: IAddress) => {
          const displayName =
            item.name && item.nameEng
              ? `${item.name} (${item.nameEng})`
              : item.name || item.nameEng || "-";

          return (
            <AutocompleteItem key={item._id} textValue={displayName}>
              {displayName}
            </AutocompleteItem>
          );
        }}
      </Autocomplete>
    </div>
  );
}
