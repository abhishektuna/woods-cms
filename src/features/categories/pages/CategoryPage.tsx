import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCategories, deleteCategory } from "../categories.slice";
import { Button } from "../../../components/common/Button/Button";
import { Search, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import { CategoryForm } from "../components/CategoryForm";
const Swal = await import("sweetalert2");
import { CommonTable } from "../../../components/common/Table/CommonTable";
import { usePagination } from "../../../hooks/usePagination";
import { Pagination } from "../../../components/common/Pagination/Pagination";
import { useNavigate } from "react-router-dom";

export function CategoryPage() {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories);
  const categoriesArr = Array.isArray(categories.data) ? categories.data : [];

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // UI states
  const [showFilters, setShowFilters] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [selectedCategoryItem, setSelectedCategoryItem] = useState<any>(null);

  /* -------------------- Fetch Products -------------------- */
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

const navigate = useNavigate();

  // Filter and search categories
  const filteredCategories = useMemo(() => {
    return categoriesArr.filter((c: any) =>
      searchTerm === "" || c.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [categoriesArr, searchTerm]);

  // Pagination calculations via shared hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: currentCategories,
  } = usePagination(filteredCategories, itemsPerPage);

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
    navigate("create");
  };

  const handleDelete = async (categoryId: string) => {
    const result = await Swal.default.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await dispatch(deleteCategory(categoryId)).unwrap();
        toast.success("Category deleted successfully");
      } catch (err) {
        toast.error("Failed to delete category");
        console.error(err);
      }
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

  /*---------------------------- Table Column ----------------------------*/
  const categoryColumns = useMemo(() => [
  {
    header: "Title",
    width: "40%",
    render: (c: any) => (
      <div className="text-sm font-medium text-gray-900 break-words max-w-xs">
        {c.title}
      </div>
    ),
  },
  {
    header: "Image",
    width: "30%",
    render: (c: any) =>
      c.image ? (
        <img
          src={c.image}
          alt={c.title}
          className="w-20 h-12 object-cover rounded"
        />
      ) : (
        "-"
      ),
  },
  {
    header: "Actions",
    align: "center" as const,
    width: "30%",
    render: (c: any) => (
      <div className="flex justify-center gap-2">
        <Button
          onClick={() => handleEdit(c)}
        >
          Edit
        </Button>

        <Button
          onClick={() => handleDelete(c._id)}
        >
          Delete
        </Button>
      </div>
    ),
  },
], []);

  /* -------------------- Render -------------------- */
  return (
    <div className="space-y-6">
      {/* Loading State */}
      {categories.loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb8b1d]"></div>
        </div>
      ) : (
        <>
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
          Showing {currentCategories.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredCategories.length)} of {filteredCategories.length} categories
        </span>
      </div>

      <CommonTable
  columns={categoryColumns}
  data={currentCategories}
  emptyMessage="No categories found"
/>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

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
        </>
      )}
    </div>
  );
}