import { useDisclosure, Button, Modal, ModalContent, ModalBody, ModalHeader } from "@nextui-org/react";

export function LoginModal({ supabaseClient }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleGoogleSignIn = async () => {
    await supabaseClient.auth.signInWithOAuth({ provider: 'google' , options: {
      redirectTo: import.meta.env.VITE_SUPABASE_REDIRECT_URL || "https://eliaslm.github.io/mini-tracker/",
    },});
  };

  return (
    <>
      <Button color="secondary" onPress={onOpen}>
        Log in
      </Button>
      <Modal
        backdrop="blur"
        classNames={{
          body: "py-8 px-6",
          header: "pb-2",
          closeButton: "hover:bg-white/5 active:bg-white/10",
        }}
        isOpen={isOpen}
        radius="lg"
        onOpenChange={onOpenChange}
        size="sm"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-center">
                <h3 className="text-xl font-semibold">Welcome to Mini Tracker</h3>
                <p className="text-sm text-default-500">Sign in to continue</p>
              </ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-4">
                  <Button
                    color="default"
                    variant="bordered"
                    onPress={handleGoogleSignIn}
                    fullWidth
                    size="lg"
                    className="font-medium"
                    startContent={
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        />
                      </svg>
                    }
                  >
                    Continue with Google
                  </Button>
                  <div className="text-center">
                    <p className="text-xs text-default-400">
                      By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                  </div>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
