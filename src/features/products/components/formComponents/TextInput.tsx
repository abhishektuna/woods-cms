export const TextInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontWeight: 600 }}>{label}</label>
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        padding: 8,
        border: "1px solid #ccc",
        borderRadius: 4,
      }}
    />
  </div>
);
