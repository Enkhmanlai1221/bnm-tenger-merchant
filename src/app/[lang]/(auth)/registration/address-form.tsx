"use client";
import { userApi } from "@/apis";
import { Form } from "@/components/ui/form";
import { AutocompleteField } from "@/components/ui/form/autocomplete";
import { TextField } from "@/components/ui/form/text-field";
import { Button } from "@heroui/react";
import { useState } from "react";
import useSWR from "swr";
import * as yup from "yup";
import { useLanguage } from "@/providers/language";

const formSchema = yup.object().shape({});

const AddressForm = ({
  onSuccess,
  initialValues,
}: {
  onSuccess: (values: any) => void;
  initialValues: any;
}) => {
  const { translate } = useLanguage();

  const { data: countries } = useSWR("swr.countries", () =>
    userApi.getCountries(),
  );

  const [data] = useState({
    country: initialValues.country,
    city: initialValues.city,
    state: initialValues.state,
    postalCode: initialValues.postalCode,
  });

  const onSubmit = async (values: any) => {
    onSuccess(values);
  };
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold mb-4">
        {translate("address_title", "Address Information")}
      </span>
      <Form
        initialValues={data}
        onSubmit={onSubmit}
        validationSchema={formSchema}
      >
        {({ handleSubmit }) => {
          return (
            <div className="flex flex-col gap-4">
              <AutocompleteField
                label={translate("country", "Country")}
                name={"country"}
                placeholder={translate("select_country", "Country")}
                options={(countries || [])?.map((country: any) => ({
                  label: country.name,
                  value: country.name,
                }))}
              />
              <TextField
                label={translate("city", "City")}
                name={"city"}
                placeholder={translate("select_city", "City")}
              />
              <TextField
                label={translate("state", "State")}
                name={"state"}
                placeholder={translate("select_state", "State")}
              />
              <TextField
                label={translate("postal_code", "Postal Code")}
                name={"postalCode"}
                placeholder={translate("select_postal", "Postal Code")}
              />

              <Button
                type="button"
                variant="solid"
                className="w-full"
                size="md"
                color="primary"
                onPress={() => handleSubmit()}
              >
                {translate("start_explore", "Start Explore")}
              </Button>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

AddressForm.displayName = "AddressForm";

export default AddressForm;
