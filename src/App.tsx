import { useEffect, useState } from "react";
import Pagination from "./components/Pagination/Pagination";
import useDebounce from "./hooks/useDebounce";
import { searchRepositories } from "./api/client";
import { Repo } from "./types";
import "./App.scss";

export default function App() {
    const [query, setQuery] = useState("react");
    const debouncedQuery = useDebounce(query);
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!debouncedQuery) return;
        
        setLoading(true);
        setError("");

        searchRepositories(debouncedQuery, page)
            .then((data) => {
                setRepos(data.items);

                setTotalPages(Math.min(
                    Math.ceil(data.total_count / 10),
                    100
                ));
            })
            .catch((err) => {
                setError(err.message);
            })
            .finally(() => {
                setLoading(false);
            });

    }, [debouncedQuery, page]);

    useEffect(() => {
        setPage(1);
    }, [debouncedQuery]);

    return (
        <div className="container">
            <h1>Github Repositories Search</h1>
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Github repositories..."
                className="search"
            />
            {loading && <h3>Loading...</h3>}
            {error && <h3>{error}</h3>}

            {!loading && <div className="cardGroup">
                {repos.map((repo) => (
                    <div className="card">
                        <h3>{repo.full_name}</h3>
                        <p>{repo.description}</p>
                        <a
                            href={repo.html_url}
                            target="_blank"
                            rel="noreferrer"
                        >
                            View Repository
                        </a>
                    </div>
                ))}
            </div>
            }

            <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}
