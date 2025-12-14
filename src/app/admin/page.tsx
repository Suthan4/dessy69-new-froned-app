"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingScreen } from "@/components/common/loadingScreen";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return <LoadingScreen />;
}
