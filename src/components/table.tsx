"use client";

import { useTable, Column } from "react-table";

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
}

export default function Table<T extends object>({ columns, data }: TableProps<T>) {
  const tableInstance = useTable<T>({ columns, data });
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows: tableRows,
    prepareRow,
  } = tableInstance;

    return (
        <table
        {...getTableProps()}
        className="w-full border border-gray-300 bg-white rounded-md"
      >
        <thead className="bg-gray-100">
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...headerGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupKey} {...headerGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: columnKey, ...columnProps } =
                    column.getHeaderProps();
                  return (
                    <th
                      key={columnKey}
                      {...columnProps}
                      className="px-4 py-2 border text-left font-medium"
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {tableRows.map((row) => {
            prepareRow(row);
            const { key: rowKey, ...rowProps } = row.getRowProps();
            return (
              <tr key={rowKey} {...rowProps} className="hover:bg-gray-50">
                {row.cells.map((cell) => {
                  const { key: cellKey, ...cellProps } = cell.getCellProps();
                  return (
                    <td
                      key={cellKey}
                      {...cellProps}
                      className="px-4 py-2 border"
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    )
};