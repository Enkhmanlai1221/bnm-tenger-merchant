"use client";
import { authApi } from "@/apis";
import { Form } from "@/components/ui/form";
import { AvatarField } from "@/components/ui/form/avatar-field";
import { TextField } from "@/components/ui/form/text-field";
import { RootState } from "@/store";
import { message } from "@/utils/message";
import { Button, Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from "@heroui/react";
import { useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { useLanguage } from "@/providers/language";
import { IconBuildingBank } from "@tabler/icons-react";
import { ErrorMessage } from "@/utils/http/http-handler";
import { SelectField } from "../ui/form/select-field";

const PersonalProfileForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const { translate } = useLanguage();
  const { user } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const formSchema = yup.object().shape({
    firstName: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    lastName: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
    registerNo: yup
      .string()
      .required(translate("this_field_is_required", "This field is required")),
  });

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await authApi.updateProfile(values);
      await authApi.me();
      message.success(
        translate(
          "profile_updated_successfully",
          "Profile updated successfully",
        ),
      );
      onSuccess?.();
    } catch (error) {
      message.error((error as ErrorMessage).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form
        initialValues={{
          avatar: user?.avatar?.url,
          firstName: user?.firstName,
          lastName: user?.lastName,
          registerNo: user?.registerNo,
          phone: user?.phone,
        }}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {() => {
          return (
            <div className="flex flex-col gap-y-6">
              <div className="flex flex-col lg:flex-row w-full gap-6">
                <div className="flex-none flex flex-col items-center">
                  <div className="w-[160px] h-[160px] border rounded-full bg-gray-100 overflow-hidden">
                    <AvatarField name="avatar" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="border-b border-gray-200 pb-3 mb-5">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-y-1">
                        <div className="text-sm font-medium">{user?.code}</div>
                        <div className="text-sm text-gray-500">{user?.email}</div>
                      </div>
                      <Button
                        variant="solid"
                        size="sm"
                        startContent={<IconBuildingBank size={16} />}
                        onPress={onOpen}
                      >
                        {translate("bank_account_update", "Bank Account Update")}
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                    <TextField
                      isRequired
                      label={translate("last_name", "Last name")}
                      name="lastName"
                      placeholder={translate("please_enter_your_last_name", "Please enter your last name")}
                    />
                    <TextField
                      isRequired
                      label={translate("first_name", "First name")}
                      name="firstName"
                      placeholder={translate("please_enter_your_first_name", "Please enter your first name")}
                    />
                    <TextField
                      label={translate("registration_number", "Registration number")}
                      name="registerNo"
                      placeholder={translate("please_enter_your_registration_number", "Please enter your registration number")}
                      isRequired
                    />
                    <TextField
                      label={translate("phone", "Phone")}
                      name="phone"
                      placeholder={translate("please_enter_your_phone_number", "Please enter your phone number")}
                    />
                    <SelectField
                      label={translate("gender", "Gender")}
                      name="gender"
                      placeholder={translate("please_select_your_gender", "Please select your gender")}
                      options={[
                        { value: "MALE", label: translate("male", "Male") },
                        { value: "FEMALE", label: translate("female", "Female") },
                      ]}
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end sticky bottom-0 bg-white border-t border-gray-200">
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
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            {translate("bank_account_update", "Bank Account Update")}
          </ModalHeader>
          <ModalBody>

          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

PersonalProfileForm.displayName = "PersonalProfileForm";

export default PersonalProfileForm;
