"use client";

import { merchantApi } from "@/apis";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/form/text-field";
import { useLanguage } from "@/providers/language";
import { RootState } from "@/store";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useSWRConfig } from "swr";
import { useRouter } from "next/navigation";


interface Props {
  onSuccess?: () => void;
  type?: string;
  firstStep?: () => void;
  midStep?: () => void;
}

const BankAccountUpdateForm = ({ onSuccess, type, firstStep, midStep }: Props) => {
  const router = useRouter();
  const { translate } = useLanguage();
  const { mutate: mutateSWR } = useSWRConfig();
  const { user, accessToken } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = yup.object().shape({
    bank: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    bankAccount: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    bankAccountName: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);

    try {
      await merchantApi.bankAccountUpdate(values);

      mutateSWR(`swr.user.${JSON.stringify(accessToken)}`);
      onSuccess?.();

      if (type === "registration") {
        if (!user?.firstName) {
          firstStep?.();
        } else if (!user?.contract) {
          midStep?.();
        } else {
          router.push("/");
        }
      }

      message.success(
        translate(
          "bank_account_updated_successfully",
          "Bank account updated successfully"
        )
      );


    } catch (error) {
      errorParse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form
      initialValues={{
        bank: user?.bank || "",
        bankAccount: user?.bankAccount || "",
        bankAccountName: user?.bankAccountName || "",
      }}
      validationSchema={formSchema}
      onSubmit={onSubmit}
    >
      {() => {
        return (
          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col gap-y-4 w-full">
              <TextField
                label={translate("bank", "Bank")}
                isRequired
                name="bank"
                placeholder={translate(
                  "please_select_your_bank",
                  "Please select your bank",
                )}
              />
              <TextField
                isRequired
                label={translate("bank_account_number", "Bank account number")}
                name="bankAccount"
                placeholder={translate(
                  "please_enter_your_bank_account_number",
                  "Please enter your bank account number",
                )}
              />
              <TextField
                isRequired
                label={translate(
                  "bank_account_holder_name",
                  "Bank account holder name",
                )}
                name="bankAccountName"
                placeholder={translate(
                  "please_enter_your_bank_account_holder_name",
                  "Please enter your bank account holder name",
                )}
              />
            </div>
            <div className="pt-3 flex justify-end">
              <Button
                variant="solid"
                type="submit"
                color="primary"
                size="md"
                isLoading={isLoading}
              >
                <span>{translate("save", "Save")}</span>
              </Button>
            </div>
          </div>
        );
      }}
    </Form>
  );
};

BankAccountUpdateForm.displayName = "BankAccountUpdateForm";

export default BankAccountUpdateForm;
