import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import type { KeyboardEvent } from "react";
import type { DataGridProps } from "../types/data-grid-contract";
import "./DataGrid.css";

type Direction = "ascending" | "descending";

type SortState<T> = {
  key: keyof T;
  direction: Direction;
} | null;

const PAGE_SIZE = 5;

const collator = new Intl.Collator("vi", {
  numeric: true,
  sensitivity: "base",
});

export function DataGrid<T extends object>({
  data,
  columns,
  onRowSelect,
  ariaLabel,
}: DataGridProps<T>) {
  const [filter, setFilter] = useState("");
  const [sort, setSort] = useState<SortState<T>>(null);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<T | null>(null);

  const [active, setActive] = useState({
    row: 0,
    col: 0,
  });

  const filterId = useId();
  const helpId = useId();

  const cellRefs = useRef<Map<string, HTMLElement>>(
    new Map()
  );

  const focusAfterPageChange = useRef(false);

  // STEP A: Filter
  const filteredData = useMemo(() => {
    const query = filter.trim().toLocaleLowerCase("vi");

    if (!query) return data;

    return data.filter((item) =>
      columns.some((column) =>
        String(item[column.accessorKey] ?? "")
          .toLocaleLowerCase("vi")
          .includes(query)
      )
    );
  }, [data, columns, filter]);

  // STEP B: Sorting
  const sortedData = useMemo(() => {
    if (!sort) return filteredData;

    return [...filteredData].sort((a, b) => {
      const left = a[sort.key];
      const right = b[sort.key];

      let result: number;

      if (
        typeof left === "number" &&
        typeof right === "number"
      ) {
        result = left - right;
      } else {
        result = collator.compare(
          String(left ?? ""),
          String(right ?? "")
        );
      }

      return sort.direction === "ascending"
        ? result
        : -result;
    });
  }, [filteredData, sort]);

  // STEP C: Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(sortedData.length / PAGE_SIZE)
  );

  const currentPage = Math.min(page, totalPages - 1);

  const pageData = sortedData.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const activeRow = Math.min(active.row, pageData.length);
  const activeCol = Math.min(
    active.col,
    Math.max(0, columns.length - 1)
  );

  function registerCell(
    row: number,
    col: number,
    node: HTMLElement | null
  ) {
    const key = `${row}:${col}`;

    if (node) {
      cellRefs.current.set(key, node);
    } else {
      cellRefs.current.delete(key);
    }
  }

  function focusCell(row: number, col: number) {
    if (columns.length === 0) return;

    const nextRow = Math.max(
      0,
      Math.min(row, pageData.length)
    );

    const nextCol = Math.max(
      0,
      Math.min(col, columns.length - 1)
    );

    setActive({ row: nextRow, col: nextCol });

    cellRefs.current
      .get(`${nextRow}:${nextCol}`)
      ?.focus();
  }

  // STEP D: Sorting handler
  function sortBy(key: keyof T, col: number) {
    setSort((previous) => ({
      key,
      direction:
        previous?.key === key &&
        previous.direction === "ascending"
          ? "descending"
          : "ascending",
    }));

    setPage(0);
    setActive({ row: 0, col });
  }

  // STEP E: Row selection
  function selectRow(item: T, toggle: boolean) {
    const next =
      toggle && selected === item ? null : item;

    setSelected(next);

    if (next !== null) {
      onRowSelect?.(next);
    }
  }

  // STEP F: Keyboard navigation
  function handleGridKey(
    event: KeyboardEvent<HTMLElement>,
    row: number,
    col: number,
    item?: T
  ) {
    if (event.altKey || event.metaKey) return;

    if (
      event.ctrlKey &&
      event.key !== "Home" &&
      event.key !== "End"
    ) {
      return;
    }

    let nextRow = row;
    let nextCol = col;

    switch (event.key) {
      case "ArrowRight":
        nextCol++;
        break;

      case "ArrowLeft":
        nextCol--;
        break;

      case "ArrowDown":
        nextRow++;
        break;

      case "ArrowUp":
        nextRow--;
        break;

      case "Home":
        if (event.ctrlKey) nextRow = 0;
        nextCol = 0;
        break;

      case "End":
        if (event.ctrlKey) {
          nextRow = pageData.length;
        }
        nextCol = columns.length - 1;
        break;

      case "Enter":
        // Header buttons retain native Enter behavior.
        if (row > 0 && item !== undefined) {
          event.preventDefault();
          selectRow(item, false);
        }
        return;

      case " ":
      case "Spacebar":
        // Header buttons retain native Space behavior.
        if (row > 0 && item !== undefined) {
          event.preventDefault();
          selectRow(item, true);
        }
        return;

      default:
        return;
    }

    event.preventDefault();
    focusCell(nextRow, nextCol);
  }

  // STEP G: Pagination focus management
  function goToPage(nextPage: number) {
    focusAfterPageChange.current = true;
    setActive({ row: 1, col: 0 });
    setPage(nextPage);
  }

  useEffect(() => {
    if (!focusAfterPageChange.current) return;

    focusAfterPageChange.current = false;

    const target = pageData.length > 0
      ? "1:0"
      : "0:0";

    cellRefs.current.get(target)?.focus();
  }, [currentPage, pageData.length]);

  // Handle invalid empty column configuration
  if (columns.length === 0) {
    return (
      <p role="status">
        Không có cột dữ liệu để hiển thị.
      </p>
    );
  }

  const selectedIsPresent =
    selected !== null && data.includes(selected);

  return (
    <section className="dg" aria-label={ariaLabel}>
      <form
        className="dg-toolbar"
        role="search"
        onSubmit={(event) => event.preventDefault()}
      >
        <label htmlFor={filterId}>
          Lọc dữ liệu
        </label>

        <input
          id={filterId}
          className="dg-filter"
          type="search"
          placeholder="Tìm nhân viên..."
          value={filter}
          onChange={(event) => {
            setFilter(event.target.value);
            setPage(0);
            setActive({ row: 0, col: 0 });
          }}
        />
      </form>

      <p id={helpId} className="dg-help">
        Tab để vào bảng. Dùng các phím mũi tên
        để di chuyển. Enter chọn hàng.
        Space bật hoặc tắt lựa chọn.
        Enter hoặc Space trên tiêu đề có thể
        sắp xếp sẽ thay đổi thứ tự dữ liệu.
      </p>

      <div className="dg-scroll">
        <table
          className="dg-table"
          role="grid"
          aria-label={ariaLabel}
          aria-describedby={helpId}
          aria-rowcount={filteredData.length + 1}
          aria-colcount={columns.length}
        >
          <thead>
            <tr role="row" aria-rowindex={1}>
              {columns.map((column, col) => {
                const isSorted =
                  sort?.key === column.accessorKey;

                const isActive =
                  activeRow === 0 &&
                  activeCol === col;

                return (
                  <th
                    key={String(column.accessorKey)}
                    scope="col"
                    aria-sort={
                      isSorted
                        ? sort.direction
                        : undefined
                    }
                    ref={
                      column.sortable
                        ? undefined
                        : (node) =>
                            registerCell(0, col, node)
                    }
                    tabIndex={
                      column.sortable
                        ? undefined
                        : isActive ? 0 : -1
                    }
                    onFocus={
                      column.sortable
                        ? undefined
                        : () =>
                            setActive({ row: 0, col })
                    }
                    onKeyDown={
                      column.sortable
                        ? undefined
                        : (event) =>
                            handleGridKey(event, 0, col)
                    }
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        className="dg-sort"
                        ref={(node) =>
                          registerCell(0, col, node)
                        }
                        tabIndex={isActive ? 0 : -1}
                        onFocus={() =>
                          setActive({ row: 0, col })
                        }
                        onKeyDown={(event) =>
                          handleGridKey(event, 0, col)
                        }
                        onClick={() =>
                          sortBy(column.accessorKey, col)
                        }
                        aria-label={
                          `Sắp xếp cột ${column.header}` +
                          ` theo thứ tự ${
                            isSorted &&
                            sort.direction === "ascending"
                              ? "giảm dần"
                              : "tăng dần"
                          }`
                        }
                      >
                        {column.header}
                        <span aria-hidden="true">
                          {isSorted
                            ? sort.direction === "ascending"
                              ? " ↑"
                              : " ↓"
                            : " ↕"}
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {pageData.map((item, rowIndex) => {
              const isSelected = selected === item;

              return (
                <tr
                  key={currentPage * PAGE_SIZE + rowIndex}
                  role="row"
                  aria-rowindex={
                    currentPage * PAGE_SIZE +
                    rowIndex +
                    2
                  }
                  aria-selected={isSelected}
                >
                  {columns.map((column, col) => {
                    const gridRow = rowIndex + 1;

                    const isActive =
                      activeRow === gridRow &&
                      activeCol === col;

                    return (
                      <td
                        key={String(column.accessorKey)}
                        role="gridcell"
                        ref={(node) =>
                          registerCell(
                            gridRow,
                            col,
                            node
                          )
                        }
                        tabIndex={isActive ? 0 : -1}
                        onFocus={() =>
                          setActive({
                            row: gridRow,
                            col,
                          })
                        }
                        onKeyDown={(event) =>
                          handleGridKey(
                            event,
                            gridRow,
                            col,
                            item
                          )
                        }
                        onClick={() => {
                          focusCell(gridRow, col);
                          selectRow(item, true);
                        }}
                      >
                        {String(
                          item[column.accessorKey] ?? ""
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pageData.length === 0 && (
        <p className="dg-empty">
          Không tìm thấy dữ liệu phù hợp.
        </p>
      )}

      <p className="dg-status" role="status">
        {filteredData.length} kết quả.
        {" "}Trang {currentPage + 1}/{totalPages}.
        {sort && (
          <>
            {" "}Đang sắp xếp theo{" "}
            {columns.find(
              (column) =>
                column.accessorKey === sort.key
            )?.header}
            {" "}(
            {sort.direction === "ascending"
              ? "tăng dần"
              : "giảm dần"}
            ).
          </>
        )}
        {" "}
        {selectedIsPresent
          ? `Hàng đã chọn: ${String(
              selected[columns[0].accessorKey] ?? ""
            )}.`
          : "Chưa chọn hàng."}
      </p>

      <nav
        className="dg-pagination"
        aria-label={`Phân trang ${ariaLabel}`}
      >
        <button
          type="button"
          className="dg-page"
          disabled={currentPage === 0}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>

        <span>
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          type="button"
          className="dg-page"
          disabled={currentPage >= totalPages - 1}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </nav>
    </section>
  );
}
