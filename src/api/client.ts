import { SearchResponse } from "../types";

export async function searchRepositories(
    query: string,
    page: number
): Promise<SearchResponse> {
    const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}&page=${page}&per_page=10`
    );

    if (!response.ok) {
        throw new Error("Unable to fetch repositories");
    }

    return response.json();
}