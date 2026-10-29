import { DataGrid } from "./components/DataGrid";
import type { ColumnDef } from "./types/data-grid-contract";

type Employee = {
  id: number;
  name: string;
  department: string;
  status: string;
};

const employees: Employee[] = [
  { id: 1, name: "Nguyễn An", department: "IT", status: "Active" },
  { id: 2, name: "Trần Bình", department: "HR", status: "Active" },
  { id: 3, name: "Lê Chi", department: "Finance", status: "Inactive" },
  { id: 4, name: "Phạm Dũng", department: "IT", status: "Active" },
  { id: 5, name: "Hoàng Hà", department: "HR", status: "Active" },
  { id: 6, name: "Võ Huy", department: "Finance", status: "Inactive" },
  { id: 7, name: "Đỗ Lan", department: "IT", status: "Active" },
  { id: 8, name: "Bùi Minh", department: "HR", status: "Inactive" },
  { id: 9, name: "Mai Nam", department: "Finance", status: "Active" },
  { id: 10, name: "Hồ Oanh", department: "IT", status: "Active" },
  { id: 11, name: "Đặng Phúc", department: "HR", status: "Active" },
  { id: 12, name: "Ngô Quân", department: "Finance", status: "Inactive" },
];

const columns: ColumnDef<Employee>[] = [
  { header: "ID", accessorKey: "id", sortable: true },
  { header: "Name", accessorKey: "name", sortable: true },
  { header: "Department", accessorKey: "department", sortable: true },
  { header: "Status", accessorKey: "status", sortable: false },
];

export default function App() {
  return (
    <main className="app">
      <h1>Enterprise Employee Data-Grid</h1>
      <p>
        Accessible employee management table.
      </p>

      <DataGrid
        data={employees}
        columns={columns}
        ariaLabel="Danh sách nhân viên"
        onRowSelect={(employee) => {
          console.log("Selected employee:", employee);
        }}
      />
    </main>
  );
}
