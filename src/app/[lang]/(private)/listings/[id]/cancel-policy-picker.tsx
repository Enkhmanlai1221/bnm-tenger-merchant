import { stayApi } from "@/apis";
import { ICancelPolicy } from "@/interfaces/cancel-policy";
import { useLanguage } from "@/providers/language";
import { cn } from "@/utils";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Select,
  SelectItem,
  Spinner,
  useDisclosure,
} from "@heroui/react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import useSWR from "swr";

export function CancelPolicyPicker({
  value = [],
  onChange,
  error,
}: {
  value: ICancelPolicy[];
  error: {
    [key: string]: string;
  };
  onChange: (value: any[]) => void;
}) {
  const { translate } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chnageLoader, setChnageLoader] = useState(false);
  const valueReloader = () => {
    setChnageLoader(true);
    setTimeout(() => {
      setChnageLoader(false);
    }, 300);
  };

  const { data: cancelPolicies } = useSWR(
    "swr.ref.cancel-policies",
    () => stayApi.getCancelPolicies(),
    {
      revalidateOnFocus: false,
      fallbackData: [],
    },
  );

  const noRefund =
    value.length === cancelPolicies.length &&
    value.every((item) => parseInt(`${item.rate}`, 10) === 0);

  const hasError = useMemo(() => {
    return Object.keys(error).some((key) => key.includes("cancelPolicies"));
  }, [error]);

  return (
    <div className={cn("group/input", hasError && "data-invalid")}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="block subpixel-antialiased text-small group-data-[required=true]/input:after:content-['*'] group-data-[required=true]/input:after:text-danger group-data-[required=true]/input:after:ml-0.5 group-data-[invalid=true]/input:text-danger w-full text-foreground">
          {translate("cancel_policies", "Cancel Policies")}
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-2">
          <Button
            type="button"
            variant={noRefund ? "solid" : "bordered"}
            color={noRefund ? "primary" : "default"}
            size="sm"
            onPress={() => {
              onChange(
                cancelPolicies.map((item, index) => ({
                  cancelPolicy: item,
                  rate: "0",
                  _id: `${index}_${item._id}`,
                })),
              );
              valueReloader();
            }}
          >
            <div className="text-sm/4">
              {translate("no_refund", "No refund")}
            </div>
          </Button>
          <Button
            color="primary"
            variant="bordered"
            size="sm"
            className="w-72"
            startContent={
              <div>
                <IconPlus size={16} />
              </div>
            }
            onPress={onOpen}
          >
            {translate("add_cancel_policy", "Add Cancel Policy")}
          </Button>
        </div>
      </div>

      {value.length ? (
        <div className="grid grid-cols-12 gap-4">
          {value.map((item, index) => {
            if (!item.cancelPolicy) {
              return null;
            }
            return (
              <div key={item._id} className="col-span-12 md:col-span-3">
                <div
                  className={cn(
                    "flex flex-col items-center border border-gray-200 rounded-md",
                  )}
                >
                  <div className="flex w-full justify-between items-center gap-2 px-2 py-2">
                    <div className="text-sm/4">{item.cancelPolicy.name}</div>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="bordered"
                      size="sm"
                      onPress={() => {
                        onChange(
                          value.filter(
                            (a) => a.cancelPolicy._id !== item.cancelPolicy._id,
                          ),
                        );
                      }}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                  <div className="flex w-full items-center justify-center gap-2 px-2 py-2">
                    {chnageLoader ? (
                      <Spinner size="sm" />
                    ) : (
                      <Select
                        isInvalid={
                          !!error[`cancelPolicies[${index}].rate`] && !item.rate
                        }
                        errorMessage={error[`cancelPolicies[${index}].rate`]}
                        className="max-w-xs"
                        aria-label={translate(
                          "select_cancel_policy",
                          "Select Cancel Policy",
                        )}
                        placeholder={translate(
                          "select_cancel_policy",
                          "Select Cancel Policy",
                        )}
                        selectedKeys={[item.rate]}
                        variant="bordered"
                        onSelectionChange={(key) => {
                          onChange(
                            value.map((a) =>
                              a.cancelPolicy._id === item.cancelPolicy._id
                                ? { ...a, rate: key.currentKey }
                                : a,
                            ),
                          );
                        }}
                      >
                        {item.cancelPolicy.variants.map((variant) => (
                          <SelectItem key={variant}>{`${variant}% ${item.cancelPolicy.defaultVariant === variant
                            ? ` (${translate("default", "Default")})`
                            : ""
                            }`}</SelectItem>
                        ))}
                      </Select>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="col-span-12 md:col-span-3">
          {/* <div className="flex flex-col justify-center items-center h-full min-h-[100px]">
            <div className="flex justify-center items-center">
              <p className="text-md text-red-400">
                {translate(
                  "no_cancel_policy_tips",
                  "User will get 100% refund if merchant has no cancel policy",
                )}
              </p>
            </div>
            <p className="text-md text-gray-500">
              {translate("no_cancel_policy", "No cancel policy")}
            </p>
          </div> */}
          <div className="flex flex-col h-auto bg-red-50 border border-red-200 rounded-lg p-2">
            <p className="text-sm leading-snug text-center w-full text-red-400">
              {translate(
                "no_cancel_policy_tips",
                "User will get 100% refund if merchant has no cancel policy",
              )}
            </p>
          </div>
        </div>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-foreground text-sm font-bold">
              {translate(
                "add_remove_cancel_policy",
                "Add/Remove Cancel Policy",
              )}
            </h2>
          </ModalHeader>
          <ModalBody className="pb-6">
            <div className="flex flex-col gap-2">
              {cancelPolicies.map((item, index) => (
                <button
                  type="button"
                  key={item._id}
                  className={cn(
                    "flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-gray-200",
                    value.some((a) => a.cancelPolicy?._id === item._id)
                      ? "border-primary bg-primary/10"
                      : "",
                  )}
                  onClick={() => {
                    if (value.some((a) => a.cancelPolicy?._id === item._id)) {
                      onChange(
                        value.filter((a) => a.cancelPolicy?._id !== item._id),
                      );
                    } else {
                      onChange([
                        ...value,
                        {
                          cancelPolicy: item,
                          rate: "",
                          _id: `${index}_${item._id}`,
                        },
                      ]);
                    }
                  }}
                >
                  <div className="text-sm/4">{item.name}</div>
                </button>
              ))}
              <Button
                color="primary"
                variant="bordered"
                size="sm"
                onPress={onClose}
              >
                {translate("close", "Close")}
              </Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
