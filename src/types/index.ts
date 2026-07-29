export interface Repo {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
}

export interface SearchResponse {
  total_count: number;
  items: Repo[];
}