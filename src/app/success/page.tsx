"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  return (
    <div className="container mx-auto flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <CheckCircle size={64} className="mx-auto mb-4 text-success" />
        <h1 className="mb-2 text-3xl font-bold">Payment Successful!</h1>
        <p className="mb-6">Order ID: {orderId}</p>
        <Button onClick={() => router.push(`/tracking/${orderId}`)}>
          Track Order
        </Button>
      </div>
    </div>
  );
}
