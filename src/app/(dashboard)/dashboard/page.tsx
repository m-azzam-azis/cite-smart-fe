import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DUMMY_PROJECTS } from "./constants";
import { IconPlus, IconBooks, IconClock } from "@tabler/icons-react";

export default function DashboardPage() {
  const hasProjects = DUMMY_PROJECTS.length > 0;

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
          <Link href="/dashboard/add-project">
            <Button variant="default">Create New Project</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {DUMMY_PROJECTS.map((project) => (
            <div
              key={project.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                {project.title}
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {project.keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <IconBooks size={16} />
                  <span>{project.citationCount} citations</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconClock size={16} />
                  <span>
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
