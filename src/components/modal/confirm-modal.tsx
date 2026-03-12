import { createContext, useContext, ReactNode, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

type ConfirmModalProps = {
  title: string;
  description: string;
  onConfirm: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  onCancel?: () => void;
};

type ConfirmModalContextType = {
  openConfirmModal: (props: ConfirmModalProps) => void;
};

const ConfirmModalContext = createContext<ConfirmModalContextType | undefined>(
  undefined,
);

export function ConfirmModalProvider({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalProps, setModalProps] = useState<ConfirmModalProps | null>(null);

  const openConfirmModal = (props: ConfirmModalProps) => {
    setModalProps(props);
    onOpen();
  };

  const handleConfirm = () => {
    modalProps?.onConfirm();
    onClose();
  };

  const handleCancel = () => {
    modalProps?.onCancel?.();
    onClose();
  };

  return (
    <ConfirmModalContext.Provider value={{ openConfirmModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <ModalHeader>{modalProps?.title}</ModalHeader>
          <ModalBody>
            <p>{modalProps?.description}</p>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={handleCancel}>
              {modalProps?.cancelLabel ?? "Cancel"}
            </Button>
            <Button color="primary" onPress={handleConfirm}>
              {modalProps?.confirmLabel ?? "Confirm"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ConfirmModalContext.Provider>
  );
}

export function useConfirmModal() {
  const context = useContext(ConfirmModalContext);
  if (!context) {
    throw new Error("useConfirmModal must be used within ConfirmModalProvider");
  }
  return context;
}
