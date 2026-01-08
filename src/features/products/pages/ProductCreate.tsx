import { useState, useEffect } from "react";
import { Package } from "lucide-react";

import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCategories } from "../../categories/categories.slice";
import { fetchSubCategories } from "../../subcategories/subcategories.slice";
import { createProduct } from "../products.slice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/common";
import { BasicInfoSection } from "../components/formSection/BasicInfoSection";
import { AdvantagesSection } from "../components/formSection/AdvantagesSection";
import { FeatureSection } from "../components/formSection/FeatureSection";
import { SpecificationSection } from "../components/formSection/SpecificationSection";
import { WarrantySection } from "../components/formSection/WarrantySection";
import { fetchProductTireKeys } from "../productTireKey.slice";

// Main Product Form
export default function ProductForm() {
  const [form, setForm] = useState<any>({
    modelNo: "",
    categoryType: "",
    categoryRef: "",
    description: "",
    isActive: true,
    product_tire_key_new: "",
    product: { image: "", video: "", pdf: "" },
    advantages: {
      image: "",
      video: "",
      pdf: "",
      type: [],
    },
    feature: { title: "", description: "", image: "", video: "", pdf: "" },
    specification: { title: "", description: "", image: "", video: "", pdf: "" },
    warranty: { title: "", description: "", image: "", video: "", pdf: "" },
  });


  const tireKeys = useAppSelector(
    (state: any) => state.productTireKeys?.data || []
  );


  const [submitting, setSubmitting] = useState(false);
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
    dispatch(fetchProductTireKeys());
  }, [dispatch]);

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
    if (submitting) return;
    setSubmitting(true);
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
        product_tire_key_new: form.product_tire_key_new || null,
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
          title: form.feature?.title || "",
          description: form.feature?.description || "",
          image: form.feature?.image || "",
          video: form.feature?.video || "",
          pdf: form.feature?.pdf || "",
        },
        specification: {
          title: form.specification?.title || "",
          description: form.specification?.description || "",
          image: form.specification?.image || "",
          video: form.specification?.video || "",
          pdf: form.specification?.pdf || "",
        },
        warranty: {
          title: form.warranty?.title || "",
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
    finally {
      setSubmitting(false);
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

        <BasicInfoSection
          form={form}
          setForm={setForm}
          categoriesArr={categoriesArr || []}
          subcategoriesArr={subcategoriesArr || []}
          selectedCategoryId={selectedCategoryId}
          selectedSubcategoryId={selectedSubcategoryId}
          onCategoryChange={handleCategoryChange}
          onSubcategoryChange={handleSubcategoryChange}
        />

        {/* Product Tire Key */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Product Tire Key</h2>
          <p className="text-sm text-gray-600 mb-6">Select the tire type and color for this product</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tireKeys.map((tk: any) => (
              <button
                key={tk._id}
                type="button"
                onClick={() => setForm({ ...form, product_tire_key_new: tk._id })}
                className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  form.product_tire_key_new === tk._id
                    ? "border-orange-500 bg-orange-50 shadow-md"
                    : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full border-2 border-white shadow-md flex-shrink-0"
                    style={{ backgroundColor: tk.color || "#cccccc" }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{tk.type}</p>
<<<<<<< HEAD
                    {/* <p className="text-xs text-gray-500 mt-1">{tk.color || "No color"}</p> */}
=======
                    <p className="text-xs text-gray-500 mt-1">{tk.color || "No color"}</p>
>>>>>>> e796990912641f753bd0ee40930a355e4f412b3a
                  </div>
                </div>
                
                {form.product_tire_key_new === tk._id && (
                  <div className="absolute top-2 right-2">
                    <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
            
            {/* None Option */}
            <button
              type="button"
              onClick={() => setForm({ ...form, product_tire_key_new: "" })}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                !form.product_tire_key_new
                  ? "border-orange-500 bg-orange-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-orange-300 hover:shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center flex-shrink-0 bg-gray-50">
                  <span className="text-gray-400 text-xl">−</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">None</p>
                  <p className="text-xs text-gray-500 mt-1">No tire key</p>
                </div>
              </div>
              
              {!form.product_tire_key_new && (
                <div className="absolute top-2 right-2">
                  <svg className="w-5 h-5 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </button>
          </div>
        </div>


        <AdvantagesSection
          form={form}
          setForm={setForm}
          addAdvantageType={addAdvantageType}
          removeAdvantageType={removeAdvantageType}
          addPoint={addPoint}
          removePoint={removePoint}
        />

        <FeatureSection
          feature={form.feature}
          setFeature={(data) => setForm({ ...form, feature: data })}
        />

        <SpecificationSection
          specification={form.specification}
          setSpecification={(data) => setForm({ ...form, specification: data })}
        />

        <WarrantySection
          warranty={form.warranty}
          setWarranty={(data) => setForm({ ...form, warranty: data })}
        />

        {/* Submit Button */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <Button text="Submit Product" onClick={submit} icon={<Package />} loading={submitting}
  disabled={submitting}  />
        </div>
      </div>
    </div>
  );
}
