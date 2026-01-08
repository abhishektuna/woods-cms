import { ViewField } from "../../../components/common/ViewModal/ViewField";

interface ProductViewProps {
	product: any;
}

export function ProductView({ product }: ProductViewProps) {
	if (!product) return null;

	const tireKey = product.product_tire_key_new;
	const categoryName = product.category?.name || "-";
	const subcategoryName = product.subcategory?.name || "-";
	const advantageBlocks = Array.isArray(product.advantages?.type)
		? product.advantages.type.length
		: 0;

	return (
		<div className="bg-white p-6 space-y-6">
			<div>
				<h3 className="text-lg font-bold text-gray-800 mb-4 pb-3 border-b-2 border-[#eb8b1d]">
					Product Details
				</h3>
				<div className="grid md:grid-cols-2 gap-4">
					<ViewField label="Model No" value={product.modelNo} />
					<ViewField label="Category" value={categoryName} />
					<ViewField label="Subcategory" value={subcategoryName} />
					<ViewField label="Tire Key Type" value={tireKey?.type || "-"} />
					<ViewField label="Tire Key Color" value={tireKey?.color || "-"} />
					<ViewField label="Active" type="badge" value={product.isActive} />
				</div>
				<ViewField label="Description" value={product.description} />
			</div>

			<div className="grid md:grid-cols-3 gap-4">
				{product.image && (
					<ViewField type="image" label="Product Image" value={product.image} />
				)}

				{product.video && (
					<div className="py-3 border-b border-gray-100">
						<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
							Product Video
						</p>
						<a
							href={product.video}
							target="_blank"
							rel="noreferrer"
							className="text-sm text-[#eb8b1d] hover:underline break-all"
						>
							{product.video}
						</a>
					</div>
				)}

				{product.pdf && (
					<div className="py-3 border-b border-gray-100">
						<p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
							Product PDF
						</p>
						<a
							href={product.pdf}
							target="_blank"
							rel="noreferrer"
							className="text-sm text-[#eb8b1d] hover:underline break-all"
						>
							{product.pdf}
						</a>
					</div>
				)}
			</div>

			<div>
				<h4 className="text-md font-semibold text-gray-800 mb-3">Additional Info</h4>
				<div className="grid md:grid-cols-2 gap-4">
					<ViewField
						label="Advantage Blocks"
						value={advantageBlocks ? `${advantageBlocks} block(s)` : "-"}
					/>
					<ViewField label="Feature Title" value={product.feature?.title || "-"} />
					<ViewField
						label="Specification Title"
						value={product.specification?.title || "-"}
					/>
					<ViewField label="Warranty Title" value={product.warranty?.title || "-"} />
				</div>
			</div>
		</div>
	);
}
