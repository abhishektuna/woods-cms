import React from "react";

interface Props {
  label: string;
  onChange: (file: File | null) => void;
}

export const FileInput: React.FC<Props> = ({ label, onChange }) => (
  <div style={{ marginBottom: 10 }}>
    <label style={{ fontWeight: 600 }}>{label}</label>
    <input
      type="file"
      onChange={(e) => onChange(e.target.files?.[0] || null)}
      style={{ display: "block", marginTop: 4 }}
    />
  </div>
);
