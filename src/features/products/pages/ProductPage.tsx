import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProducts, deleteProduct } from "../products.slice";
import { fetchCategories } from "../../categories/categories.slice";
import { fetchSubCategories } from "../../subcategories/subcategories.slice";
import { Button } from "../../../components/common/Button/Button";
import { ProductForm } from "../components/ProductForm";
import { Search, Filter, X } from "lucide-react";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";
const Swal = await import("sweetalert2");
import { CommonTable } from "../../../components/common/Table/CommonTable";
import { usePagination } from "../../../hooks/usePagination";
import { Pagination } from "../../../components/common/Pagination/Pagination";

export function ProductPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
  const categoriesState = useAppSelector((state) => state.categories);
  const subcategoriesState = useAppSelector((state) => state.subcategories);
  const productsArr = products.data || [];
  const categoriesArr = Array.isArray(categoriesState.data) ? categoriesState.data : [];
  const subcategoriesArr = Array.isArray(subcategoriesState.data) ? subcategoriesState.data : [];


  // Form states
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);


  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  
  // Pagination states
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);

  /* -------------------- Fetch Products -------------------- */
  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  // Extract unique categories and subcategories
  const { categories, subcategories } = useMemo(() => {
    const cats = categoriesArr.map((c: any) => c.title || c.name).filter(Boolean);
    const subcats = subcategoriesArr.map((s: any) => s.title || s.name).filter(Boolean);
    
    return {
      categories: cats.sort(),
      subcategories: subcats.sort(),
    };
  }, [categoriesArr, subcategoriesArr]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return productsArr.filter((product: any) => {
      const matchesSearch =
        searchTerm === "" ||
        product.modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.category?.name === selectedCategory;

      const matchesSubcategory =
        selectedSubcategory === "all" || product.subcategory?.name === selectedSubcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [productsArr, searchTerm, selectedCategory, selectedSubcategory]);

  // Pagination calculations
const {
  currentPage,
  setCurrentPage,
  totalPages,
  paginatedData: currentProducts,
} = usePagination(filteredProducts, itemsPerPage);
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory, selectedSubcategory, itemsPerPage]);

  /* -------------------- Handlers -------------------- */
  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setShowForm(true);
  };

  // const handleCreate = () => {
  //   setSelectedProduct(null);
  //   setShowForm(true);
  // };

  const handleDelete = async (productId: string) => {
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
        await dispatch(deleteProduct(productId)).unwrap();
        toast.success("Product deleted successfully");
      } catch (err) {
        toast.error("Failed to delete product");
        console.error(err);
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    dispatch(fetchProducts());
    toast.success("Product edited successfully");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
  };

  const hasActiveFilters =
    searchTerm !== "" || selectedCategory !== "all" || selectedSubcategory !== "all";

  /* -------------------- Product Columns Definition -------------------- */
  const productColumns = useMemo(() => [
    {
      header: "Model No",
      width: "15%",
      render: (p: any) => (
        <div className="font-medium text-gray-900 break-words">
          {p.modelNo}
        </div>
      ),
    },
    {
      header: "Category",
      width: "15%",
      render: (p: any) => p.category?.name || "-",
    },
    {
      header: "Subcategory",
      width: "15%",
      render: (p: any) => p.subcategory?.name || "-",
    },
    {
      header: "Description",
      width: "30%",
      render: (p: any) => (
        <div className="max-w-[11rem] break-words" title={p.description}>
          {p.description}
        </div>
      ),
    },
    {
      header: "Active",
      width: "10%",
      render: (p: any) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${
            p.isActive
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {p.isActive ? "Yes" : "No"}
        </span>
      ),
    },
    {
      header: "Actions",
      align: "center" as const,
      width: "15%",
      render: (p: any) => (
        <div className="flex justify-center gap-2">
          <Button onClick={() => handleEdit(p)}>
            Edit
          </Button>
          <Button onClick={() => handleDelete(p._id)}>
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
      {products.loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb8b1d]"></div>
        </div>
      ) : (
        <>
          {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <NavLink to="create">
        <Button>
          + Create Product
        </Button>
        </NavLink>
      </div>

      {/* Search and Filters Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by model no or description..."
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
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Subcategory Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subcategory
                </label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => setSelectedSubcategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none"
                >
                  <option value="all">All Subcategories</option>
                  {subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

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
          Showing {currentProducts.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
        </span>
      </div>

      {/* Table */}
     <CommonTable
  columns={productColumns}
  data={currentProducts}
  loading={products.loading}
  emptyMessage="No products found"
/>


      {/* Pagination */}
   <Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>
      {/* -------------------- Product Form Modal -------------------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-y-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedProduct ? "Edit Product" : "Create Product"}
            </h2>
            <ProductForm  product={selectedProduct} onSuccess={handleFormSuccess} />
            <div className="mt-6 flex justify-end gap-2">
              <Button
                onClick={() => setShowForm(false)}
                className="bg-gray-300 text-black hover:bg-gray-400 transition px-6 py-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
}