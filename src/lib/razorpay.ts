import { RazorpayOptions, RazorpayResponse } from "@/types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    // Check if already loaded
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => {
      console.log("✅ Razorpay SDK loaded");
      resolve(true);
    };

    script.onerror = () => {
      console.error("❌ Failed to load Razorpay SDK");
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

export const initiateRazorpayPayment = async (
  options: RazorpayOptions
): Promise<RazorpayResponse> => {
  const loaded = await loadRazorpayScript();

  if (!loaded) {
    throw new Error("Failed to load Razorpay SDK");
  }

  return new Promise((resolve, reject) => {
    try {
      const razorpay = new window.Razorpay({
        ...options,
        handler: (response: RazorpayResponse) => {
          console.log("✅ Payment successful:", response);
          resolve(response);
        },
        modal: {
          ...options.modal,
          ondismiss: () => {
            console.log("Payment modal dismissed");
            reject(new Error("Payment cancelled"));
          },
          confirm_close: true,
        },
      });

      razorpay.on("payment.failed", (response: any) => {
        console.error("❌ Payment failed:", response.error);
        reject(new Error(response.error.description || "Payment failed"));
      });

      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      reject(error);
    }
  });
};
