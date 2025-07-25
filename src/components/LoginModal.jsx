import { useDisclosure, Button, Modal, ModalContent, ModalBody } from "@nextui-org/react";

export function LoginModal({ supabaseClient }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleGoogleSignIn = async () => {
    await supabaseClient.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <>
      <Button color="secondary" onPress={onOpen}>
        Log in
      </Button>
      <Modal
        backdrop="opaque"
        classNames={{
          body: "py-6",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isOpen}
        radius="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {() => (
            <ModalBody>
              <Button color="primary" onPress={handleGoogleSignIn} fullWidth>
                Sign in with Google
              </Button>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
