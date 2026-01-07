import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package as PackageIcon } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { createCategory, updateCategory } from "../categories.slice";
import toast from "react-hot-toast";
import { Button } from "../../../components/common";

// helper components removed; simplified form uses basic inputs

// interface CategoryFormProps {
//   category?: any;
//   onSuccess?: () => void;
//   onCancel?: () => void;
// }

// Simplified Category Form (Title + Image)

export function CategoryForm({ category, onSuccess, onCancel }: any) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [title, setTitle] = useState<string>(category?.title || "");
   const [submitting, setSubmitting] = useState(false);
  // imagePreview stores image URL now
  const [imagePreview, setImagePreview] = useState<string>(category?.image || "");

  useEffect(() => {
    setTitle(category?.title || "");
    setImagePreview(category?.image || "");
  }, [category]);

  // image is provided as URL via input below


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if(submitting) return;
    setSubmitting(true);

    try {
      if (!title.trim()) {
        toast.error("Title is required");
        setSubmitting(false);
        return;
      }

      const payload = { 
        title: title.trim(),
        image: imagePreview.trim()
      };

      if (category && category._id) {
        await dispatch(updateCategory({ id: category._id, data: payload })).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createCategory(payload)).unwrap();
        toast.success("Category created successfully");
      }

      onSuccess && onSuccess();
      if (!onSuccess) {
        navigate("/admin-dashboard/category");
      }
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  // const clearImage = () => {
  //   setImageFile(null);
  //   setImagePreview("");
  // };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center mb-4">
        <PackageIcon className="w-6 h-6 text-orange-500 mr-2" />
        <h2 className="text-lg font-semibold text-gray-800">{category ? "Edit Category" : "Create Category"}</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Category title"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
          <div className="flex flex-col gap-3">
            <input
              value={imagePreview}
              onChange={(e) => setImagePreview(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none"
            />

            {imagePreview ? (
              <div className="flex items-center gap-2">
                <img src={imagePreview} alt="preview" className="w-20 h-20 object-cover rounded-md border" />
                <button type="button" onClick={() => setImagePreview("")} className="text-sm text-red-500 hover:underline">Remove</button>
              </div>
            ) : (
              <div className="text-sm text-gray-400">No image URL provided</div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          {onCancel && (
            <button 
              type="button" 
              onClick={onCancel} 
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          )}
          <Button 
            type="submit"
            text={category ? "Update Category" : "Create Category"}
            loading={submitting}
            disabled={submitting}
          />
        </div>
      </form>
    </div>
  );
}