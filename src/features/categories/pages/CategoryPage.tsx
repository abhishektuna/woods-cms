import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCategories, deleteCategory } from "../categories.slice";
import { Button } from "../../../components/common/Button/Button";
import { Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { confirm } from "react-confirm-box";
import toast from "react-hot-toast";
import { CategoryForm } from "../components/CategoryForm";

export function CategoryPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories);
  const categoriesArr = Array.isArray(categories.data) ? categories.data : [];

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<any>(null);

  /* -------------------- Fetch Products -------------------- */
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);



  // Filter and search categories
  const filteredCategories = useMemo(() => {
    return categoriesArr.filter((c: any) =>
      searchTerm === "" || c.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoriesArr, searchTerm]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCategories = filteredCategories.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage]);

  /* -------------------- Handlers -------------------- */
  const handleEdit = (categoryItem: any) => {
    setSelectedCategoryItem(categoryItem);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedCategoryItem(null);
    setShowForm(true);
  };

  const handleDelete = async (categoryId: string) => {
    const result = await confirm("Are you sure you want to delete this category?");
    if (result) {
      dispatch(deleteCategory(categoryId)).then(() => {
        toast.success("Category deleted successfully");
        dispatch(fetchCategories());
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    dispatch(fetchCategories());
    toast.success("Category saved successfully");
  };

  const clearFilters = () => {
    setSearchTerm("");
  };

  const hasActiveFilters = searchTerm !== "";

  /* -------------------- Loading State -------------------- */
  if (categories.loading) {
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
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
        <Button onClick={handleCreate} className="bg-[#eb8b1d] text-white hover:bg-[#d47a15] transition">
          + Create Category
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
              placeholder="Search by title..."
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
              <span className="bg-[#eb8b1d] text-white text-xs px-2 py-0.5 rounded-full">
                Active
              </span>
            )}
          </button>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Items Per Page */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Items per page
                </label>
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
              <button
                onClick={clearFilters}
                className="mt-4 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 transition"
              >
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
          Showing {currentCategories.length === 0 ? 0 : startIndex + 1} to {Math.min(endIndex, filteredCategories.length)} of {filteredCategories.length} categories
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#eb8b1d]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Image
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">No categories found</p>
                      <p className="text-sm text-gray-400">Try adjusting your search term</p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentCategories.map((c: any) => (
                  <tr key={c._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 break-words whitespace-normal max-w-xs">
                      {c.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {c.image ? (
                        <img src={c.image} alt={c.title} className="w-20 h-12 object-cover rounded" />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleEdit(c)}
                          className="bg-[#b5ce07] text-black hover:bg-[#a3ba06] transition px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(c._id)}
                          className="bg-red-500 text-white hover:bg-red-600 transition px-3 py-1"
                        >
                          Delete
                        </Button>
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
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
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
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 text-sm font-medium rounded-lg transition ${
                      currentPage === pageNum
                        ? "bg-[#eb8b1d] text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* -------------------- Category Form Modal -------------------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-y-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedCategoryItem ? "Edit Category" : "Create Category"}
            </h2>
            <CategoryForm category={selectedCategoryItem} onSuccess={handleFormSuccess} onCancel={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </div>
  );
}