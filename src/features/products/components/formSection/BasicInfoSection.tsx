import { TextInput } from "../../../../components/common/TextInput/TextInput";
import { SelectBox } from "../../../../components/common/SelectBox/SelectBox";
import { FileText } from "lucide-react";

export function BasicInfoSection({
  form,
  setForm,
  categoriesArr,
  subcategoriesArr,
  selectedCategoryId,
  selectedSubcategoryId,
  onCategoryChange,
  onSubcategoryChange,
}: any) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
        <FileText className="w-5 h-5 mr-2 text-orange-500" />
        Basic Information
      </h2>

      <TextInput
        label="Model Number"
        value={form.modelNo}
        onChange={(v) => setForm({ ...form, modelNo: v })}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <TextInput
          label="Product Image URL"
          value={form.product.image}
          onChange={(v) =>
            setForm({ ...form, product: { ...form.product, image: v } })
          }
        />
        <TextInput
          label="Product Video URL"
          value={form.product.video}
          onChange={(v) =>
            setForm({ ...form, product: { ...form.product, video: v } })
          }
        />
        <TextInput
          label="Product PDF URL"
          value={form.product.pdf}
          onChange={(v) =>
            setForm({ ...form, product: { ...form.product, pdf: v } })
          }
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectBox
          label="Category"
          value={selectedCategoryId}
          options={categoriesArr.map((c: any) => ({
            label: c.title,
            value: c._id,
          }))}
          onChange={onCategoryChange}
        />

        <SelectBox
          label="Subcategory"
          value={selectedSubcategoryId}
          options={subcategoriesArr.map((s: any) => ({
            label: s.title,
            value: s._id,
          }))}
          onChange={onSubcategoryChange}
        />
      </div>

      <TextInput
        label="Description"
        value={form.description}
        onChange={(v) => setForm({ ...form, description: v })}
      />
    </div>
  );
}
