"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconPlus, IconBooks, IconClock } from "@tabler/icons-react";
import { useProjects } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

const formatKeywords = (keywords: string): string[] => {
  return keywords ? keywords.split(",").map((kw) => kw.trim()) : [];
};

export default function DashboardPage() {
  const { projects, loading, refetchProjects } = useProjects();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      refetchProjects();
    }
  }, [user, refetchProjects]);

  useEffect(() => {
  }, [projects]);

  if (!user || loading) {
    return <div>Loading...</div>;
  }

  const hasProjects = projects && projects.length > 0;


  return (
    <div className="container p-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
        <Link href="/dashboard/new-project">
          <Button className="flex items-center gap-2">
            <IconPlus size={18} />
            New Project
          </Button>
        </Link>
      </div>

      {!hasProjects ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="mb-4">
            <IconBooks className="mx-auto h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No projects yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create your first project to start finding citations
          </p>
          <Link href="/dashboard/new-project">
            <Button variant="default">Create New Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <Link
              href={`/dashboard/project/${project.id}`}
              key={project.id}
              className="block"
            >
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-all hover:scale-[1.02] cursor-pointer">
                <h3 className="font-semibold text-lg text-gray-900 mb-2">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {formatKeywords(project.keywords).map((keyword, idx) => (
                    <span
                      key={`${keyword}-${idx}`}
                      className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <IconBooks size={16} />
                    <span>{project.citationCount || 0} citations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <IconClock size={16} />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
