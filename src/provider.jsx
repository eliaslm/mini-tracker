import { NextUIProvider } from "@nextui-org/system";
import { useHref, useNavigate } from "react-router-dom";

export function Provider({ children }) {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      {children}
    </NextUIProvider>
  );
}
