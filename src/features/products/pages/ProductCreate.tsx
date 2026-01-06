import { useState, useEffect } from "react";
import { Trash2, Plus, Package, FileText } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCategories } from "../../categories/categories.slice";
import { fetchSubCategories } from "../../subcategories/subcategories.slice";
import { createProduct } from "../products.slice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

// Enhanced TextInput Component
const TextInput = ({
  label,
  value,
  onChange,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
    />
  </div>
);

// Enhanced SelectBox Component
const SelectBox = ({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { label: string; value: string }[];
  onChange: (v: string) => void;
}) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none bg-white"
    >
      <option value="">Select an option</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

// NOTE: File upload inputs removed — replaced by text URL inputs to accept image/video/pdf URLs.

// Enhanced Button Component
const Button = ({
  text,
  onClick,
  variant = "primary",
  icon: Icon,
}: {
  text: string;
  onClick: () => void;
  variant?: "primary" | "secondary" | "danger";
  icon?: any;
}) => {
  const variants = {
    primary: "bg-orange-500 hover:bg-orange-600 text-white",
    secondary: "bg-gray-100 hover:bg-gray-200 text-gray-700",
    danger: "bg-red-500 hover:bg-red-600 text-white",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center px-4 py-2.5 rounded-lg font-medium transition-all ${variants[variant]} shadow-sm hover:shadow-md`}
    >
      {Icon && <Icon className="w-4 h-4 mr-2" />}
      {text}
    </button>
  );
};

// Main Product Form
export default function ProductForm() {
  const [form, setForm] = useState<any>({
    modelNo: "",
    categoryType: "",
    categoryRef: "",
    description: "",
    isActive: true,
    product_tire_key: [],
    product: { image: "", video: "", pdf: "" },
    advantages: {
      image: "",
      video: "",
      pdf: "",
      type: [],
    },
    feature: { description: "", image: "", video: "", pdf: "" },
    specification: { description: "", image: "", video: "", pdf: "" },
    warranty: { description: "", image: "", video: "", pdf: "" },
  });

  const [tireKeyInput, setTireKeyInput] = useState("");
  const navigate = useNavigate();

  // Track selected option ids separately so we can store titles/ids in the form fields as required
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedSubcategoryId, setSelectedSubcategoryId] =
    useState<string>("");

  const dispatch = useAppDispatch();
  const subcategories = useAppSelector((state: any) => state.subcategories);
  const subcategoriesArr = Array.isArray(subcategories?.data)
    ? subcategories.data
    : [];

  const categories = useAppSelector((state: any) => state.categories);
  const categoriesArr = Array.isArray(categories?.data) ? categories.data : [];

  // Handlers to set `categoryType` ("category" | "subcategory") and `categoryRef` (id) per requirements
  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id);
    setSelectedSubcategoryId(""); // clearing subcategory selection when choosing a category
    // set categoryType to literal "category" and categoryRef to selected id
    setForm({ ...form, categoryType: "category", categoryRef: id });
  };

  const handleSubcategoryChange = (id: string) => {
    setSelectedSubcategoryId(id);
    // set categoryType to literal "subcategory" and categoryRef to subcategory id
    setForm({ ...form, categoryType: "subcategory", categoryRef: id });
  };

  console.log("subcategories:", subcategories);
  console.log("categories:", categories);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  const addTireKey = () => {
    if (
      tireKeyInput.trim() &&
      !form.product_tire_key.includes(tireKeyInput.trim())
    ) {
      form.product_tire_key.push(tireKeyInput.trim());
      setForm({ ...form });
      setTireKeyInput("");
    }
  };

  const removeTireKey = (index: number) => {
    form.product_tire_key.splice(index, 1);
    setForm({ ...form });
  };

  const addAdvantageType = () => {
    form.advantages.type.push({
      title: "",
      points: [],
    });
    setForm({ ...form });
  };

  const removeAdvantageType = (aIndex: number) => {
    form.advantages.type.splice(aIndex, 1);
    setForm({ ...form });
  };

  const addPoint = (aIndex: number) => {
    form.advantages.type[aIndex].points.push({
      title: "",
      description: "",
      image: "",
      video: "",
      pdf: "",
    });
    setForm({ ...form });
  };

  const removePoint = (aIndex: number, pIndex: number) => {
    form.advantages.type[aIndex].points.splice(pIndex, 1);
    setForm({ ...form });
  };

  const submit = async () => {
    try {
      // Build JSON payload matching the Postman example structure
      const advantagesMeta = (form.advantages?.type || []).map((t: any) => ({
        title: t.title,
        points: (t.points || []).map((p: any) => ({
          title: p.title,
          description: p.description,
          image: p.image || "",
          video: p.video || "",
          pdf: p.pdf || "",
        })),
      }));

      // Normalize and validate category fields so we only send valid enums and required model
      let categoryTypeNormalized: string = form.categoryType;
      let categoryRefNormalized: string = form.categoryRef;

      // If categoryType contains a title (e.g., 'fully automatic'), try to map it to category/subcategory by title
      if (
        categoryTypeNormalized &&
        categoryTypeNormalized !== "category" &&
        categoryTypeNormalized !== "subcategory"
      ) {
        const matchedCat = categoriesArr.find(
          (c: any) => c.title === categoryTypeNormalized
        );
        if (matchedCat) {
          categoryTypeNormalized = "category";
          categoryRefNormalized = matchedCat._id;
          setSelectedCategoryId(matchedCat._id);
        } else {
          const matchedSub = subcategoriesArr.find(
            (s: any) => s.title === categoryTypeNormalized
          );
          if (matchedSub) {
            categoryTypeNormalized = "subcategory";
            categoryRefNormalized = matchedSub._id;
            setSelectedSubcategoryId(matchedSub._id);
            if (matchedSub.categoryId)
              setSelectedCategoryId(matchedSub.categoryId);
          }
        }
      }

      // If nothing found by title, fall back to selected ids in the UI
      if (!categoryRefNormalized) {
        if (selectedSubcategoryId) {
          categoryTypeNormalized = "subcategory";
          categoryRefNormalized = selectedSubcategoryId;
        } else if (selectedCategoryId) {
          categoryTypeNormalized = "category";
          categoryRefNormalized = selectedCategoryId;
        }
      }

      const categoryModel =
        categoryTypeNormalized === "category"
          ? "Category"
          : categoryTypeNormalized === "subcategory"
          ? "SubCategory"
          : "";

      if (!categoryTypeNormalized || !categoryRefNormalized || !categoryModel) {
        console.error("Category validation failed:", {
          categoryTypeNormalized,
          categoryRefNormalized,
          categoryModel,
        });
        toast(
          "Please select a valid category or subcategory before submitting.",
          {
            duration: 5000,
          }
        );
        return;
      }

      // Persist normalized values back into form state for consistency
      setForm({
        ...form,
        categoryType: categoryTypeNormalized,
        categoryRef: categoryRefNormalized,
      });

      const payloadToSend = {
        modelNo: form.modelNo || "",
        image: form.product?.image || "",
        video: form.product?.video || "",
        pdf: form.product?.pdf || "",
        product_tire_key: form.product_tire_key || [],
        categoryType: categoryTypeNormalized,
        categoryModel: categoryModel,
        categoryRef: categoryRefNormalized,
        description: form.description || "",
        advantages: {
          image: form.advantages?.image || "",
          video: form.advantages?.video || "",
          pdf: form.advantages?.pdf || "",
          type: advantagesMeta,
        },
        feature: {
          description: form.feature?.description || "",
          image: form.feature?.image || "",
          video: form.feature?.video || "",
          pdf: form.feature?.pdf || "",
        },
        specification: {
          description: form.specification?.description || "",
          image: form.specification?.image || "",
          video: form.specification?.video || "",
          pdf: form.specification?.pdf || "",
        },
        warranty: {
          description: form.warranty?.description || "",
          image: form.warranty?.image || "",
          video: form.warranty?.video || "",
          pdf: form.warranty?.pdf || "",
        },
        isActive: !!form.isActive,
      };

      console.log("Payload JSON:", payloadToSend);

      // Use unwrap so server errors are thrown and we can inspect response.data
      try {
        const payload = await dispatch(createProduct(payloadToSend)).unwrap();
        console.log(payload);
        console.log("CREATE SUCCESS:", payload);
        toast.success("Product created");
        setTimeout(() => {
          navigate("/admin-dashboard/product");
        }, 2000);
      } catch (err: any) {
        // Axios errors usually contain response.data
        console.error(
          "CREATE FAILED:",
          err?.response?.data ?? err.message ?? err
        );
        // Re-throw so the UI could handle it if needed
        throw err;
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center mb-2">
            <Package className="w-8 h-8 text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-800">Create Product</h1>
          </div>
          <p className="text-gray-600">
            Fill in the details to add a new product to your catalog
          </p>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-orange-500" />
            Basic Information
          </h2>

          <TextInput
            label="Model Number"
            value={form.modelNo}
            onChange={(v) => (form.modelNo = v) && setForm({ ...form })}
            placeholder="e.g., XYZ-1234"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Product Image URL"
              value={form.product.image}
              onChange={(v) => (form.product.image = v) && setForm({ ...form })}
              placeholder="https://..."
            />
            <TextInput
              label="Product Video URL"
              value={form.product.video}
              onChange={(v) => (form.product.video = v) && setForm({ ...form })}
              placeholder="https://..."
            />
            <TextInput
              label="Product PDF URL"
              value={form.product.pdf}
              onChange={(v) => (form.product.pdf = v) && setForm({ ...form })}
              placeholder="https://..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectBox
              label="Category"
              value={selectedCategoryId}
              options={(categoriesArr || []).map((c: any) => ({
                label: c.title,
                value: c._id,
              }))}
              onChange={handleCategoryChange}
            />

            <SelectBox
              label="Subcategory"
              value={selectedSubcategoryId}
              options={(subcategoriesArr || []).map((s: any) => ({
                label: s.title,
                value: s._id,
              }))}
              onChange={handleSubcategoryChange}
            />
          </div>

          <TextInput
            label="Description"
            value={form.description}
            onChange={(v) => (form.description = v) && setForm({ ...form })}
            placeholder="Enter product description"
          />

          {/* Product Tire Keys */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Product Tire Keys
            </label>
            <div className="flex gap-2 mb-3">
              <input
                value={tireKeyInput}
                onChange={(e) => setTireKeyInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addTireKey()}
                placeholder="e.g., tire-key-1"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none"
              />
              <Button
                text="Add"
                onClick={addTireKey}
                variant="secondary"
                icon={Plus}
              />
            </div>
            {form.product_tire_key.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {form.product_tire_key.map((key: string, index: number) => (
                  <div
                    key={index}
                    className="inline-flex items-center bg-orange-100 text-orange-800 px-3 py-1.5 rounded-full text-sm font-medium"
                  >
                    <span>{key}</span>
                    <button
                      onClick={() => removeTireKey(index)}
                      className="ml-2 text-orange-600 hover:text-orange-800 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Advantages Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Product Advantages
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Advantage Image URL"
              value={form.advantages.image}
              onChange={(v) =>
                (form.advantages.image = v) && setForm({ ...form })
              }
              placeholder="https://..."
            />
            <TextInput
              label="Advantage Video URL"
              value={form.advantages.video}
              onChange={(v) =>
                (form.advantages.video = v) && setForm({ ...form })
              }
              placeholder="https://..."
            />
            <TextInput
              label="Advantage PDF URL"
              value={form.advantages.pdf}
              onChange={(v) =>
                (form.advantages.pdf = v) && setForm({ ...form })
              }
              placeholder="https://..."
            />
          </div>

          <Button
            text="Add Advantage Type"
            onClick={addAdvantageType}
            icon={Plus}
          />

          {/* Advantage Types */}
          <div className="mt-6 space-y-4">
            {form.advantages.type.map((adv: any, aIndex: number) => (
              <div
                key={aIndex}
                className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">
                    Advantage Type #{aIndex + 1}
                  </h3>
                  <button
                    onClick={() => removeAdvantageType(aIndex)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                <TextInput
                  label="Advantage Title"
                  value={adv.title}
                  onChange={(v) => (adv.title = v) && setForm({ ...form })}
                  placeholder="Enter advantage title"
                />

                <Button
                  text="Add Point"
                  onClick={() => addPoint(aIndex)}
                  variant="secondary"
                  icon={Plus}
                />

                {/* Points */}
                <div className="mt-4 space-y-4">
                  {adv.points.map((p: any, pIndex: number) => (
                    <div
                      key={pIndex}
                      className="bg-white border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-gray-600">
                          Point #{pIndex + 1}
                        </h4>
                        <button
                          onClick={() => removePoint(aIndex, pIndex)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <TextInput
                        label="Point Title"
                        value={p.title}
                        onChange={(v) => (p.title = v) && setForm({ ...form })}
                        placeholder="Enter point title"
                      />
                      <TextInput
                        label="Point Description"
                        value={p.description}
                        onChange={(v) =>
                          (p.description = v) && setForm({ ...form })
                        }
                        placeholder="Enter point description"
                      />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <TextInput
                          label="Image URL"
                          value={p.image}
                          onChange={(v) =>
                            (p.image = v) && setForm({ ...form })
                          }
                          placeholder="https://..."
                        />
                        <TextInput
                          label="Video URL"
                          value={p.video}
                          onChange={(v) =>
                            (p.video = v) && setForm({ ...form })
                          }
                          placeholder="https://..."
                        />
                        <TextInput
                          label="PDF URL"
                          value={p.pdf}
                          onChange={(v) => (p.pdf = v) && setForm({ ...form })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* feature Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-orange-500" />
            feature Information
          </h2>

          <TextInput
            label="Description"
            value={form.feature.description}
            onChange={(v) =>
              (form.feature.description = v) && setForm({ ...form })
            }
            placeholder="Enter product description"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Feature Image URL"
              value={form.feature.image}
              onChange={(v) => (form.feature.image = v) && setForm({ ...form })}
              placeholder="https://..."
            />
            <TextInput
              label="Feature Video URL"
              value={form.feature.video}
              onChange={(v) => (form.feature.video = v) && setForm({ ...form })}
              placeholder="https://..."
            />
            <TextInput
              label="Feature PDF URL"
              value={form.feature.pdf}
              onChange={(v) => (form.feature.pdf = v) && setForm({ ...form })}
              placeholder="https://..."
            />
          </div>
        </div>
        {/* specification Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-orange-500" />
            specification Information
          </h2>

          <TextInput
            label="Description"
            value={form.specification.description}
            onChange={(v) =>
              (form.specification.description = v) && setForm({ ...form })
            }
            placeholder="Enter product description"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Specification Image URL"
              value={form.specification.image}
              onChange={(v) =>
                (form.specification.image = v) && setForm({ ...form })
              }
              placeholder="https://..."
            />
            <TextInput
              label="Specification Video URL"
              value={form.specification.video}
              onChange={(v) =>
                (form.specification.video = v) && setForm({ ...form })
              }
              placeholder="https://..."
            />
            <TextInput
              label="Specification PDF URL"
              value={form.specification.pdf}
              onChange={(v) =>
                (form.specification.pdf = v) && setForm({ ...form })
              }
              placeholder="https://..."
            />
          </div>
        </div>
        {/* warranty Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-orange-500" />
            warranty Information
          </h2>

          <TextInput
            label="Description"
            value={form.warranty.description}
            onChange={(v) =>
              (form.warranty.description = v) && setForm({ ...form })
            }
            placeholder="Enter product description"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <TextInput
              label="Warranty Image URL"
              value={form.warranty.image}
              onChange={(v) =>
                (form.warranty.image = v) && setForm({ ...form })
              }
              placeholder="https://..."
            />
            <TextInput
              label="Warranty Video URL"
              value={form.warranty.video}
              onChange={(v) =>
                (form.warranty.video = v) && setForm({ ...form })
              }
              placeholder="https://..."
            />
            <TextInput
              label="Warranty PDF URL"
              value={form.warranty.pdf}
              onChange={(v) => (form.warranty.pdf = v) && setForm({ ...form })}
              placeholder="https://..."
            />
          </div>
        </div>
        {/* Submit Button */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Button text="Submit Product" onClick={submit} icon={Package} />
        </div>
      </div>
    </div>
  );
}
