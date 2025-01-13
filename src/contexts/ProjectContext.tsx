"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { ProjectSummary } from "@/app/(dashboard)/dashboard/interfaces";
import { useAuth } from "./AuthContext";
import { gqlRequest } from "@/utils/graphql";

interface ProjectContextType {
  projects: ProjectSummary[] | null;
  loading: boolean;
  error: Error | null;
  refetchProjects: () => Promise<void>;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

const fetchProjects = async (
  userId: string
): Promise<ProjectSummary[] | null> => {
  try {
    const result = await gqlRequest<{ projectsByUserId: ProjectSummary[] }>(
      `
        query ProjectsByUserId($userId: String!) {
          projectsByUserId(userId: $userId) {
            id
            title
            keywords
            citationCount
          }
        }
      `,
      { userId }
    );
    return result?.projectsByUserId || null;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return null;
  }
};

export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const [projects, setProjects] = useState<ProjectSummary[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  const refetchProjects = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const data = await fetchProjects(user.id);
      setProjects(data);
      setError(null);
    } catch (e) {
      setError(e as Error);
      setProjects(null);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refetchProjects();
    }
  }, [user, refetchProjects]);

  const value = {
    projects,
    loading,
    error,
    refetchProjects,
  };

  return (
    <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectProvider");
  }
  return context;
}
