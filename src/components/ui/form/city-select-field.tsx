"use client";

import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
import { addressApi } from "@/apis";
import { useField } from ".";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { IAddress } from "@/interfaces/address";

interface Props {
  name: string;
  onChange?: (value: string | null) => void;
  placeholder?: string;
  countryId?: string | null;
  label: string;
  cityName?: string;
}

export function CitySelectField({
  name,
  onChange: onChangeValue,
  placeholder,
  countryId,
  label,
  cityName,
}: Props) {
  const { value, error, onChange } = useField(name);
  const showError = !!error && !value;
  const [search, setSearch] = useState(cityName || "");
  const [debouncedSearchRaw] = useDebouncedValue(search, 400);
  const [selectedItem, setSelectedItem] = useState<IAddress | null>(null);

  const shouldFetch = Boolean(countryId);

  const { data = [], isLoading } = useSWR(
    countryId ? ["swr-city-select", countryId, debouncedSearchRaw] : null,
    async () => {
      const res = await addressApi.list({
        levels: [1],
        query: debouncedSearchRaw || undefined,
        parent: countryId!,
      });
      return res || [];
    },
    { keepPreviousData: true }
  );

  useEffect(() => {
    setSearch("");
    setSelectedItem(null);
    onChange("");
  }, [countryId]);

  useEffect(() => {
    if (cityName && !value && !selectedItem) {
      setSearch(cityName);
    }
  }, [cityName, value, selectedItem]);

  const inputValue =
    shouldFetch
      ? search ||
      selectedItem?.name ||
      data.find((i: IAddress) => i._id === value)?.name ||
      ""
      : "";

  return (
    <div>
      {label && (
        <div className={showError ? "text-sm mb-1 text-red-500" : "text-sm mb-1"}>
          {label}
        </div>
      )}
      <Autocomplete
        key={countryId}
        variant="bordered"
        placeholder={placeholder}
        isLoading={isLoading}
        defaultItems={data}
        selectedKey={value || null}
        inputValue={inputValue}
        onInputChange={(val) => {
          setSearch(val);
          if (!val) {
            onChange("");
            setSelectedItem(null);
          }
        }}
        onSelectionChange={(option) => {
          if (!countryId) return;
          const selectedId = option?.toString() || "";
          const found = data.find((i: IAddress) => i._id === selectedId) || null;
          setSelectedItem(found);
          onChange(selectedId);
          onChangeValue?.(selectedId);
          setSearch("");
        }}
        errorMessage={showError ? error : undefined}
        isInvalid={showError}
        allowsCustomValue={false}
        isDisabled={!countryId}
        className="w-full"
        isRequired
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

