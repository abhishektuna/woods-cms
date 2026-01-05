import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchSubCategories,
  deleteSubCategory,
} from "../subcategories.slice";
import { fetchCategories } from "../../categories/categories.slice";
import { Button } from "../../../components/common/Button/Button";
import { Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { confirm } from "react-confirm-box";
import toast from "react-hot-toast";

export function SubCategoryPage() {
  const dispatch = useAppDispatch();
  const subcategories = useAppSelector((state: any) => state.subcategories);
  const categories = useAppSelector((state: any) => state.categories);

  const subcatsArr = Array.isArray(subcategories.data) ? subcategories.data : [];
  const categoriesArr = Array.isArray(categories.data) ? categories.data : [];

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  /* -------------------- Fetch Data -------------------- */
  useEffect(() => {
    dispatch(fetchSubCategories());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Filter and search subcategories
  const filtered = useMemo(() => {
    return subcatsArr.filter((s: any) => {
      const matchesSearch =
        searchTerm === "" || s.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || s.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [subcatsArr, searchTerm, selectedCategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, itemsPerPage]);

  /* -------------------- Handlers -------------------- */
  const handleEdit = (item: any) => {
    navigate(`/admin-dashboard/subcategory/${item._id}`);
  };

  const handleCreate = () => {
    navigate(`/admin-dashboard/subcategory/create`);
  };

  const handleDelete = async (id: string) => {
    const ok = await confirm("Are you sure you want to delete this subcategory?");
    if (!ok) return;
    dispatch(deleteSubCategory(id)).then(() => toast.success("Subcategory deleted"));
  };



  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "all";

  /* -------------------- Loading State -------------------- */
  if (subcategories.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb8b1d]"></div>
      </div>
    );
  }

  /* -------------------- Render -------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Subcategories</h1>
        <Button onClick={handleCreate} className="bg-[#eb8b1d] text-white hover:bg-[#d47a15] transition">
          + Create Subcategory
        </Button>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search subcategories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none transition"
            />
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="bg-[#eb8b1d] text-white text-xs px-2 py-0.5 rounded-full">Active</span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none"
                >
                  <option value="all">All Categories</option>
                  {categoriesArr.map((cat: any) => (
                    <option key={cat._id} value={cat._id}>{cat.title}</option>
                  ))}
                </select>
              </div>

              {/* Items Per Page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
                <select
                  value={itemsPerPage}
                  onChange={(e) => setItemsPerPage(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition">
                <X className="w-4 h-4" />
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Results Info */}
      <div className="flex items-center justify-between text-sm text-gray-600 px-1">
        <span>
          Showing {currentItems.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filtered.length)} of {filtered.length} subcategories
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#eb8b1d]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">No subcategories found</p>
                      <p className="text-sm text-gray-400">Try adjusting your filters or search term</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentItems.map((s: any) => (
                  <tr key={s._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-normal break-words max-w-xs">{s.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {s.image ? (
                        <img src={s.image} alt={s.title} className="w-20 h-12 object-cover rounded" />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{categoriesArr.find((c: any) => c._id === s.categoryId)?.title || "-"}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Button onClick={() => handleEdit(s)} className="bg-[#b5ce07] text-black hover:bg-[#a3ba06] transition px-3 py-1">Edit</Button>
                        <Button onClick={() => handleDelete(s._id)} className="bg-red-500 text-white hover:bg-red-600 transition px-3 py-1">Delete</Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button key={pageNum} onClick={() => setCurrentPage(pageNum)} className={`px-3 py-1 text-sm font-medium rounded-lg transition ${currentPage === pageNum ? "bg-[#eb8b1d] text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition">
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}



    </div>
  );
}