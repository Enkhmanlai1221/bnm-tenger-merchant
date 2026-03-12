import { merchantApi } from "@/apis";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/form/text-field";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from "@heroui/react";
import { useState } from "react";
import * as yup from "yup";
import { useLanguage } from "@/providers/language";
import { IconTrash, IconX } from "@tabler/icons-react";

const formSchema = yup.object().shape({
  price: yup
    .number()
    .typeError("Please enter your price!")
    .required("Please enter your price!"),
});

export function PriceDateForm({
  propertyId,
  selectedDate,
  price,
  basePrice,
  onSuccess,
  blockedQuantity = 0,
}: {
  propertyId: string;
  selectedDate: any;
  price: number;
  basePrice: number;
  onSuccess?: () => void;
  blockedQuantity: number;
}) {
  const { translate } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await merchantApi.propertyCalendar(propertyId, {
        date: selectedDate.toISOString(),
        price: values.price,
        blockedQuantity: blockedQuantity,
      });

      message.success("Price updated successfully");
      onSuccess?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveAmount = async () => {
    setIsLoading(true);
    try {
      await merchantApi.propertyCalendar(propertyId, {
        date: selectedDate.toISOString(),
        price: null,
        blockedQuantity: blockedQuantity,
      });
      message.success("Price updated successfully");
      onSuccess?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setIsLoading(false);
    }
  }


  return (
    <>
      <Form
        initialValues={{
          price: price ? price : basePrice,
        }}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {() => {
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-md font-large">{translate("price", "price")}</label>
                {price !== null &&
                  <button type="button" className="text-red-500 hover:text-red-700" onClick={onOpen} disabled={isLoading}>
                    <IconTrash size={16} />
                  </button>
                }
              </div>
              <TextField
                type="number"
                label=""
                name="price"
                placeholder="Price"
              />
              <Button type="submit" color="primary" isLoading={isLoading}>
                {translate("update_price", "Update price")}
              </Button>
            </div>
          );
        }}
      </Form>
      <Modal isOpen={isOpen} size="md" radius="sm" onClose={onClose} hideCloseButton>
        <ModalContent className="shadow-lg rounded-xl">
          <ModalHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-md font-bold">
                {translate("warning", "Warning")}
              </h2>
            </div>
            <button type="button" className="text-gray-500 hover:text-gray-700" onClick={onClose}>
              <IconX size={16} />
            </button>
          </ModalHeader>
          <ModalBody>
            <p className="text-md text-gray-500">
              {translate(
                "you_are_about_to_delete_the_discount_amount_for_this_day_are_you_sure",
                "You are about to delete the discount amount for this day. Are you sure"
              )}
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button color="danger" variant="light" onPress={onClose}>
              {translate("no", "No")}
            </Button>
            <Button color="primary" onPress={onRemoveAmount}>
              {translate("yes", "Yes")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
