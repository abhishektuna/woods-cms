import type { ReactNode } from "react";

export interface TableColumn<T> {
  header: string;
  accessor?: keyof T;
  align?: "left" | "center" | "right";
  width?: string;
  render?: (row: T) => ReactNode;
}

export interface CommonTableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  loading?: boolean;
  emptyMessage?: string;
}
