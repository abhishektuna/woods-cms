import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchSubCategories,
  deleteSubCategory,
} from "../subcategories.slice";
import { fetchCategories } from "../../categories/categories.slice";
import { Button } from "../../../components/common/Button/Button";
import { Filter, X } from "lucide-react";
import toast from "react-hot-toast";
const Swal = await import("sweetalert2");
import { CommonTable } from "../../../components/common/Table/CommonTable";
import { Modal } from "../../../components/common/Modal/Modal";
import { ViewModal } from "../../../components/common/ViewModal/ViewModal";
import { ActionButton } from "../../../components/common/ActionButton/ActionButton";
import { SearchBar } from "../../../components/common/SearchBar/SearchBar";
import { usePagination } from "../../../hooks/usePagination";
import { Pagination } from "../../../components/common/Pagination/Pagination";
import { SubCategoryModalForm } from "../components/Modal/SubCategoryModalForm";
import { SubCategoryView } from "../components/SubCategoryView";
import { useNavigate } from "react-router-dom";

export function SubCategoryPage() {
  const dispatch = useAppDispatch();
  const subcategories = useAppSelector((state: any) => state.subcategories);
  const categories = useAppSelector((state: any) => state.categories);

  const subcatsArr = Array.isArray(subcategories.data) ? subcategories.data : [];
  const categoriesArr = Array.isArray(categories.data) ? categories.data : [];

  const [showForm, setShowForm] = useState(false);
const [selectedSubCategory, setSelectedSubCategory] = useState<any>(null);

// View states
const [showViewModal, setShowViewModal] = useState(false);
const [viewingSubCategory, setViewingSubCategory] = useState<any>(null);

const navigate = useNavigate();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // UI states
  const [showFilters, setShowFilters] = useState(false);

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

  // Pagination calculations via shared hook
  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData: currentItems,
  } = usePagination(filtered, itemsPerPage);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, itemsPerPage]);

  /* -------------------- Handlers -------------------- */
  const handleEdit = (item: any) => {
  setSelectedSubCategory(item);
  setShowForm(true);
};

  const handleView = (subCategory: any) => {
  setViewingSubCategory(subCategory);
  setShowViewModal(true);
};

  const handleCreate = () => {
  navigate("create");
};

  const handleDelete = async (id: string) => {
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
        await dispatch(deleteSubCategory(id)).unwrap();
        toast.success("Subcategory deleted successfully");
      } catch (err) {
        toast.error("Failed to delete subcategory");
        console.error(err);
      }
    }
  };



  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
  };

  const hasActiveFilters = searchTerm !== "" || selectedCategory !== "all";

  /*------------------------- Table Columns --------------------*/
  const subCategoryColumns = useMemo(() => [
  {
    header: "Title",
    width: "35%",
    render: (s: any) => (
      <div className="font-medium text-gray-900 truncate" title={s.title}>
        {s.title}
      </div>
    ),
  },
  {
    header: "Image",
    width: "20%",
    render: (s: any) =>
      s.image ? (
        <img
          src={s.image}
          alt={s.title}
          className="w-20 h-12 object-cover rounded-lg shadow-sm"
        />
      ) : (
        <span className="text-gray-400 text-sm">No image</span>
      ),
  },
  {
    header: "Category",
    width: "25%",
    render: (s: any) => {
      const categoryTitle = categoriesArr.find((c: any) => c._id === s.categoryId)?.title || "-";
      return (
        <div className="truncate" title={categoryTitle}>
          {categoryTitle}
        </div>
      );
    },
  },
  {
    header: "Actions",
    align: "center" as const,
    width: "20%",
    render: (s: any) => (
      <div className="flex justify-center gap-1.5">
        <ActionButton action="view" onClick={() => handleView(s)} />
        <ActionButton action="edit" onClick={() => handleEdit(s)} />
        <ActionButton action="delete" onClick={() => handleDelete(s._id)} />
      </div>
    ),
  },
], [categoriesArr]);

  /* -------------------- Render -------------------- */
  return (
    <div className="space-y-6">
      {/* Loading State */}
      {subcategories.loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb8b1d]"></div>
        </div>
      ) : (
        <>
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
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search subcategories..."
          />

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
          Showing {currentItems.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filtered.length)} of {filtered.length} subcategories
        </span>
      </div>

  <CommonTable
  columns={subCategoryColumns}
  data={currentItems}
  emptyMessage="No subcategories found"
/>

      {/* Pagination */}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </>
      )}
      {/* -------------------- SubCategory View Modal -------------------- */}
      {showViewModal && (
        <ViewModal
          isOpen={showViewModal}
          onClose={() => setShowViewModal(false)}
          title={`${viewingSubCategory?.title || "Subcategory"} Details`}
          size="md"
        >
          <SubCategoryView subCategory={viewingSubCategory} categories={categoriesArr} />
        </ViewModal>
      )}

      {/* -------------------- SubCategory Form Modal -------------------- */}
      {showForm && (
        <Modal
          isOpen={showForm}
          onClose={() => setShowForm(false)}
          title={selectedSubCategory ? "Edit Subcategory" : "Create Subcategory"}
          size="md"
        >
          <div className="p-6">
            <SubCategoryModalForm
              subCategory={selectedSubCategory}
              categories={categoriesArr}
              onCancel={() => setShowForm(false)}
              onSuccess={() => {
                setShowForm(false);
                dispatch(fetchSubCategories());
              }}
            />
          </div>
        </Modal>
      )}
    </div>
  );
}