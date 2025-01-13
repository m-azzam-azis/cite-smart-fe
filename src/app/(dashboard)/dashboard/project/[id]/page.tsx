"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
// import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  IconArrowLeft,
  IconBooks,
  // IconCopy,
  IconTrash,
  IconDots,
} from "@tabler/icons-react";
import { ProjectDetail } from "../../interfaces";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { gqlRequest } from "@/utils/graphql";

const fetchProjectDetails = async (
  projectId: string
): Promise<ProjectDetail | null> => {
  try {
    const data = await gqlRequest<{ projectById: ProjectDetail }>(
      `
        query ProjectById($projectId: String!) {
          projectById(projectId: $projectId) {
            id
            title
            keywords
            citationCount
            citations {
              title
              id
              authors
              similarityScore
            }
          }
        }
      `,
      { projectId }
    );
    return data?.projectById || null;
  } catch (error) {
    console.error("GraphQL Errors:", error);
    return null;
  }
};

const deleteCitation = async (
  userId: string,
  projectId: string,
  citationId: string
): Promise<boolean> => {
  try {
    const data = await gqlRequest<{ deleteCitation: boolean }>(
      `
        mutation DeleteCitation($userId: String!, $projectId: String!, $citationId: String!) {
          deleteCitation(userId: $userId, projectId: $projectId, citationId: $citationId)
        }
      `,
      { userId, projectId, citationId }
    );
    return data?.deleteCitation || false;
  } catch (error) {
    console.error("GraphQL Errors:", error);
    return false;
  }
};

const deleteProject = async (
  userId: string,
  projectId: string
): Promise<boolean> => {
  try {
    const data = await gqlRequest<{ deleteProject: boolean }>(
      `
        mutation DeleteProject($userId: String!, $projectId: String!) {
          deleteProject(userId: $userId, projectId: $projectId)
        }
      `,
      { userId, projectId }
    );
    return data?.deleteProject || false;
  } catch (error) {
    console.error("GraphQL Errors:", error);
    return false;
  }
};

const formatKeywords = (keywords: string): string[] => {
  return keywords ? keywords.split(",").map((kw) => kw.trim()) : [];
};

const formatAuthors = (authors: string | string[]): string => {
  const authorList = Array.isArray(authors) ? authors : authors.split(",");
  if (authorList.length <= 2) return authorList.join(" & ");
  return `${authorList[0]}, ${authorList[1]}, et al.`;
};

const getSimilarityColor = (score: number): string => {
  if (score < 30) return "bg-red-500";
  if (score < 60) return "bg-yellow-500";
  if (score >= 60) return "bg-emerald-500";
  return "";
};

export default function ProjectPage() {
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const projectId = (params.id as string).replaceAll("%3A", ":");

  useEffect(() => {
    if (!projectId) return;

    fetchProjectDetails(projectId)
      .then(setProject)
      .finally(() => setLoading(false));
  }, [projectId]);

  const { user } = useAuth();
  const handleRemoveCitation = async (citationId: string) => {
    if (!user?.id || !projectId) return;

    try {
      const success = await deleteCitation(user.id, projectId, citationId);
      if (success) {
        setProject((prev) =>
          prev
            ? {
                ...prev,
                citations: prev.citations.filter((c) => c.id !== citationId),
              }
            : null
        );
        toast({
          title: "Success",
          description: "Citation removed successfully",
        });
      } else {
        throw new Error("Failed to delete citation");
      }
    } catch (error) {
      console.error("Error removing citation:", error);
      toast({
        title: "Error",
        description: "Failed to remove citation",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProject = async () => {
    if (!user?.id || !projectId) return;

    try {
      const success = await deleteProject(user.id, projectId);
      if (success) {
        toast({
          title: "Success",
          description: "Project deleted successfully",
        });
        router.push("/dashboard");
        router.refresh();
      } else {
        throw new Error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  // Sort citations by similarity score
  const sortedCitations =
    project?.citations.sort((a, b) => b.similarityScore - a.similarityScore) ||
    [];

  return (
    <div className="container p-8 mx-auto max-w-6xl">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <IconArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <IconTrash className="mr-2 h-4 w-4" />
              Delete Project
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                project and remove all citations associated with it.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDeleteProject}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Delete Project
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="space-y-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {project.title}
          </h1>
          <div className="flex flex-wrap gap-2">
            {formatKeywords(project.keywords).map((keyword, idx) => (
              <span
                key={`${keyword}-${idx}`}
                className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <IconBooks className="h-5 w-5" />
              Citations ({project.citations?.length || 0})
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {sortedCitations.map((citation) => (
              <Card key={citation.id} className="p-4 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium flex-1">{citation.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <IconDots size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => handleRemoveCitation(citation.id)}
                        className="text-red-600"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <div>Authors: {formatAuthors(citation.authors)}</div>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Similarity</span>
                      <span>{Math.round(citation.similarityScore * 100)}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-200 overflow-hidden">
                      <div
                        className={`h-full transition-all ${getSimilarityColor(
                          Math.round(citation.similarityScore * 100)
                        )}`}
                        style={{
                          width: `${Math.round(
                            citation.similarityScore * 100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
