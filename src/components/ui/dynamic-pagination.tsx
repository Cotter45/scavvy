import {
  Pagination,
  PaginationGap,
  PaginationList,
  PaginationNext,
  PaginationPage,
  PaginationPrevious,
} from "./pagination";

type DynamicPaginationProps = {
  totalPages: number;
  currentPage: number;
  visiblePages?: number; // Number of visible pages around the current page
};

export function DynamicPagination({
  totalPages,
  currentPage,
  visiblePages = 3,
}: DynamicPaginationProps) {
  const getPageNumbers = () => {
    const startPage = Math.max(1, currentPage - visiblePages);
    const endPage = Math.min(totalPages, currentPage + visiblePages);
    const pages = [];

    for (let page = startPage + 1; page < endPage; page++) {
      pages.push(page);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination className="fade_in">
      {/* Previous Button */}
      <PaginationPrevious
        href={`?page=${currentPage > 1 ? currentPage - 1 : 1}`}
      >
        Previous
      </PaginationPrevious>

      {/* Page List */}
      <PaginationList>
        <PaginationPage href="?page=1" current={currentPage === 1}>
          1
        </PaginationPage>
        {currentPage >= visiblePages + 1 && <PaginationGap />}

        {pageNumbers.map((page) => (
          <PaginationPage
            key={page}
            href={`?page=${page}`}
            current={page === currentPage}
          >
            {page}
          </PaginationPage>
        ))}

        {currentPage < totalPages - visiblePages && <PaginationGap />}
        {totalPages > 1 && (
          <PaginationPage
            href={`?page=${totalPages}`}
            current={currentPage === totalPages}
          >
            {totalPages}
          </PaginationPage>
        )}
      </PaginationList>

      {/* Next Button */}
      <PaginationNext
        href={`?page=${
          currentPage < totalPages ? currentPage + 1 : totalPages
        }`}
      >
        Next
      </PaginationNext>
    </Pagination>
  );
}
