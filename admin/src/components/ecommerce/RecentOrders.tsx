import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useState } from "react";
import Badge from "../ui/badge/Badge";

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  status: "Topshirilgan" | "Davom etayotgan" | "Bekor qilingan";
}

const tableData: Product[] = [
  {
    id: 1,
    name: "MacBook Pro 13”",
    category: "Laptop",
    price: "$2399.00",
    status: "Bekor qilingan",
  },
  {
    id: 2,
    name: "Apple Watch Ultra",
    category: "Watch",
    price: "$879.00",
    status: "Davom etayotgan",
  },
  {
    id: 3,
    name: "iPhone 15 Pro Max",
    category: "SmartPhone",
    price: "$1869.00",
    status: "Topshirilgan",
  },
  {
    id: 4,
    name: "iPad Pro 3rd Gen",
    category: "Electronics",
    price: "$1699.00",
    status: "Bekor qilingan",
  },
  {
    id: 5,
    name: "AirPods Pro 2nd Gen",
    category: "Accessories",
    price: "$240.00",
    status: "Topshirilgan",
  },
];

export default function RecentOrders() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<{ category?: string; status?: string }>({});

  const filteredData = tableData.filter((product) => {
    const matchCategory = filter.category ? product.category === filter.category : true;
    const matchStatus = filter.status ? product.status === filter.status : true;
    return matchCategory && matchStatus;
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setFilter({});
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6">
      <div className="flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Shu kunlardagi buyurtmalar
        </h3>

        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-theme-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200"
        >
          Filterlash
          <svg
            className="stroke-current fill-white dark:fill-gray-800"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2.29004 5.90393H17.7067" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M17.7075 14.0961H2.29085" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12.0826 3.33331C13.5024 3.33331 14.6534 4.48431 14.6534 5.90414C14.6534 7.32398 13.5024 8.47498 12.0826 8.47498C10.6627 8.47498 9.51172 7.32398 9.51172 5.90415C9.51172 4.48432 10.6627 3.33331 12.0826 3.33331Z" strokeWidth="1.5" />
            <path d="M7.91745 11.525C6.49762 11.525 5.34662 12.676 5.34662 14.0959C5.34661 15.5157 6.49762 16.6667 7.91745 16.6667C9.33728 16.6667 10.4883 15.5157 10.4883 14.0959C10.4883 12.676 9.33728 11.525 7.91745 11.525Z" strokeWidth="1.5" />
          </svg>
        </button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="border-gray-100 dark:border-gray-800 border-y">
            <TableRow>
              <TableCell isHeader className="font-medium text-gray-500 text-theme-xs dark:text-gray-400 py-3">
                Kitoblar
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Narxi
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Kategoriyalar
              </TableCell>
              <TableCell isHeader className="py-3 font-medium text-gray-500 text-center text-theme-xs dark:text-gray-400">
                Status
              </TableCell>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-100 dark:divide-gray-800 md:overflow-x-auto">
            {filteredData.map((product) => (
              <TableRow key={product.id} className="text-center">
                <TableCell className="py-3">
                  <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">{product.name}</p>
                </TableCell>
                <TableCell className="py-3 px-3 min-w-[150px] text-gray-500 text-theme-sm dark:text-gray-400">{product.price}</TableCell>
                <TableCell className="py-3 min-w-[150px] text-gray-500 text-theme-sm dark:text-gray-400">{product.category}</TableCell>
                <TableCell className="py-3 min-w-[150px] text-gray-500 text-theme-sm dark:text-gray-400">
                  <Badge
                    size="sm"
                    color={
                      product.status === "Topshirilgan"
                        ? "success"
                        : product.status === "Davom etayotgan"
                        ? "warning"
                        : "error"
                    }
                  >
                    {product.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md dark:bg-gray-800">
              <h2 className="text-lg font-semibold mb-4 dark:text-white">Filterlash</h2>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Kategoriya</label>
                  <select
                    value={filter.category || ""}
                    onChange={(e) => setFilter((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Barchasi</option>
                    <option value="Laptop">Kitoblar</option>
                    <option value="Watch">Watch</option>
                    <option value="SmartPhone">SmartPhone</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Holati</label>
                  <select
                    value={filter.status || ""}
                    onChange={(e) => setFilter((prev) => ({ ...prev, status: e.target.value as Product["status"] }))}
                    className="w-full rounded border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
                  >
                    <option value="">Barchasi</option>
                    <option value="Topshirilgan">Topshirilgan</option>
                    <option value="Davom etayotgan">Davom etayotgan</option>
                    <option value="Bekor qilingan">Bekor qilingan</option>
                  </select>
                </div>
              </div>

              <button
                onClick={closeModal}
                className="mt-4 rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
              >
                Close
              </button>
              <button
                onClick={() => setFilter({})}
                className="mt-2 rounded mx-10 bg-red-500 text-white px-4 py-2 hover:bg-red-600"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}