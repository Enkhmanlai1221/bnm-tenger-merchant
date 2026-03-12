"use client";
import { CustomRadio } from "@/components/ui/custom-radio";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/form/text-field";
import { ErrorMessage } from "@/utils/http/http-handler";
import { message } from "@/utils/message";
import { Button, RadioGroup } from "@heroui/react";
import { useState } from "react";
import * as yup from "yup";
import { useLanguage } from "@/providers/language";

const formSchema = yup.object().shape({
  merchantType: yup.string().required("Please select your merchant type!"),
  registerNo: yup.string().required("Please enter your registration number!"),
});

const MerchantTypeForm = ({
  onSuccess,
  initialValues,
}: {
  onSuccess: (values: any) => void;
  initialValues: any;
}) => {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [data] = useState({
    merchantType: initialValues.merchantType,
    registerNo: initialValues.registerNo,
  });

  const onSubmit = async (values: any) => {
    try {
      setLoading(true);
      onSuccess(values);
      // message.success("Амжилттай нэвтэрлээ.");
    } catch (err) {
      message.error((err as ErrorMessage).message);
    } finally {
      setLoading(false);
    }
  };

  const options = [
    { label: translate("individual", "Individual"), value: "INDIVIDUAL" },
    { label: translate("organization", "Organization"), value: "ORGANIZATION" },
  ];
  return (
    <div className="flex flex-col">
      <span className="text-2xl font-semibold mb-4">
        {translate("merchant_type", "Merchant type")}
      </span>
      <Form
        initialValues={data}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values, setFieldValue, errors }) => {
          return (
            <div className="space-y-4">
              <div className="flex flex-col gap-6">
                <fieldset>
                  <legend className="text-sm/6 font-semibold text-gray-900">
                    {translate("merchant_type", "Merchant type")}
                  </legend>
                  <RadioGroup
                    name="merchantType"
                    orientation="horizontal"
                    classNames={{
                      wrapper: "flex flex-col items-center justify-center",
                    }}
                    isInvalid={!!errors.merchantType}
                    errorMessage={errors.merchantType}
                    value={values.merchantType}
                    onValueChange={(value) => {
                      setFieldValue("merchantType", value);
                    }}
                  >
                    {options.map((option) => (
                      <CustomRadio key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          <span className="leading-4 text-sm">
                            {option.label}
                          </span>
                        </div>
                      </CustomRadio>
                    ))}
                  </RadioGroup>
                </fieldset>
                <TextField
                  isRequired
                  label={
                    values.merchantType === "ORGANIZATION"
                      ? translate(
                        "organization_registration_number",
                        "Organization registration number",
                      )
                      : translate("registration_number", "Registration number")
                  }
                  name="registerNo"
                  placeholder={
                    values.merchantType === "ORGANIZATION"
                      ? translate(
                        "please_enter_your_organization_registration_number",
                        "Please enter your organization registration number",
                      )
                      : translate(
                        "please_enter_your_registration_number",
                        "Please enter your registration number",
                      )
                  }
                />
              </div>
              <Button
                onPress={() => handleSubmit()}
                type="button"
                variant="solid"
                className="w-full"
                size="md"
                isLoading={loading}
                color="primary"
              >
                {translate("continue", "Continue")}
              </Button>
            </div>
          );
        }}
      </Form>
    </div>
  );
};

MerchantTypeForm.displayName = "MerchantTypeForm";

export default MerchantTypeForm;
