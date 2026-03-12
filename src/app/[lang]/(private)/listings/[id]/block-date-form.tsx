import { merchantApi } from "@/apis";
import { Form } from "@/components/ui/form";
import { TextField } from "@/components/ui/form/text-field";
import { errorParse } from "@/utils/error-parse";
import { message } from "@/utils/message";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
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

export function BlockDateForm({
  propertyId,
  selectedDate,
  blockedQuantity = 0,
  onSuccess,
  price,
  basePrice,
}: {
  propertyId: string;
  selectedDate: any;
  blockedQuantity: number;
  onSuccess?: () => void;
  price: number;
  basePrice: number;
}) {
  const { translate } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const onSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      await merchantApi.propertyCalendar(propertyId, {
        date: selectedDate.toISOString(),
        price: price ? price : basePrice,
        blockedQuantity: parseInt(values.blockedQuantity, 10),
      });

      message.success(
        translate(
          "blocked_date_updated_successfully",
          "Blocked date updated successfully",
        ),
      );
      onSuccess?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRemoveDatelock = async () => {
    setIsLoading(true);
    try {
      await merchantApi.propertyCalendar(propertyId, {
        date: selectedDate.toISOString(),
        price: price ? price : basePrice,
        blockedQuantity: 0,
      });

      message.success(
        translate(
          "blocked_date_updated_successfully",
          "Blocked date updated successfully",
        ),
      );
      onSuccess?.();
      onClose?.();
    } catch (error) {
      errorParse(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Form
        initialValues={{
          blockedQuantity: blockedQuantity,
        }}
        validationSchema={formSchema}
        onSubmit={onSubmit}
      >
        {() => {
          return (
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-lg font-large">
                  {translate(
                    "number_of_locked_houses",
                    "Number of locked houses",
                  )}
                </label>
                {blockedQuantity !== 0 && (
                  <button
                    type="button"
                    className="text-red-500 hover:text-red-700"
                    onClick={onOpen}
                    disabled={isLoading}
                  >
                    <IconTrash size={16} />
                  </button>
                )}
              </div>
              <TextField
                type="number"
                label=""
                name="blockedQuantity"
                placeholder={translate("blocked_quantity", "Blocked quantity")}
                min={0}
              />
              <Button type="submit" color="primary" isLoading={isLoading}>
                {translate(
                  "update_number_of_locked_houses",
                  "Update number of locked houses",
                )}
              </Button>
            </div>
          );
        }}
      </Form>
      <Modal
        isOpen={isOpen}
        size="md"
        radius="sm"
        onClose={onClose}
        hideCloseButton
      >
        <ModalContent className="shadow-lg rounded-xl">
          <ModalHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground text-md font-bold">
                {translate("warning", "Warning")}
              </h2>
            </div>
            <button
              type="button"
              className="text-gray-500 hover:text-gray-700"
              onClick={onClose}
            >
              <IconX size={16} />
            </button>
          </ModalHeader>
          <ModalBody>
            <p className="text-md text-gray-500">
              {translate("canceling_close_day", "Canceling close day")}
            </p>
          </ModalBody>
          <ModalFooter className="flex justify-end">
            <Button color="danger" variant="light" onPress={onClose}>
              {translate("no", "No")}
            </Button>
            <Button color="primary" onPress={onRemoveDatelock}>
              {translate("yes", "Yes")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
