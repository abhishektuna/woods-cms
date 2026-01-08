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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100 table-fixed">
          <thead className="bg-gradient-to-r from-[#eb8b1d] to-[#d47a15]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 text-xs font-semibold text-white uppercase tracking-widest ${
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

          <tbody className="bg-white divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="bg-gray-100 p-4 rounded-full">
                      <Filter className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-500 font-medium">{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gradient-to-r hover:from-[#eb8b1d]/5 hover:to-[#b5ce07]/5 transition-colors duration-200 border-b border-gray-100 group"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 text-sm text-gray-700 group-hover:text-gray-900 transition-colors ${
                        col.align === "center"
                          ? "text-center"
                          : col.align === "right"
                          ? "text-right"
                          : "text-left"
                      }`}
                      title={
                        !col.render && col.accessor
                          ? String(row[col.accessor] ?? "")
                          : undefined
                      }
                    >
                      <div className="overflow-hidden text-ellipsis">
                        {col.render
                          ? col.render(row)
                          : col.accessor
                          ? String(row[col.accessor] ?? "-")
                          : "-"}
                      </div>
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
