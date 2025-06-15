import React from "react";
import { Modal, ModalContent, ModalBody, Spinner } from "@heroui/react";
import { useLoader } from "../context/loader";

export default function Loader() {
  const { isLoading } = useLoader();

  return (
    <Modal isOpen={isLoading} hideCloseButton={true}>
      <ModalContent className="bg-transparent border-none shadow-none">
        <ModalBody className="flex flex-col items-center justify-center py-8">
          <Spinner size="lg" color="primary" labelColor="primary" />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
