"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { IconSearch, IconBook, IconQuote } from "@tabler/icons-react";
import { FlipWords } from "@/components/ui/flip-words";
import { HeroHighlight } from "@/components/ui/hero-highlight";

const WORDS = ["Students", "Researchers", "Academics", "Professionals"];

function HomeContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const message = searchParams.get("message");
  const { toast } = useToast();

  useEffect(() => {
    if (status && message) {
      toast({
        title: status === "success" ? "Success" : "Error",
        description: message,
        variant: status === "success" ? "success" : "destructive",
      });
    }
  }, [status, message, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <HeroHighlight>
        <div className="py-20 px-16 text-center bg-blue-100 rounded-md bg-clip-padding backdrop-filter backdrop-blur-2xl bg-opacity-10 border border-gray-100">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Smart Citations for
            <br />
            <FlipWords className="text-primary" words={WORDS} />
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Streamline your research with AI-powered citation suggestions based
            on your paper&apos;s content.
          </p>
          <Link href={"/dashboard"}>
            <button className="px-4 py-2 backdrop-blur-sm border bg-primary-300/10 border-primary-500/20 text-black mx-auto text-center rounded-full relative mt-4">
              <span>Create new project +</span>
              <div className="absolute inset-x-0  h-px -bottom-px bg-gradient-to-r w-3/4 mx-auto from-transparent via-primary-500 to-transparent text-black" />
            </button>
          </Link>
        </div>
      </HeroHighlight>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconSearch className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Smart Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes your abstract and keywords to understand your
                research context
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconBook className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Relevant Matches</h3>
              <p className="text-gray-600">
                Find the most relevant papers from our comprehensive database
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <IconQuote className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Easy Citations</h3>
              <p className="text-gray-600">
                Generate properly formatted citations with a single click
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
