import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../../app/hooks";
import {
  createSubCategory,
  updateSubCategory,
} from "../../subcategories.slice";
import toast from "react-hot-toast";
import { Button } from "../../../../components/common/Button/Button";

export function SubCategoryModalForm({
  subCategory,
  categories,
  onSuccess,
  onCancel,
}: any) {
  const dispatch = useAppDispatch();

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setTitle(subCategory?.title || "");
    setImage(subCategory?.image || "");
    setCategoryId(subCategory?.categoryId || "");
  }, [subCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!title.trim() || !image.trim() || !categoryId) {
      toast.error("All fields are required");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        title: title.trim(),
        image: image.trim(),
        categoryId,
      };

      if (subCategory?._id) {
        await dispatch(
          updateSubCategory({ id: subCategory._id, data: payload })
        ).unwrap();
        toast.success("Subcategory updated successfully");
      } else {
        await dispatch(createSubCategory(payload)).unwrap();
        toast.success("Subcategory created successfully");
      }

      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl">
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Header */}
        {/* <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            {subCategory?._id ? "Edit Subcategory" : "Create Subcategory"}
          </h2>
          <p className="text-gray-600 mt-2">Fill in the subcategory details below</p>
        </div> */}

        <div onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5ce07] focus:border-transparent transition-all outline-none hover:border-[#b5ce07]/50"
              placeholder="Enter subcategory title"
              required
            />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              
              Image URL
            </label>
            <input
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5ce07] focus:border-transparent transition-all outline-none hover:border-[#b5ce07]/50"
              placeholder="https://example.com/image.jpg"
              required
            />

            {image && (
              <div className="mt-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border-2 border-gray-200">
                <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
                <img
                  src={image}
                  alt="preview"
                  className="w-32 h-24 object-cover rounded-lg border-2 border-white shadow-md"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+Image";
                  }}
                />
              </div>
            )}
          </div>

          {/* Category */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              
              Parent Category
            </label>
            <div className="relative">
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b5ce07] focus:border-transparent transition-all outline-none hover:border-[#b5ce07]/50 bg-white appearance-none cursor-pointer"
                required
              >
                <option value="">Select a category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.title}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t-2 border-gray-100">
            <Button
              onClick={onCancel}
            >
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                subCategory?._id ? "Update Subcategory" : "Create Subcategory"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
