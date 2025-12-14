"use client";
import { createContext, useContext } from "react";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { ToastMessage } from "primereact/toast";

const ToastContext = createContext<{
  showToast: (msg: ToastMessage | ToastMessage[]) => void;
} | null>(null);

export function ToastContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const toast = useRef<Toast>(null);

  const showToast = (msg: ToastMessage | ToastMessage[]) => {
    toast.current?.show(msg);
  };
  return (
    <ToastContext.Provider value={{ showToast }}>
      <Toast ref={toast} />
      {children}
    </ToastContext.Provider>
  );
}
export function useToastContext() {
  return useContext(ToastContext);
}
