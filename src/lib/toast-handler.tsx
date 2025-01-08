"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export function ToastHandler() {
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const title = searchParams.get("toast_title");
    const message = searchParams.get("toast_message");
    const type = searchParams.get("toast_type") as
      | "default"
      | "success"
      | "destructive";

    if (message) {
      toast({
        title: title || undefined,
        description: message,
        variant: type || "default",
      });
    }
  }, [searchParams, toast]);

  return null;
}
