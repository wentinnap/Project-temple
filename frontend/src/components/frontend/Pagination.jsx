import { useEffect, useState } from "react";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // sm breakpoint (tailwind)
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 📱 Mobile view
  if (isMobile) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-gray-200 hover:bg-gray-700"
          }`}
        >
          &lt;
        </button>

        <span className="px-3 py-1 bg-blue-600 text-white rounded-md">
          {currentPage} / {totalPages}
        </span>

        <button
          onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
              ? "bg-gray-600 text-gray-400 cursor-not-allowed"
              : "bg-gray-800 text-gray-200 hover:bg-gray-700"
          }`}
        >
          &gt;
        </button>
      </div>
    );
  }

  // 💻 Desktop view
  const delta = 1;
  const pages = [];

  for (
    let i = Math.max(2, currentPage - delta);
    i <= Math.min(totalPages - 1, currentPage + delta);
    i++
  ) {
    pages.push(i);
  }

  const paginationItems = [];

  // หน้าแรก
  paginationItems.push(
    <button
      key={1}
      onClick={() => onPageChange(1)}
      className={`px-3 py-1 rounded-md ${
        currentPage === 1
          ? "bg-blue-600 text-white"
          : "bg-gray-800 text-gray-200 hover:bg-gray-700"
      }`}
    >
      1
    </button>
  );

  if (currentPage - delta > 2) {
    paginationItems.push(
      <span key="left-ellipsis" className="px-2 text-gray-400">
        ...
      </span>
    );
  }

  pages.forEach((page) => {
    paginationItems.push(
      <button
        key={page}
        onClick={() => onPageChange(page)}
        className={`px-3 py-1 rounded-md ${
          currentPage === page
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-200 hover:bg-gray-700"
        }`}
      >
        {page}
      </button>
    );
  });

  if (currentPage + delta < totalPages - 1) {
    paginationItems.push(
      <span key="right-ellipsis" className="px-2 text-gray-400">
        ...
      </span>
    );
  }

  if (totalPages > 1) {
    paginationItems.push(
      <button
        key={totalPages}
        onClick={() => onPageChange(totalPages)}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? "bg-blue-600 text-white"
            : "bg-gray-800 text-gray-200 hover:bg-gray-700"
        }`}
      >
        {totalPages}
      </button>
    );
  }

  // ปุ่มถัดไป
  paginationItems.push(
    <button
      key="next"
      onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
      disabled={currentPage === totalPages}
      className={`px-3 py-1 rounded-md ${
        currentPage === totalPages
          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
          : "bg-gray-800 text-gray-200 hover:bg-gray-700"
      }`}
    >
      &gt;
    </button>
  );

  return <div className="flex items-center gap-2">{paginationItems}</div>;
}
