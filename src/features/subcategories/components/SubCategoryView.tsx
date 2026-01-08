import { ViewField } from "../../../components/common/ViewModal/ViewField";

interface SubCategoryViewProps {
  subCategory: any;
  categories: any[];
}

export function SubCategoryView({ subCategory, categories }: SubCategoryViewProps) {
  const parentCategory = categories.find((c) => c._id === subCategory?.categoryId);

  return (
    <div className="bg-white p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-[#eb8b1d]">
          Subcategory Details
        </h3>
        <div className="space-y-4">
          <ViewField label="Subcategory Title" value={subCategory?.title} />
          <ViewField label="Parent Category" value={parentCategory?.title || "-"} />
          
          {subCategory?.image && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Subcategory Image
              </p>
              <ViewField type="image" label="" value={subCategory.image} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
