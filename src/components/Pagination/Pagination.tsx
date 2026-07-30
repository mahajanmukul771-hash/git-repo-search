import './Pagination.scss'
interface Props {
    page: number;
    totalPages: number;
    disabled?: boolean;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    page,
    totalPages,
    disabled = false,
    onPageChange,
}: Props) {

    const isPreviousDisabled = disabled || page <= 1
    const isNextDisabled = disabled || page >= totalPages
    return (
        <nav className="pagination" aria-label='Search result pagination'>
            <button
                disabled={isPreviousDisabled}
                onClick={() => onPageChange(page - 1)}
            >
                Previous
            </button>
            <span>
                Page {page} of {totalPages}
            </span>
            <button
                disabled={isNextDisabled}
                onClick={() => onPageChange(page + 1)}
            >
                Next
            </button>
        </nav>
    );
}
