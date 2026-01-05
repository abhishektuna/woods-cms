import { useState, type FormEvent, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { fetchCategories } from "../../../features/categories/categories.slice";
import { fetchSubCategories } from "../../../features/subcategories/subcategories.slice";
import { createProduct, updateProduct } from "../products.slice";
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
  description?: string;
  image?: string;
  video?: string;
  pdf?: string;
}

interface ProductFormProps {
  product?: any; // existing product for edit
  onSuccess?: () => void;
}

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories);
  const subcategories = useAppSelector((state) => state.subcategories);

  /* -------------------- Form State -------------------- */
  const [modelNo, setModelNo] = useState(product?.modelNo || "");
  const [categoryType, setCategoryType] = useState(product?.categoryType || "subcategory");
  const [categoryRef, setCategoryRef] = useState(product?.categoryRef || "");
  const [description, setDescription] = useState(product?.description || "");
  const productTireKey = product?.product_tire_key || [];
  const [advantages, setAdvantages] = useState<AdvantagesBlock>(
    product?.advantages || { type: [] }
  );
  const [feature] = useState<MediaBlock>(product?.feature || {});
  const [specification] = useState<MediaBlock>(product?.specification || {});
  const [warranty] = useState<MediaBlock>(product?.warranty || {});
  const [isActive] = useState(product?.isActive ?? true);

  /* -------------------- Fetch Categories -------------------- */
  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchSubCategories());
  }, [dispatch]);

  /* -------------------- Handlers -------------------- */
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const payload = {
      modelNo,
      categoryType,
      categoryRef,
      description,
      product_tire_key: productTireKey,
      advantages,
      feature,
      specification,
      warranty,
      isActive,
    };

    if (product?._id) {
      dispatch(updateProduct({ id: product._id, payload })).then(onSuccess);
    } else {
      dispatch(createProduct(payload)).then(onSuccess);
    }
  };

  const handleAdvantagePointChange = (
    advIndex: number,
    pointIndex: number,
    field: keyof AdvantagePoint,
    value: string
  ) => {
    const newAdv = [...advantages.type];
    newAdv[advIndex].points[pointIndex][field] = value;
    setAdvantages({ ...advantages, type: newAdv });
  };

  const handleAddAdvantage = () => {
    setAdvantages({
      ...advantages,
      type: [...advantages.type, { title: "", points: [] }],
    });
  };

  const handleAddAdvantagePoint = (advIndex: number) => {
    const newAdv = [...advantages.type];
    newAdv[advIndex].points.push({ title: "", description: "" });
    setAdvantages({ ...advantages, type: newAdv });
  };

  /* -------------------- JSX -------------------- */
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input label="Model No" value={modelNo} onChange={(e) => setModelNo(e.target.value)} required />

      <div>
        <label className="block mb-1 font-semibold">Category Type</label>
        <select
          value={categoryType}
          onChange={(e) => setCategoryType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="category">Category</option>
          <option value="subcategory">Subcategory</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-semibold">Category / Subcategory</label>
        <select
          value={categoryRef}
          onChange={(e) => setCategoryRef(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          {(categoryType === "category" ? categories.data : subcategories.data).map((c: any) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <Textarea
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* -------------------- Advantages -------------------- */}
      <div className="border p-4 rounded space-y-4">
        <h2 className="font-semibold text-lg">Advantages</h2>
        {advantages.type.map((adv, advIndex) => (
          <div key={advIndex} className="border p-3 rounded space-y-2">
            <Input
              label="Advantage Title"
              value={adv.title}
              onChange={(e) => {
                const newAdv = [...advantages.type];
                newAdv[advIndex].title = e.target.value;
                setAdvantages({ ...advantages, type: newAdv });
              }}
            />

            {adv.points.map((point, pointIndex) => (
              <div key={pointIndex} className="border p-2 rounded space-y-2">
                <Input
                  label="Point Title"
                  value={point.title}
                  onChange={(e) =>
                    handleAdvantagePointChange(advIndex, pointIndex, "title", e.target.value)
                  }
                />
                <Textarea
                  label="Point Description"
                  value={point.description}
                  onChange={(e) =>
                    handleAdvantagePointChange(advIndex, pointIndex, "description", e.target.value)
                  }
                />
              </div>
            ))}

            <Button
              type="button"
              onClick={() => handleAddAdvantagePoint(advIndex)}
              className="bg-[#b5ce07] text-black"
            >
              Add Advantage Point
            </Button>
          </div>
        ))}
        <Button type="button" onClick={handleAddAdvantage} className="bg-[#eb8b1d] text-white">
          Add Advantage
        </Button>
      </div>

      <Button type="submit" className="w-full bg-[#eb8b1d] text-white">
        {product?._id ? "Update Product" : "Create Product"}
      </Button>
    </form>
  );
}
