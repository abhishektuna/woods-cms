import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { createSubCategory } from "../subcategories.slice";
import { fetchCategories } from "../../categories/categories.slice";
import toast from "react-hot-toast";
import { Button } from "../../../components/common";

export function SubCategoryForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

 const categories = useAppSelector((state) => state.categories);
  const categoriesArr = Array.isArray(categories.data)
    ? categories.data
    : categories?.data || [];

  const [title, setTitle] = useState("");
  // store image as URL (string)
  const [image, setImage] = useState<string>("");
  const [categoryId, setCategoryId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Image is provided as a URL string via the input below.

  const handleSubmit = async () => {
    if (submitting) return;

    setSubmitting(true);
          try{
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!categoryId) {
      toast.error("Category is required");
      return;
    }

    const payload: any = {
      title: title.trim(),
      categoryId,
    };

    if (image.trim()) {
      payload.image = image.trim();
    }

      await dispatch(createSubCategory(payload)).unwrap();
      toast.success("Subcategory created successfully");
      navigate("/admin-dashboard/subcategory");
    } catch (err) {
      toast.error("Failed to create subcategory");
      console.log("err",err)
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Create Subcategory</h2>
        <Button
          text="Back"
          onClick={() => navigate(-1)}
          className="!bg-gray-100 !text-gray-700 hover:!bg-gray-200"
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Title
          </label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Subcategory title"
          />
        </div>

        {/* Image (URL) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <input
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="https://..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500"
          />

          {image && (
            <div className="mt-3 flex items-center gap-3">
              <img src={image} alt="preview" className="w-28 h-16 object-cover rounded" />
              <button
                className="ml-auto text-red-500"
                onClick={() => setImage("")}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          >
            <option value="">Select category</option>
            {categoriesArr.map((c: any) => (
              <option key={c._id} value={c._id}>
                {c.title}
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 mt-6">
          <Button
            onClick={handleSubmit}
            disabled={submitting}
             loading={submitting}
            className="bg-[#eb8b1d] text-white px-4 py-2 rounded hover:bg-[#d47a15]"
          >
            Create Subcategory
          </Button>
        </div>
      </div>
    </div>
  );
}
