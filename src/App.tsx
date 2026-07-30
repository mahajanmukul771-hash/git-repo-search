import { useEffect, useState } from "react";
import Pagination from "./components/Pagination/Pagination";
import useDebounce from "./hooks/useDebounce";
import { searchRepositories } from "./api/client";
import type { Repo } from "./types";
import "./App.scss";
import { MAX_PAGES, RESULTS_PER_PAGE } from "./constant";

export default function App() {
    const [query, setQuery] = useState("react");
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");

    const debouncedQuery = useDebounce(query.trim());

    useEffect(() => {
        if (!debouncedQuery) {
            setRepos([])
            setTotalPages(0)
            setError("")
            setLoading(false)
            return;
        }

        let ignoreResponse = false
        const fetchRepositories = async () => {
            setLoading(true);
            setError("");
            try {
                const data = await searchRepositories(debouncedQuery, page)

                if (ignoreResponse) return

                setRepos(data.items);

                setTotalPages(Math.min(
                    Math.ceil(data.total_count / RESULTS_PER_PAGE),
                    MAX_PAGES
                ));

            } catch (error: unknown) {
                if (ignoreResponse) return

                setRepos([])
                setTotalPages(0)
                setError(error instanceof Error ? error.message : 'Unable to fetch repositories')

            }
            finally {
                if (!ignoreResponse) {
                    setLoading(false)
                }
            }


        }

        void fetchRepositories()

        return () => {
            ignoreResponse = true
        }

    }, [debouncedQuery, page]);

    const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(event.target.value)
        setPage(1)
    }

    const hasResults = repos.length > 0
    return (
        <main className="container">
            <h1>Github Repository Search</h1>

            <label className="searchLabel" htmlFor="repository-search">
                Search Repositories
            </label>

            <input
                id="repository-search"
                type="search"
                value={query}
                onChange={handleQueryChange}
                placeholder="Search Github repositories..."
                className="search"
            />
            {loading && (<p role="status" aria-live="polite">Loading...</p>)}
            {error && (<p className="error" role="alert">{error}</p>)}

            {!loading && !error && debouncedQuery && !hasResults && (<p>No repositories found.</p>)}

            {!loading && hasResults && (

                <section className="cardGroup" aria-label="Repository search results">
                    {repos.map((repo) => (
                        <article className="card" key={repo.id}>
                            <p className="repoName">{repo.full_name}</p>
                            <p>{repo.description}</p>
                            <a
                                href={repo.html_url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                View Repository
                            </a>
                        </article>
                    ))}
                </section>
            )
            }

            {totalPages > 1 && <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                disabled={loading}
            />}
        </main>
    );
}
