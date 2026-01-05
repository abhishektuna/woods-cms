interface Props {
  message?: string;
}

export function EmptyState({ message = "No data found" }: Props) {
  return (
    <div className="text-center text-gray-500 py-10">
      {message}
    </div>
  );
}
