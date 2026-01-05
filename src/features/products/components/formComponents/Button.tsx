export const Button = ({
  text,
  onClick,
}: {
  text: string;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      padding: "6px 12px",
      background: "#eb8b1d",
      color: "#fff",
      border: "none",
      borderRadius: 4,
      cursor: "pointer",
      marginRight: 8,
    }}
  >
    {text}
  </button>
);
