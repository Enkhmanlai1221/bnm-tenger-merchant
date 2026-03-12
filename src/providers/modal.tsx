"use client";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import Button from "@/components/ui/button/button";
import { cn } from "@/utils";
import { createContext, ReactNode, useContext, useState } from "react";
import { useLanguage } from "@/providers/language";

type Props = {
  title?: ReactNode;
  children?: ReactNode;
  description?: string;
  onConfirm: (note?: string) => Promise<void>;
  withNote?: boolean;
};

export const ModalContext = createContext({
  openConfirmModal: (_: Props) => { },
});

export const useConfirmModal = () => {
  const { openConfirmModal } = useContext(ModalContext);

  return { openConfirmModal };
};

const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [payload, setPayload] = useState<Props>();
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");
  const { translate } = useLanguage();

  const onConfirm = async () => {
    setLoading(true);
    await payload?.onConfirm(payload.withNote ? note : undefined);
    setLoading(false);
    setVisible(false);
    setNote("");
  };

  return (
    <ModalContext.Provider
      value={{
        openConfirmModal: ({
          title,
          children,
          description,
          onConfirm,
          withNote,
        }: Props) => {
          setPayload({ title, children, description, onConfirm, withNote });
          setVisible(true);
        },
      }}
    >
      {children}

      <Modal
        isOpen={visible}
        onClose={() => {
          setVisible(false);
          setNote("");
        }}
        backdrop="blur"
        classNames={{
          backdrop: "bg-white/30",
          base: "border-2 border-gray-600",
        }}
      >
        <ModalContent>
          <ModalHeader>{payload?.title || "Confirm"}</ModalHeader>
          <ModalBody>
            {payload?.children ? (
              payload?.children
            ) : (
              <div className="flex flex-col gap-4">
                <div>{payload?.description}</div>
                {payload?.withNote && (
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    rows={3}
                    placeholder="Enter note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                )}
              </div>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onClick={() => setVisible(false)}>
              {translate("no", "No")}
            </Button>
            <Button variant="primary" loading={loading} onClick={onConfirm}>
              {translate("yes", "Yes")}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
};

ModalProvider.displayName = "ModalProvider";

export default ModalProvider;
