import React from "react";

interface Props {
  text: string;
  onClick: () => void;
  color?: string;
}

export const ActionButton: React.FC<Props> = ({
  text,
  onClick,
  color = "#eb8b1d",
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      background: color,
      color: "#fff",
      border: "none",
      padding: "6px 12px",
      borderRadius: 4,
      cursor: "pointer",
      marginRight: 8,
    }}
  >
    {text}
  </button>
);
