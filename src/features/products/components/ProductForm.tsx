import { useState, type FormEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCategories } from "../../../features/categories/categories.slice";
import { fetchSubCategories } from "../../../features/subcategories/subcategories.slice";
import { fetchProductTireKeys } from "../productTireKey.slice";
import { updateProduct } from "../products.slice";
import { Button, Input, Textarea } from "../../../components/common/index";

interface AdvantagePoint {
  title: string;
  description: string;
  image?: string;
  video?: string;
  pdf?: string;
}

interface Advantage {
  title: string;
  points: AdvantagePoint[];
}

interface AdvantagesBlock {
  image?: string;
  video?: string;
  pdf?: string;
  type: Advantage[];
}

interface MediaBlock {
  title?: string;
  description?: string;
  image?: string;
  video?: string;
  pdf?: string;
}

interface ProductFormProps {
  product?: any;
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories);
  const subcategories = useAppSelector((state) => state.subcategories);
  const tireKeys = useAppSelector((state: any) => state.productTireKeys?.data || []);

  /* -------------------- Form State -------------------- */
  const [modelNo, setModelNo] = useState(product?.modelNo || "");
  const [image, setImage] = useState(product?.image || "");
  const [video, setVideo] = useState(product?.video || "");
  const [pdf, setPdf] = useState(product?.pdf || "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(
    product?.category?.id || ""
  );
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState(
    product?.subcategory?.id || ""
  );
  const [description, setDescription] = useState(product?.description || "");
  const [productTireKey, setProductTireKey] = useState<string>(
    product?.product_tire_key_new?._id || product?.product_tire_key_new || ""
  );
  const [advantages, setAdvantages] = useState<AdvantagesBlock>(
    product?.advantages || { image: "", video: "", pdf: "", type: [] }
  );
  const [feature, setFeature] = useState<MediaBlock>(product?.feature || { title: "", description: "", image: "", video: "", pdf: "" });
  const [specification, setSpecification] = useState<MediaBlock>(product?.specification || { title: "", description: "", image: "", video: "", pdf: "" });
  const [warranty, setWarranty] = useState<MediaBlock>(product?.warranty || { title: "", description: "", image: "", video: "", pdf: "" });
  const [isActive, setIsActive] = useState(product?.isActive ?? true);

  /* -------------------- Fetch Categories -------------------- */
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
    dispatch(fetchProductTireKeys());
  }, [dispatch]);

  /* -------------------- Handlers -------------------- */
  const handleCategoryChange = (id: string) => {
    setSelectedCategoryId(id);
    // Don't clear subcategory, let user keep it if it matches the new category
  };

  const handleSubcategoryChange = (id: string) => {
    setSelectedSubcategoryId(id);
    // Don't clear category when subcategory is selected
  };

  // Filter subcategories based on selected category
  const getFilteredSubcategories = () => {
    if (!selectedCategoryId) {
      return subcategories?.data || [];
    }
    return (subcategories?.data || []).filter(
      (s: any) => s.categoryId === selectedCategoryId
    );
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Determine categoryType and categoryModel based on selection
    let categoryType = "";
    let categoryRef = "";
    let categoryModel = "";
    
    if (selectedSubcategoryId) {
      categoryType = "subcategory";
      categoryRef = selectedSubcategoryId;
      categoryModel = "SubCategory";
    } else if (selectedCategoryId) {
      categoryType = "category";
      categoryRef = selectedCategoryId;
      categoryModel = "Category";
    } else {
      alert("Please select a category or subcategory");
      return;
    }
    
    const payload = {
      modelNo,
      image,
      video,
      pdf,
      categoryType,
      categoryModel,
      categoryRef,
      description,
      product_tire_key_new: productTireKey || null,
      advantages,
      feature,
      specification,
      warranty,
      isActive,
    };

    dispatch(updateProduct({ id: product._id, payload })).then(onSuccess);
  };

  const handleAdvantagePointChange = (
    advIndex: number,
    pointIndex: number,
    field: keyof AdvantagePoint,
    value: string
  ) => {
    const newAdv = [...advantages.type];
    newAdv[advIndex].points[pointIndex] = {
      ...newAdv[advIndex].points[pointIndex],
      [field]: value
    };
    setAdvantages({ ...advantages, type: newAdv });
  };

  const handleAddAdvantage = () => {
    setAdvantages({
      ...advantages,
      type: [...advantages.type, { title: "", points: [] }],
    });
  };

  const handleRemoveAdvantage = (advIndex: number) => {
    const newAdv = advantages.type.filter((_, index) => index !== advIndex);
    setAdvantages({ ...advantages, type: newAdv });
  };

  const handleAddAdvantagePoint = (advIndex: number) => {
    const newAdv = [...advantages.type];
    newAdv[advIndex].points.push({ title: "", description: "" });
    setAdvantages({ ...advantages, type: newAdv });
  };

  const handleRemoveAdvantagePoint = (advIndex: number, pointIndex: number) => {
    const newAdv = advantages.type.map((adv, idx) => {
      if (idx === advIndex) {
        return {
          ...adv,
          points: adv.points.filter((_, pIdx) => pIdx !== pointIndex)
        };
      }
      return adv;
    });
    setAdvantages({ ...advantages, type: newAdv });
  };

  /* -------------------- JSX -------------------- */
 return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Edit Product
            </h1>
            <p className="text-gray-600">Update the product details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Model Number */}
            <div className="bg-gradient-to-r from-[#b5ce07]/10 to-[#eb8b1d]/10 rounded-xl p-6">
              <Input label="Model No" value={modelNo} onChange={(e: any) => setModelNo(e.target.value)} required />
            </div>

            {/* Product Media */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#b5ce07] transition-colors">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Product Media</h2>
              <div className="space-y-4">
                <Input label="Image URL" value={image} onChange={(e: any) => setImage(e.target.value)} />
                <Input label="Video URL" value={video} onChange={(e: any) => setVideo(e.target.value)} />
                <Input label="PDF URL" value={pdf} onChange={(e: any) => setPdf(e.target.value)} />
              </div>
            </div>

            {/* Category Selection */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={selectedCategoryId}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b5ce07] focus:border-transparent transition-all outline-none bg-white"
                >
                  <option value="">Not selected</option>
                  {categories?.data?.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">Subcategory</label>
                <select
                  value={selectedSubcategoryId}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#b5ce07] focus:border-transparent transition-all outline-none bg-white"
                  disabled={!selectedCategoryId}
                >
                  <option value="">Not selected</option>
                  {getFilteredSubcategories().map((s: any) => (
                    <option key={s._id} value={s._id}>{s.title}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <Textarea label="Description" value={description} onChange={(e: any) => setDescription(e.target.value)} />

            {/* Tire Key */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#b5ce07] transition-colors">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Product Tire Key</h2>
              <p className="text-sm text-gray-600 mb-6">Select the tire type and color for this product</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tireKeys.map((tk: any) => (
                  <button
                    key={tk._id}
                    type="button"
                    onClick={() => setProductTireKey(tk._id)}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                      productTireKey === tk._id
                        ? "border-[#b5ce07] bg-[#b5ce07]/10 shadow-md"
                        : "border-gray-200 bg-white hover:border-[#b5ce07]/50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-white shadow-md flex-shrink-0"
                        style={{ backgroundColor: tk.color || "#cccccc" }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{tk.type}</p>
                        <p className="text-xs text-gray-500 mt-1">{tk.color || "No color"}</p>
                      </div>
                    </div>
                    
                    {productTireKey === tk._id && (
                      <div className="absolute top-2 right-2">
                        <svg className="w-5 h-5 text-[#b5ce07]" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
                
                {/* None Option */}
                <button
                  type="button"
                  onClick={() => setProductTireKey("")}
                  className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                    !productTireKey
                      ? "border-[#b5ce07] bg-[#b5ce07]/10 shadow-md"
                      : "border-gray-200 bg-white hover:border-[#b5ce07]/50 hover:shadow-sm"
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
                  
                  {!productTireKey && (
                    <div className="absolute top-2 right-2">
                      <svg className="w-5 h-5 text-[#b5ce07]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              </div>
            </div>

            {/* Advantages */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#eb8b1d] transition-colors">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Advantages</h2>
              
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl mb-5">
                <h3 className="font-semibold text-gray-800 mb-4">Advantages Media</h3>
                <div className="space-y-4">
                  <Input label="Image URL" value={advantages.image || ""} onChange={(e: any) => setAdvantages({ ...advantages, image: e.target.value })} />
                  <Input label="Video URL" value={advantages.video || ""} onChange={(e: any) => setAdvantages({ ...advantages, video: e.target.value })} />
                  <Input label="PDF URL" value={advantages.pdf || ""} onChange={(e: any) => setAdvantages({ ...advantages, pdf: e.target.value })} />
                </div>
              </div>

              {advantages.type.map((adv, advIndex) => (
                <div key={advIndex} className="border-2 border-[#eb8b1d]/20 rounded-xl p-5 mb-4 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-gray-800">Advantage {advIndex + 1}</h3>
                    <button
                      type="button"
                      onClick={() => handleRemoveAdvantage(advIndex)}
                      className="text-red-600 hover:text-red-700 font-semibold px-4 py-2 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                  <Input
                    label="Advantage Title"
                    value={adv.title}
                    onChange={(e: any) => {
                      const newAdv = [...advantages.type];
                      newAdv[advIndex].title = e.target.value;
                      setAdvantages({ ...advantages, type: newAdv });
                    }}
                  />

                  <div className="mt-4 space-y-3">
                    {adv.points.map((point, pointIndex) => (
                      <div key={pointIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <h4 className="font-semibold text-sm text-gray-700">Point {pointIndex + 1}</h4>
                          <button
                            type="button"
                            onClick={() => handleRemoveAdvantagePoint(advIndex, pointIndex)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            Remove Point
                          </button>
                        </div>
                        <div className="space-y-3">
                          <Input label="Point Title" value={point.title} onChange={(e: any) => handleAdvantagePointChange(advIndex, pointIndex, "title", e.target.value)} />
                          <Textarea label="Point Description" value={point.description} onChange={(e: any) => handleAdvantagePointChange(advIndex, pointIndex, "description", e.target.value)} />
                          <Input label="Image URL" value={point.image || ""} onChange={(e: any) => handleAdvantagePointChange(advIndex, pointIndex, "image", e.target.value)} />
                          <Input label="Video URL" value={point.video || ""} onChange={(e: any) => handleAdvantagePointChange(advIndex, pointIndex, "video", e.target.value)} />
                          <Input label="PDF URL" value={point.pdf || ""} onChange={(e: any) => handleAdvantagePointChange(advIndex, pointIndex, "pdf", e.target.value)} />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button type="button" onClick={() => handleAddAdvantagePoint(advIndex)} className="bg-[#b5ce07] text-black mt-4">
                    + Add Point
                  </Button>
                </div>
              ))}
              <Button type="button" onClick={handleAddAdvantage} className="bg-[#eb8b1d] text-white">
                + Add Advantage
              </Button>
            </div>

            {/* Feature */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#b5ce07] transition-colors">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Feature</h2>
              <div className="space-y-4">
                <Input label="Title" value={feature.title || ""} onChange={(e: any) => setFeature({ ...feature, title: e.target.value })} />
                <Textarea label="Description" value={feature.description || ""} onChange={(e: any) => setFeature({ ...feature, description: e.target.value })} />
                <Input label="Image URL" value={feature.image || ""} onChange={(e: any) => setFeature({ ...feature, image: e.target.value })} />
                <Input label="Video URL" value={feature.video || ""} onChange={(e: any) => setFeature({ ...feature, video: e.target.value })} />
                <Input label="PDF URL" value={feature.pdf || ""} onChange={(e: any) => setFeature({ ...feature, pdf: e.target.value })} />
              </div>
            </div>

            {/* Specification */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#eb8b1d] transition-colors">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Specification</h2>
              <div className="space-y-4">
                <Input label="Title" value={specification.title || ""} onChange={(e: any) => setSpecification({ ...specification, title: e.target.value })} />
                <Textarea label="Description" value={specification.description || ""} onChange={(e: any) => setSpecification({ ...specification, description: e.target.value })} />
                <Input label="Image URL" value={specification.image || ""} onChange={(e: any) => setSpecification({ ...specification, image: e.target.value })} />
                <Input label="Video URL" value={specification.video || ""} onChange={(e: any) => setSpecification({ ...specification, video: e.target.value })} />
                <Input label="PDF URL" value={specification.pdf || ""} onChange={(e: any) => setSpecification({ ...specification, pdf: e.target.value })} />
              </div>
            </div>

            {/* Warranty */}
            <div className="border-2 border-gray-200 rounded-xl p-6 hover:border-[#b5ce07] transition-colors">
              <h2 className="text-xl font-bold text-gray-800 mb-5">Warranty</h2>
              <div className="space-y-4">
                <Input label="Title" value={warranty.title || ""} onChange={(e: any) => setWarranty({ ...warranty, title: e.target.value })} />
                <Textarea label="Description" value={warranty.description || ""} onChange={(e: any) => setWarranty({ ...warranty, description: e.target.value })} />
                <Input label="Image URL" value={warranty.image || ""} onChange={(e: any) => setWarranty({ ...warranty, image: e.target.value })} />
                <Input label="Video URL" value={warranty.video || ""} onChange={(e: any) => setWarranty({ ...warranty, video: e.target.value })} />
                <Input label="PDF URL" value={warranty.pdf || ""} onChange={(e: any) => setWarranty({ ...warranty, pdf: e.target.value })} />
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center gap-4 bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl">
              <input
                type="checkbox"
                id="isActive"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                className="w-6 h-6 text-[#b5ce07] border-gray-300 rounded focus:ring-[#b5ce07] cursor-pointer"
              />
              <label htmlFor="isActive" className="font-semibold text-gray-800 cursor-pointer">
                Active Product
              </label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-gradient-to-r from-[#eb8b1d] to-[#eb8b1d]/90 text-white text-lg py-4">
              Update Product
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
