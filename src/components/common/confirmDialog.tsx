"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
  loading = false,
}: ConfirmDialogProps) {
  const colors = {
    danger: "text-error",
    warning: "text-warning",
    info: "text-info",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="text-center">
        <div
          className={`mx-auto mb-4 inline-flex rounded-full bg-${variant}/10 p-4`}
        >
          <AlertTriangle size={32} className={colors[variant]} />
        </div>
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="mb-6 text-neutral-600 dark:text-neutral-400">{message}</p>
        <div className="flex gap-3">
          <Button
            onClick={onConfirm}
            variant={variant === "danger" ? "danger" : "primary"}
            loading={loading}
            fullWidth
          >
            {confirmText}
          </Button>
          <Button
            onClick={onClose}
            variant="outline"
            fullWidth
            disabled={loading}
          >
            {cancelText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
