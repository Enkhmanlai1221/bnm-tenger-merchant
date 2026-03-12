"use client";

import { LoginForm } from "@/components/authorize/login-form";
import { RootState } from "@/store";
import { setAuthModal } from "@/store/general-slice";
import { Modal, ModalBody, ModalContent } from "@heroui/react";
import { usePathname } from "next/navigation";
import React, { createContext } from "react";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  children: React.ReactNode;
}

export const AuthContext = createContext({});

const PublicProvider = ({ children }: Props) => {
  const pathname = usePathname();
  const { authModal } = useSelector((state: RootState) => state.general);
  const dispatch = useDispatch();
  return (
    <AuthContext.Provider value={{}}>
      {children}
      <Modal
        isOpen={authModal}
        onClose={() => dispatch(setAuthModal(false))}
        scrollBehavior="outside"
      >
        <ModalContent>
          <ModalBody>
            <div className="my-10">
              <LoginForm onSuccess={() => { }} backTo={pathname} />
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </AuthContext.Provider>
  );
};

PublicProvider.displayName = "PublicProvider";

export default PublicProvider;
