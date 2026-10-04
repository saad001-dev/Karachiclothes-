// components/Toast.jsx
import React from "react";
import { Toaster, toast } from "react-hot-toast";

export const ToastContainer = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 2000,
        style: {
          background: "#1a1a1a",
          color: "#fff",
          padding: "16px 24px",
          borderRadius: "12px",
          fontSize: "14px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
        },
        success: {
          style: {
            background: "#10b981",
            color: "#fff",
          },
          icon: "✅",
        },
        error: {
          style: {
            background: "#ef4444",
            color: "#fff",
          },
          icon: "❌",
        },
      }}
    />
  );
};

// Toast functions
export const showToast = {
  success: (message) => toast.success(message),
  error: (message) => toast.error(message),
  loading: (message) => toast.loading(message),
  custom: (message, options = {}) => toast(message, options),
};
