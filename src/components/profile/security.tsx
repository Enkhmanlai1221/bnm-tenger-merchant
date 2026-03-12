"use client";

import { useLanguage } from "@/providers/language";
import {
  Button,
  Modal,
  ModalHeader,
  ModalContent,
  ModalBody,
} from "@heroui/react";
import { useState } from "react";
import { ChangePasswordForm } from "./change-password-form";
import { DeactiveAccount } from "./deactive-account";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { IconX } from "@tabler/icons-react";
import { EmailChangeForm } from "./change-email-form";
import { PhoneChangeForm } from "./change-phone-form";

const Security = () => {
  const { translate } = useLanguage();
  const [action, setAction] = useState<string[]>([]);
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
      <section className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-200">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-100 text-blue-600">
              <i className="ti ti-lock text-lg"></i>
            </div>
            <span className="text-md font-semibold">
              {translate("password", "Password")}
            </span>
          </div>
          <Button
            onPress={() => setAction(["change-password"])}
            variant="light"
            className="self-start w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors border border-blue-600 text-blue-600 bg-blue-50 hover:bg-blue-100"
          >
            {translate("change_password", "Change password")}
          </Button>

          <p className="text-sm text-gray-600 leading-relaxed">
            {translate(
              "change_your_password_with_old_password",
              "Change your password with old password"
            )}.
          </p>
        </div>
      </section>

      <section className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-200">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-red-100 text-danger-500">
              <i className="ti ti-user-x text-lg"></i>
            </div>
            <span className="text-md font-semibold">
              {translate("account", "Account")}
            </span>
          </div>
          <Button
            onPress={() => setAction(["deactive-account"])}
            variant="light"
            className="self-start w-full rounded-lg px-4 py-2 text-sm font-medium transition-colors border border-danger text-danger bg-danger-50 hover:bg-danger-100"
          >
            {translate("deactive_account", "Deactivate account")}
          </Button>
          <p className="text-sm text-gray-600 leading-relaxed">
            {translate(
              "you_can_delete_your_account_from_our_database",
              "You can delete your account from our database"
            )}.
          </p>
        </div>
      </section>

      <section className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-200">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 text-primary">
              <i className="ti ti-phone text-lg"></i>
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              {translate("change_phone", "Change phone")}
            </h3>
          </div>
          {user?.phone ? (
            <div className="flex items-center justify-between gap-3 border border-green-300 bg-green-50 rounded-lg px-4 py-2 h-12">
              <span className="text-sm font-medium text-primary">
                {user.phone}
              </span>
              <Button
                onPress={() => setAction(["phone"])}
                size="sm"
                variant="light"
                className="text-primary hover:text-green-800 bg-green-100 transition-colors"
              >
                {translate("change", "Change")}
              </Button>
            </div>
          ) : (
            <Button
              onPress={() => setAction(["phone"])}
              variant="light"
              className="text-primary hover:text-green-800 hover:bg-green-100 transition-colors w-full"
            >
              {translate("add_phone_number", "Add phone number")}
            </Button>
          )}
          <p className="text-sm text-gray-600 leading-relaxed">
            {translate(
              "changing_your_login_phone_number",
              "Changing your login phone number"
            )}.
          </p>
        </div>
      </section>

      <section className="group relative flex flex-col justify-between gap-4 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-6 shadow-sm transition-all duration-200">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-green-100 text-primary">
              <i className="ti ti-phone text-lg"></i>
            </div>
            <h3 className="text-base font-semibold text-gray-800">
              {translate("change_email", "Change email")}
            </h3>
          </div>

          {user?.email ? (
            <div className="border border-green-300 bg-green-50 rounded-lg p-3">
              <div className="text-sm font-medium text-primary break-all">
                {user.email}
              </div>
              <Button
                onPress={() => setAction(["email"])}
                size="sm"
                variant="light"
                className="mt-2 text-primary hover:text-green-800 bg-green-100 transition-colors w-full"
              >
                {translate("change", "Change")}
              </Button>
            </div>
          ) : (
            <Button
              onPress={() => setAction(["email"])}
              variant="light"
              className="text-primary hover:text-green-800 hover:bg-green-100 transition-colors w-full"
            >
              {translate("add_email", "Add email")}
            </Button>
          )}
          <p className="text-sm text-gray-600 leading-relaxed">
            {translate(
              "change_email_log",
              "You are about to change the email address used to log in to the system"
            )}.
          </p>
        </div>
      </section>

      <Modal
        size="md"
        isOpen={action[0] === "change-password"}
        onClose={() => setAction([])}
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <h2 className="flex text-xl font-medium mt-4 mb-6">
                  {translate("change_passwords", "Change passwords")}
                </h2>
              </ModalHeader>
              <ModalBody className="pb-6">
                <ChangePasswordForm onSuccess={() => setAction([])} />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
      <Modal
        size="md"
        isOpen={action[0] === "deactive-account"}
        onClose={() => setAction([])}
      >
        <ModalContent>
          {() => (
            <ModalBody className="pb-6">
              <DeactiveAccount onClose={() => setAction([])} />
            </ModalBody>
          )}
        </ModalContent>
      </Modal>

      <Modal
        size="md"
        isOpen={action[0] === "phone"}
        hideCloseButton
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {translate("change_phone", "Change phone")}
                  </span>

                  <button
                    onClick={() => setAction([])}
                    className="p-0 m-0 bg-transparent hover:bg-transparent focus:outline-none focus:bg-transparent active:bg-transparent"
                    aria-label={translate("close", "Close")}
                  >
                    <IconX size={16} className="text-gray-600 dark:text-gray-200" />
                  </button>
                </div>
              </ModalHeader>
              <ModalBody className="pb-6">
                <PhoneChangeForm
                  onClose={() => setAction([])}
                  phone={user?.phone}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        size="md"
        isOpen={action[0] === "email"}
        hideCloseButton
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader>
                <div className="flex items-center justify-between w-full">
                  <span className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {translate("username_change", "Username change")}
                  </span>

                  <button
                    onClick={() => setAction([])}
                    className="p-0 m-0 bg-transparent hover:bg-transparent focus:outline-none focus:bg-transparent active:bg-transparent"
                    aria-label={translate("close", "Close")}
                  >
                    <IconX size={16} className="text-gray-600 dark:text-gray-200" />
                  </button>
                </div>
              </ModalHeader>

              <ModalBody className="pb-6">
                <EmailChangeForm
                  onClose={() => setAction([])}
                  email={user?.email}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

Security.displayName = "Security";

export default Security;
