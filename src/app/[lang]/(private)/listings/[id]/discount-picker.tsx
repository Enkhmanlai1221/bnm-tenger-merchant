import { stayApi } from "@/apis";
import { DISCOUNT_TYPES, IDiscount } from "@/interfaces/discount";
import { useLanguage } from "@/providers/language";
import { cn } from "@/utils";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useMemo } from "react";
import useSWR from "swr";

export function DiscountPicker({
  value = [],
  onChange,
  error,
}: {
  value: IDiscount[];
  error: {
    [key: string]: string;
  };
  onChange: (value: IDiscount[]) => void;
}) {
  const { translate } = useLanguage();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data: discountTypes } = useSWR(
    "swr.ref.discount-types",
    () => stayApi.getDiscountTypes(),
    {
      revalidateOnFocus: false,
      fallbackData: [],
    },
  );

  const hasError = useMemo(() => {
    return Object.keys(error).some((key) => key.includes("discounts"));
  }, [error]);

  return (
    <div className={cn("group/input", hasError && "data-invalid")}>
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h2 className="block subpixel-antialiased text-small group-data-[required=true]/input:after:content-['*'] group-data-[required=true]/input:after:text-danger group-data-[required=true]/input:after:ml-0.5 group-data-[invalid=true]/input:text-danger w-full text-foreground">
          {translate("discounts", "Discounts")}
        </h2>
        <Button
          color="primary"
          variant="bordered"
          size="sm"
          className="w-48"
          startContent={
            <div>
              <IconPlus size={16} />
            </div>
          }
          onPress={onOpen}
        >
          {translate("add_discount", "Add Discount")}
        </Button>
      </div>
      {value.length ? (
        <div className="grid grid-cols-12 gap-4">
          {value.map((item, index) => {
            const deleted = item.discountType.deletedAt;
            return (
              <div key={item._id} className="col-span-12 md:col-span-3">
                <div
                  className={cn(
                    "flex flex-col items-center border border-gray-200 rounded-md",
                    deleted ? "opacity-50 cursor-not-allowed select-none" : "",
                  )}
                >
                  <div className="flex w-full justify-between items-center gap-2 px-2 py-2">
                    <div className="text-sm/4">
                      {
                        {
                          [DISCOUNT_TYPES.DAY]: (
                            <div className="flex gap-x-2">
                              <span>{item.discountType.value}</span>
                              <span>
                                {translate(
                                  "or_more_nights_of_booking",
                                  "or more nights of booking",
                                )}
                              </span>
                            </div>
                          ),
                          [DISCOUNT_TYPES.ORDER]: (
                            <span>
                              {translate("first", "First")}{" "}
                              {item.discountType.value}{" "}
                              {translate("order", "order")}
                            </span>
                          ),
                        }[item.discountType.type]
                      }
                    </div>
                    <Button
                      isIconOnly
                      color="danger"
                      variant="bordered"
                      size="sm"
                      onPress={() => {
                        onChange(
                          value.filter(
                            (a) => a.discountType._id !== item.discountType._id,
                          ),
                        );
                      }}
                    >
                      <IconTrash size={16} />
                    </Button>
                  </div>
                  <div className="flex w-full items-center gap-2 px-2 py-2">
                    {/* <TextField
                      aria-label={`${translate("rate", "Rate")}`}
                      disabled={!!deleted}
                      name={`discounts[${index}].rate`}
                      placeholder={translate("rate", "Rate")}
                      labelPlacement="outside"
                      endContent="%"
                    /> */}
                    <Input
                      aria-label={`${translate("rate", "Rate")}`}
                      variant="bordered"
                      isInvalid={!!error[`discounts[${index}].rate`]}
                      errorMessage={error[`discounts[${index}].rate`]}
                      value={item.rate.toString()}
                      onChange={(e) => {
                        onChange(
                          value.map((a) =>
                            a._id === item._id
                              ? { ...a, rate: parseInt(e.target.value) }
                              : a,
                          ),
                        );
                      }}
                      type="number"
                      endContent="%"
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="col-span-12 md:col-span-3">
          <div className="flex justify-center items-center h-full min-h-[100px]">
            <p className="text-sm/4 text-gray-500">
              {translate("no_discount", "No discount")}
            </p>
          </div>
        </div>
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>
            <h2 className="text-foreground text-sm font-bold">
              {translate("add_remove_discount", "Add/Remove Discount")}
            </h2>
          </ModalHeader>
          {/* <ModalBody className="pb-6">
            <div className="flex flex-col gap-2">
              {discountTypes.map((item, index) => (
                <button
                  type="button"
                  key={item._id}
                  className={cn(
                    "flex items-center gap-2 p-4 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors duration-200 border-gray-200",
                    value.some((a) => a.discountType._id === item._id)
                      ? "border-primary bg-primary/10"
                      : "",
                  )}
                  onClick={() => {
                    if (value.some((a) => a.discountType._id === item._id)) {
                      onChange(
                        value.filter((a) => a.discountType._id !== item._id),
                      );
                    } else {
                      onChange([
                        ...value,
                        {
                          discountType: item,
                          rate: 0,
                          _id: `${index}_${item._id}`,
                        },
                      ]);
                    }
                  }}
                >
                  <div className="text-sm/4">
                    {
                      {
                        [DISCOUNT_TYPES.DAY]: (
                          <div className="flex gap-x-2">
                            <span>{item.value}</span>
                            <span>
                              {translate(
                                "or_more_nights_of_booking",
                                "or more nights of booking",
                              )}
                            </span>
                          </div>
                        ),
                        [DISCOUNT_TYPES.ORDER]: (
                          <span>
                            {translate("first", "First")} {item.value}{" "}
                            {translate("order", "order")}
                          </span>
                        ),
                      }[item.type]
                    }
                  </div>
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
          </ModalBody> */}
        </ModalContent>
      </Modal>
    </div>
  );
}
