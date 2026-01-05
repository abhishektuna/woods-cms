import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package as PackageIcon } from "lucide-react";
import { useAppDispatch } from "../../../app/hooks";
import { createCategory, updateCategory } from "../categories.slice";
import toast from "react-hot-toast";

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
  // imagePreview stores image URL now
  const [imagePreview, setImagePreview] = useState<string>(category?.image || "");

  useEffect(() => {
    setTitle(category?.title || "");
    setImagePreview(category?.image || "");
  }, [category]);

  // image is provided as URL via input below


  const handleSubmit = async () => {
    if (!title.trim()) return toast.error("Title is required");

    const payload: any = { title: title.trim() };

    if (imagePreview.trim()) {
      payload.image = imagePreview.trim();
    }

    try {
      if (category && category._id) {
        await dispatch(updateCategory({ id: category._id, data: payload })).unwrap();
        toast.success("Category updated");
      } else {
        await dispatch(createCategory(payload)).unwrap();
        toast.success("Category created");
      }

      onSuccess && onSuccess();
      if (!onSuccess) {
        navigate("/admin-dashboard/category");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong");
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

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Category title"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#eb8b1d] focus:border-transparent outline-none"
        />
      </div>

      <div className="mb-4">
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
          <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700">Cancel</button>
        )}
        <button onClick={handleSubmit} className="px-4 py-2 rounded-lg bg-[#eb8b1d] text-white">{category ? "Save" : "Create"}</button>
      </div>
    </div>
  );
}