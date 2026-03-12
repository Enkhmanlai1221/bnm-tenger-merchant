"use client";
import { Form } from "@/components/ui/form";
import { AvatarField } from "@/components/ui/form/avatar-field";
import { TextField } from "@/components/ui/form/text-field";
import { Button } from "@heroui/react";
import * as yup from "yup";
import { useLanguage } from "@/providers/language";

const PersonalForm = ({
  isLoading,
  onSuccess,
  initialValues,
}: {
  isLoading: boolean,
  onSuccess: (values: any) => void;
  initialValues: any;
}) => {

  const { translate } = useLanguage();

  const formSchema = yup.object().shape({
    firstName: yup.string().required(translate("this_field_is_required", "This field is required!")),
    lastName: yup.string().required(translate("this_field_is_required", "This field is required!")),
    registerNo: yup.string().required(translate("this_field_is_required", "This field is required!")),
  });

  const onSubmit = (values: any) => {
    onSuccess(values);
  };

  return (
    <div>
      <Form
        initialValues={{
          avatar: initialValues.avatar,
          firstName: initialValues.firstName,
          lastName: initialValues.lastName,
          registerNo: initialValues.registerNo,
        }}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {({ handleSubmit, values }) => {
          return (
            <div className="p-4 space-y-6">
              <div className="flex justify-center">
                <div className="w-[141px] h-[141px] border rounded-full bg-gray-100 overflow-hidden">
                  <AvatarField name="avatar" />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <TextField
                  label={translate("last_name", "Last name")}
                  name="lastName"
                  placeholder={translate(
                    "please_enter_your_last_name",
                    "Please enter your last name",
                  )}
                  isRequired
                />
                <TextField
                  label={translate("first_name", "First name")}
                  name="firstName"
                  placeholder={translate(
                    "please_enter_your_first_name",
                    "Please enter your first name",
                  )}
                  isRequired
                />
                <TextField
                  label={translate("registration_number", "Registration number")}
                  name="registerNo"
                  placeholder={translate(
                    "please_enter_your_registration_number",
                    "Please enter your registration number",
                  )}
                  isRequired
                />
              </div>
              <Button
                variant="solid"
                type="button"
                color="primary"
                className="w-full mt-6"
                size="md"
                onPress={() => handleSubmit()}
                isLoading={isLoading}
              >
                Continue
              </Button>
            </div>
          );
        }}
      </Form >
    </div >
  );
};

PersonalForm.displayName = "PersonalForm";

export default PersonalForm;
