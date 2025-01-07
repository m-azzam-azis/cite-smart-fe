"use client";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { FlipWords } from "@/components/ui/flip-words";
import { ToastAction } from "@/components/ui/toast";

export default function Home() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const { toast } = useToast();

  useEffect(() => {
    if (status && message) {
      toast({
        title: status === "success" ? "Success" : "Error",
        description: message,
      });
    }
  }, [status, message]);

  return (
    <div className="w-full h-screen bg-red-200">
      <div className="flex justify-center">
        <FlipWords words={["hello", "hi"]} />
        hello
      </div>
      <button
        onClick={() => {
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem with your request.",
            action: <ToastAction altText="Try again">Try again</ToastAction>,
          });
        }}
      >
        TIS
      </button>
    </div>
  );
}
