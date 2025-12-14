import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { paymentApi } from "@/lib/api/endpoints";
import { initiateRazorpayPayment } from "@/lib/razorpay";
import { RAZORPAY_KEY } from "@/lib/constants";
import toast from "react-hot-toast";
import { CustomerDetails } from "@/types";

export function useRazorpay() {
  const [isProcessing, setIsProcessing] = useState(false);

  const createPaymentMutation = useMutation({
    mutationFn: paymentApi.createOrder,
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: paymentApi.verify,
  });

  const processPayment = async (
    orderId: string,
    customerDetails: CustomerDetails,
    onSuccess: () => void,
    onError: (error: Error) => void
  ) => {
    try {
      setIsProcessing(true);

      // Create Razorpay order
      const response = await createPaymentMutation.mutateAsync(orderId);

      if (!response.success || !response.data) {
        throw new Error("Failed to create payment order");
      }

      const { id, amount, currency, keyId } = response.data;

      // Initiate Razorpay payment
      const paymentResponse = await initiateRazorpayPayment({
        key: keyId || RAZORPAY_KEY,
        amount,
        currency,
        name: "Dessy69 Cafe",
        description: "Fruit-based Ice Creams & Desserts",
        order_id: id,
        handler: async (response) => {
          try {
            // Verify payment
            await verifyPaymentMutation.mutateAsync({
              orderId,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            });

            toast.success("Payment successful!");
            onSuccess();
          } catch (error) {
            toast.error("Payment verification failed");
            onError(error as Error);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        theme: {
          color: "#f97316",
        },
      });
    } catch (error) {
      setIsProcessing(false);
      if (error instanceof Error && error.message !== "Payment cancelled") {
        toast.error("Payment failed. Please try again.");
        onError(error);
      }
    }
  };

  return {
    processPayment,
    isProcessing,
    isCreatingOrder: createPaymentMutation.isPending,
    isVerifying: verifyPaymentMutation.isPending,
  };
}
