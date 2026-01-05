interface Props {
  product: any;
  onClose: () => void;
}

export function ProductDetailsModal({ product, onClose }: Props) {
  if (!product) return null;

  const sectionStyle: React.CSSProperties = {
    border: "1px solid #e5e7eb",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  };

  const labelStyle: React.CSSProperties = {
    fontWeight: 600,
    color: "#374151",
  };

  const linkStyle: React.CSSProperties = {
    color: "#2563eb",
    textDecoration: "underline",
    marginRight: 12,
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-10 overflow-y-auto">
      <div className="bg-white w-11/12 md:w-4/5 lg:w-3/5 rounded-lg p-6 mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">
            Product Details – {product.modelNo}
          </h2>
          <button onClick={onClose} style={{ fontSize: 20 }}>✕</button>
        </div>

        {/* BASIC INFO */}
        <div style={sectionStyle}>
          <p><span style={labelStyle}>Category:</span> {product.category?.name}</p>
          <p><span style={labelStyle}>Subcategory:</span> {product.subcategory?.name}</p>
          <p><span style={labelStyle}>Description:</span> {product.description}</p>
          <p><span style={labelStyle}>Active:</span> {product.isActive ? "Yes" : "No"}</p>
        </div>

        {/* MEDIA */}
        <div style={sectionStyle}>
          <p style={labelStyle}>Media</p>
          <a href={product.image} target="_blank" style={linkStyle}>Image</a>
          <a href={product.video} target="_blank" style={linkStyle}>Video</a>
          <a href={product.pdf} target="_blank" style={linkStyle}>PDF</a>
        </div>

        {/* ADVANTAGES */}
        <div style={sectionStyle}>
          <p style={labelStyle}>Advantages</p>

          {product.advantages?.type?.map((type: any, i: number) => (
            <div key={i} style={{ marginTop: 12 }}>
              <h4 style={{ fontWeight: 600, color: "#111827" }}>
                {type.title}
              </h4>

              {type.points.map((pt: any, j: number) => (
                <div
                  key={j}
                  style={{
                    padding: 10,
                    borderLeft: "3px solid #eb8b1d",
                    marginTop: 8,
                    marginLeft: 8,
                  }}
                >
                  <p><b>{pt.title}</b></p>
                  <p>{pt.description}</p>
                  <a href={pt.image} target="_blank" style={linkStyle}>Image</a>
                  <a href={pt.video} target="_blank" style={linkStyle}>Video</a>
                  <a href={pt.pdf} target="_blank" style={linkStyle}>PDF</a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* FEATURE / SPEC / WARRANTY */}
        {["feature", "specification", "warranty"].map((key) => (
          <div key={key} style={sectionStyle}>
            <p style={labelStyle}>{key.toUpperCase()}</p>
            <p>{product[key]?.description}</p>
            <a href={product[key]?.image} target="_blank" style={linkStyle}>Image</a>
            <a href={product[key]?.video} target="_blank" style={linkStyle}>Video</a>
            <a href={product[key]?.pdf} target="_blank" style={linkStyle}>PDF</a>
          </div>
        ))}
      </div>
    </div>
  );
}
