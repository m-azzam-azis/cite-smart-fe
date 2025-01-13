"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { SearchResponse } from "./interfaces";
import { gqlRequest } from "@/utils/graphql";

const searchPapers = async (input: {
  uid: string | null;
  title: string;
  keywords: string[];
}): Promise<SearchResponse | null> => {
  try {
    return await gqlRequest<SearchResponse>(
      `
        query {
          searchAndStorePapers(input: {
            uid: "${input.uid || ""}"
            title: "${input.title}"
            keywords: ${JSON.stringify(input.keywords)}
          }) {
            title
            similarityScore
            citations {
              title
              id
              authors
              similarityScore
            }
          }
        }
      `
    );
  } catch (error) {
    console.error("GraphQL Errors:", error);
    return null;
  }
};

export default function NewProjectPage() {
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const handleAddKeyword = () => {
    if (!keyword.trim()) return;
    setKeywords([...keywords, keyword.trim()]);
    setKeyword("");
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || keywords.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const result = await searchPapers({
        uid: user?.id || null,
        title: title,
        keywords: keywords,
      });

      if (result) {
        toast({
          title: "Success",
          description: "Project created successfully",
        });
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Error creating project:", error);
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Project</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Project Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter project title"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="keywords" className="text-sm font-medium">
              Keywords
            </label>
            <div className="flex gap-2">
              <Input
                id="keywords"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Enter keyword"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), handleAddKeyword())
                }
              />
              <Button type="button" onClick={handleAddKeyword}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {keywords.map((kw, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveKeyword(index)}
                >
                  {kw} ×
                </Badge>
              ))}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Creating Project...
              </div>
            ) : (
              "Create Project"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
}
