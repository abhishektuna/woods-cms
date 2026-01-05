import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchProducts, deleteProduct } from "../products.slice";
import { Button } from "../../../components/common/Button/Button";
import { ProductForm } from "../components/ProductForm";
import { Search, ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { confirm } from "react-confirm-box";
import toast from "react-hot-toast";
import { NavLink } from "react-router-dom";

export function ProductPage() {
  const dispatch = useAppDispatch();
  const products = useAppSelector((state) => state.products);
  const productsArr = products.data || [];

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // UI states
  const [showFilters, setShowFilters] = useState(false);

  /* -------------------- Fetch Products -------------------- */
  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // Extract unique categories and subcategories
  const { categories, subcategories } = useMemo(() => {
    const cats = new Set<string>();
    const subcats = new Set<string>();
    
    productsArr.forEach((p: any) => {
      if (p.category) cats.add(p.category);
      if (p.subcategory) subcats.add(p.subcategory);
    });
    
    return {
      categories: Array.from(cats).sort(),
      subcategories: Array.from(subcats).sort(),
    };
  }, [productsArr]);

  // Filter and search products
  const filteredProducts = useMemo(() => {
    return productsArr.filter((product: any) => {
      const matchesSearch =
        searchTerm === "" ||
        product.modelNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || product.categoryType === selectedCategory;

      const matchesSubcategory =
        selectedSubcategory === "all" || product.subcategory === selectedSubcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [productsArr, searchTerm, selectedCategory, selectedSubcategory]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);
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
    const result = await confirm("Are you sure you want to delete this product?");
    if (result) {
      dispatch(deleteProduct(productId)).then(() => {
        toast.success("Product deleted successfully");
      });
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    dispatch(fetchProducts());
    toast.success("Product saved successfully");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedSubcategory("all");
  };

  const hasActiveFilters =
    searchTerm !== "" || selectedCategory !== "all" || selectedSubcategory !== "all";

  /* -------------------- Loading State -------------------- */
  if (products.loading) {
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
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <NavLink to="create">
        <Button className="bg-[#eb8b1d] text-white hover:bg-[#d47a15] transition">
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
          Showing {currentProducts.length === 0 ? 0 : startIndex + 1} to{" "}
          {Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}{" "}
          products
        </span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 table-fixed">
            <thead className="bg-[#eb8b1d]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-1/6">
                  Model No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-1/6">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-1/6">
                  Subcategory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-1/3">
                  Description
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider w-1/12">
                  Active
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-1/6">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Filter className="w-12 h-12 text-gray-300" />
                      <p className="text-gray-500 font-medium">No products found</p>
                      <p className="text-sm text-gray-400">
                        Try adjusting your filters or search term
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                currentProducts.map((p: any) => (
                  <tr key={p._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-[10rem] whitespace-normal break-words">
  {p.modelNo}
</td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-[8rem] whitespace-normal break-words">
  {p.category?.name || "-"}
</td>
                  
<td className="px-6 py-4 text-sm text-gray-700 max-w-[8rem] whitespace-normal break-words">
  {p.subcategory?.name || "-"}
</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="max-w-[11rem] break-words whitespace-normal" title={p.description}>
  {p.description}
</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          p.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {p.isActive ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          onClick={() => handleEdit(p)}
                          className="bg-[#b5ce07] text-black hover:bg-[#a3ba06] transition px-3 py-1"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(p._id)}
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

      {/* -------------------- Product Form Modal -------------------- */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start pt-10 z-50 overflow-y-auto">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-4/5 lg:w-3/5 max-h-[90vh] overflow-y-auto my-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {selectedProduct ? "Edit Product" : "Create Product"}
            </h2>
            <ProductForm product={selectedProduct} onSuccess={handleFormSuccess} />
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
    </div>
  );
}