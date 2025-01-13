export interface NewProject {
  title: string;
  authors: string[];
  userId: string;
}

export interface CreateProjectResponse {
  createProject: {
    id: string;
    title: string;
    authors: string[];
  }
}

export interface SearchInput {
  uid: string | null;
  title: string | null;
  keywords: string[] | null;
}

export interface Citation {
  title: string;
  id: string;
  authors: string[];
  similarityScore: number;
}

export interface SearchResponse {
  searchAndStorePapers: {
    title: string;
    similarityScore: number;
    citations: Citation[];
  }
}
