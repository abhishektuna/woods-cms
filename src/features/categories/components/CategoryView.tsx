import { ViewField } from "../../../components/common/ViewModal/ViewField";

interface CategoryViewProps {
  category: any;
}

export function CategoryView({ category }: CategoryViewProps) {
  return (
    <div className="bg-white p-6 space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-[#eb8b1d]">
          Category Details
        </h3>
        <div className="space-y-4">
          <ViewField label="Category Title" value={category?.title} />
          
          {category?.image && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Category Image
              </p>
              <ViewField type="image" label="" value={category.image} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
