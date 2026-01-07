import { Filter } from "lucide-react";
import type { CommonTableProps } from "./table.Types";

export function CommonTable<T>({
  columns,
  data,
  loading = false,
  emptyMessage = "No records found",
}: CommonTableProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#eb8b1d]" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 table-fixed">
          <thead className="bg-[#eb8b1d]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-3 text-xs font-medium text-white uppercase tracking-wider ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                  style={{ width: col.width }}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <Filter className="w-12 h-12 text-gray-300" />
                    <p className="text-gray-500 font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition">
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 text-sm text-gray-700 ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {col.render
                        ? col.render(row)
                        : col.accessor
                        ? String(row[col.accessor] ?? "-")
                        : "-"}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
