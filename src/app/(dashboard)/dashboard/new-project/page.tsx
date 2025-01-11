"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function NewProjectPage() {
  const [title, setTitle] = useState("");
  const [keyword, setKeyword] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);

  const handleAddKeyword = () => {
    if (!keyword.trim()) return;
    setKeywords([...keywords, keyword.trim()]);
    setKeyword("");
  };

  const handleRemoveKeyword = (indexToRemove: number) => {
    setKeywords(keywords.filter((_, index) => index !== indexToRemove));
  };
  const { toast } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || keywords.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    // Handle form submission here
    toast({
      title: "Success",
      description: "Project created successfully",
    });
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

          <Button type="submit" className="w-full">
            Create Project
          </Button>
        </form>
      </Card>
    </div>
  );
}
