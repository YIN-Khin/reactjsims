// import React, { useEffect, useMemo, useState } from "react";
// import { fetchSuppliers, deleteSupplier } from "../../api/supplier.api";
// import { Link } from "react-router-dom";
// import { Plus, Edit, Trash2, AlertCircle, Search, X } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { can } from "../../utils/permissions";

// const ITEMS_PER_PAGE = 10;

// const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

// const SupplierList = () => {
//   const { user } = useAuth();

//   const canCreate = can(user, "supplier", "create");
//   const canEdit = can(user, "supplier", "edit");
//   const canDelete = can(user, "supplier", "delete");

//   const [suppliers, setSuppliers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchType, setSearchType] = useState("all");

//   // pagination
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     loadSuppliers();
//   }, []);

//   const loadSuppliers = async () => {
//     try {
//       setLoading(true);
//       setError(null);

//       const data = await fetchSuppliers();
//       const sorted = Array.isArray(data) ? data.sort((a, b) => b.id - a.id) : [];
//       setSuppliers(sorted);
//     } catch (err) {
//       setError("Failed to load suppliers");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredSuppliers = useMemo(() => {
//     const term = normalize(searchTerm);
//     if (!term) return suppliers;

//     return suppliers.filter((s) => {
//       const id = (s?.id ?? "").toString();
//       const name = normalize(s?.name);
//       const email = normalize(s?.email);
//       const phone1 = normalize(s?.phone_first);
//       const phone2 = normalize(s?.phone_second);
//       const address = normalize(s?.address);

//       switch (searchType) {
//         case "id":
//           return id.includes(term);
//         case "name":
//           return name.includes(term);
//         case "email":
//           return email.includes(term);
//         case "phone":
//           return phone1.includes(term) || phone2.includes(term);
//         case "address":
//           return address.includes(term);
//         default:
//           return (
//             id.includes(term) ||
//             name.includes(term) ||
//             email.includes(term) ||
//             phone1.includes(term) ||
//             phone2.includes(term) ||
//             address.includes(term)
//           );
//       }
//     });
//   }, [searchTerm, searchType, suppliers]);

//   const totalItems = filteredSuppliers.length;
//   const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

//   useEffect(() => {
//     if (currentPage > totalPages) setCurrentPage(1);
//   }, [totalPages, currentPage]);

//   const pageItems = useMemo(() => {
//     const start = (currentPage - 1) * ITEMS_PER_PAGE;
//     return filteredSuppliers.slice(start, start + ITEMS_PER_PAGE);
//   }, [filteredSuppliers, currentPage]);

//   const handleDelete = async (id) => {
//     if (!canDelete) return;

//     if (window.confirm("តើអ្នកប្រាកដថាចង់លុបអ្នកផ្គត់ផ្គង់នេះទេ?")) {
//       try {
//         await deleteSupplier(id);
//         await loadSuppliers();
//       } catch {
//         setError("មិនអាចលុបអ្នកផ្គត់ផ្គង់បានទេ");
//       }
//     }
//   };

//   const clearSearch = () => {
//     setSearchTerm("");
//     setSearchType("all");
//     setCurrentPage(1);
//   };

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">អ្នកផ្គត់ផ្គង់</h1>
//           <p className="text-sm text-gray-600">សរុប: {totalItems} អ្នកផ្គត់ផ្គង់</p>
//         </div>

//         {canCreate && (
//           <Link
//             to="/suppliers/new"
//             className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
//           >
//             <Plus size={18} />
//             បន្ថែមអ្នកផ្គត់ផ្គង់
//           </Link>
//         )}
//       </div>

//       {/* Search */}
//       <div className="bg-white p-4 rounded-lg shadow mb-6">
//         <div className="flex flex-col md:flex-row gap-3">
//           <select
//             value={searchType}
//             onChange={(e) => setSearchType(e.target.value)}
//             className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full md:w-52"
//           >
//             <option value="all">ស្វែងរកទាំងអស់</option>
//             <option value="id">ស្វែងរកតាម ID</option>
//             <option value="name">ស្វែងរកតាមឈ្មោះ</option>
//             <option value="email">ស្វែងរកតាម Email</option>
//             <option value="phone">ស្វែងរកតាមទូរស័ព្ទ</option>
//             <option value="address">ស្វែងរកតាមអាសយដ្ឋាន</option>
//           </select>

//           <div className="relative flex-1">
//             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
//             <input
//               className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="ស្វែងរក..."
//               value={searchTerm}
//               onChange={(e) => {
//                 setSearchTerm(e.target.value);
//                 setCurrentPage(1);
//               }}
//             />
//             {searchTerm && (
//               <button
//                 type="button"
//                 onClick={clearSearch}
//                 className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
//               >
//                 <X size={18} />
//               </button>
//             )}
//           </div>

//           <button
//             type="button"
//             onClick={() => {}}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
//           >
//             <Search size={18} />
//             <span className="hidden md:inline">ស្វែងរក</span>
//           </button>
//         </div>

//         {searchTerm && (
//           <div className="mt-3 text-sm text-gray-600">
//             រកឃើញ{" "}
//             <span className="font-semibold text-blue-600">
//               {filteredSuppliers.length}
//             </span>{" "}
//             លទ្ធផល
//           </div>
//         )}
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
//           <AlertCircle size={18} />
//           {error}
//         </div>
//       )}

//       {/* Table */}
//       <div className="bg-white rounded-lg shadow overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ID
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ឈ្មោះ
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Email
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ទូរស័ព្ទទី១
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   ទូរស័ព្ទទី២
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   អាសយដ្ឋាន
//                 </th>

//                 {(canEdit || canDelete) && (
//                   <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     សកម្មភាព
//                   </th>
//                 )}
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y divide-gray-200">
//               {pageItems.map((s) => (
//                 <tr key={s.id} className="hover:bg-gray-50 transition-colors">
//                   <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                     #{s.id}
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap text-sm">
//                     <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
//                       {s.name || "-"}
//                     </span>
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
//                     {s.email || "-"}
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
//                     {s.phone_first || "-"}
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
//                     {s.phone_second || "-"}
//                   </td>
//                   <td className="px-6 py-3 whitespace-nowrap text-sm">
//                     <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
//                       {s.address || "-"}
//                     </span>
//                   </td>

//                   {(canEdit || canDelete) && (
//                     <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
//                       <div className="flex justify-center gap-2">
//                         {canEdit && (
//                           <Link
//                             to={`/suppliers/edit/${s.id}`}
//                             className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
//                             title="កែសម្រួល"
//                           >
//                             <Edit size={16} />
//                           </Link>
//                         )}

//                         {canDelete && (
//                           <button
//                             type="button"
//                             onClick={() => handleDelete(s.id)}
//                             className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
//                             title="លុប"
//                           >
//                             <Trash2 size={16} />
//                           </button>
//                         )}
//                       </div>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>

//         {/* Empty */}
//         {filteredSuppliers.length === 0 ? (
//           <div className="text-center p-12 text-gray-500">
//             <h3 className="mt-4 text-lg font-medium text-gray-900">
//               {searchTerm ? "គ្មានលទ្ធផលស្វែងរក" : "គ្មានអ្នកផ្គត់ផ្គង់ទេ"}
//             </h3>
//             <p className="mt-2 text-sm text-gray-600">
//               {searchTerm
//                 ? "សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង"
//                 : canCreate
//                 ? "ចាប់ផ្តើមដោយបន្ថែមអ្នកផ្គត់ផ្គង់ថ្មី"
//                 : "មិនមានអ្នកផ្គត់ផ្គង់សម្រាប់អ្នកប្រើប្រាស់នេះទេ"}
//             </p>
//             {searchTerm && (
//               <button
//                 type="button"
//                 onClick={clearSearch}
//                 className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//               >
//                 សម្អាតការស្វែងរក
//               </button>
//             )}
//           </div>
//         ) : (
//           // Pagination
//           totalPages > 1 && (
//             <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t bg-gray-50 gap-4">
//               <div className="text-sm text-gray-700 order-2 sm:order-1 whitespace-nowrap">
//                 បង្ហាញ{" "}
//                 <span className="font-medium">
//                   {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
//                   {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
//                 </span>{" "}
//                 នៃ <span className="font-medium">{totalItems}</span>
//               </div>

//               <nav className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center">
//                 <button
//                   type="button"
//                   onClick={() => goToPage(1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   « ដើម
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => goToPage(currentPage - 1)}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   មុន
//                 </button>

//                 <span className="px-3 py-2 text-sm text-gray-700">
//                   {currentPage}/{totalPages}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() => goToPage(currentPage + 1)}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   បន្ទាប់
//                 </button>

//                 <button
//                   type="button"
//                   onClick={() => goToPage(totalPages)}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                 >
//                   ចុង »
//                 </button>
//               </nav>
//             </div>
//           )
//         )}
//       </div>
//     </div>
//   );
// };

// export default SupplierList;

// // import React, { useState, useEffect } from "react";
// // import { fetchSuppliers, deleteSupplier } from "../../api/supplier.api";
// // import { Link } from "react-router-dom";
// // import { Plus, Edit, Trash2, AlertCircle, Search, X } from "lucide-react";
// // import { useAuth } from "../../context/AuthContext";
// // import { can } from "../../utils/permissions";

// // const ITEMS_PER_PAGE = 10;

// // const SupplierList = () => {
// //   const { user } = useAuth();

// //   const canCreate = can(user, "supplier", "create");
// //   const canEdit = can(user, "supplier", "edit");
// //   const canDelete = can(user, "supplier", "delete");

// //   const [suppliers, setSuppliers] = useState([]);
// //   const [filteredSuppliers, setFilteredSuppliers] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [searchType, setSearchType] = useState("all");

// //   // Pagination states
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalPages, setTotalPages] = useState(1);
// //   const [totalItems, setTotalItems] = useState(0);

// //   useEffect(() => {
// //     loadSuppliers();
// //   }, []);

// //   useEffect(() => {
// //     filterSuppliers();
// //   }, [searchTerm, searchType, suppliers]);

// //   useEffect(() => {
// //     // Update pagination when filtered suppliers change
// //     const total = filteredSuppliers.length;
// //     setTotalItems(total);
// //     setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

// //     // Reset to page 1 if current page is invalid
// //     if (currentPage > Math.ceil(total / ITEMS_PER_PAGE)) {
// //       setCurrentPage(1);
// //     }
// //   }, [filteredSuppliers, currentPage]);

// //   const loadSuppliers = async () => {
// //     try {
// //       setLoading(true);
// //       const data = await fetchSuppliers();
// //       const sorted = Array.isArray(data)
// //         ? data.sort((a, b) => b.id - a.id)
// //         : [];
// //       setSuppliers(sorted);
// //       setFilteredSuppliers(sorted);
// //       setError(null);
// //     } catch (err) {
// //       setError("Failed to load suppliers");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const filterSuppliers = () => {
// //     if (!searchTerm.trim()) {
// //       setFilteredSuppliers(suppliers);
// //       return;
// //     }

// //     const term = searchTerm.toLowerCase();
// //     const result = suppliers.filter((s) => {
// //       switch (searchType) {
// //         case "id":
// //           return s.id.toString().includes(term);
// //         case "name":
// //           return s.name?.toLowerCase().includes(term);
// //         case "phone":
// //           return (
// //             s.phone_first?.includes(term) || s.phone_second?.includes(term)
// //           );
// //         case "address":
// //           return s.address?.toLowerCase().includes(term);
// //         default:
// //           return (
// //             s.id.toString().includes(term) ||
// //             s.name?.toLowerCase().includes(term) ||
// //             s.phone_first?.includes(term) ||
// //             s.phone_second?.includes(term) ||
// //             s.address?.toLowerCase().includes(term)
// //           );
// //       }
// //     });

// //     setFilteredSuppliers(result);
// //   };

// //   const handleDelete = async (id) => {
// //     if (!canDelete) return;

// //     if (window.confirm("តើអ្នកប្រាកដថាចង់លុបអ្នកផ្គត់ផ្គង់នេះទេ?")) {
// //       try {
// //         await deleteSupplier(id);
// //         loadSuppliers();
// //       } catch {
// //         setError("មិនអាចលុបអ្នកផ្គត់ផ្គង់បានទេ");
// //       }
// //     }
// //   };

// //   const clearSearch = () => {
// //     setSearchTerm("");
// //     setSearchType("all");
// //   };

// //   // Pagination functions
// //   const goToPage = (page) => {
// //     if (page >= 1 && page <= totalPages) {
// //       setCurrentPage(page);
// //     }
// //   };

// //   // Get current page items
// //   const getCurrentPageItems = () => {
// //     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
// //     const endIndex = startIndex + ITEMS_PER_PAGE;
// //     return filteredSuppliers.slice(startIndex, endIndex);
// //   };

// //   if (loading) {
// //     return (
// //       <div className="min-h-screen flex items-center justify-center">
// //         <div className="animate-spin h-12 w-12 border-b-2 border-blue-600 rounded-full" />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="p-4 md:p-6">
// //       {/* Header */}
// //       <div className="flex flex-col md:flex-row justify-between mb-6">
// //         <div>
// //           <h1 className="text-2xl font-bold text-gray-800">អ្នកផ្គត់ផ្គង់</h1>
// //           <p className="text-sm text-gray-600">
// //             សរុប: {totalItems} អ្នកផ្គត់ផ្គង់
// //           </p>
// //         </div>

// //         {canCreate && (
// //           <Link
// //             to="/suppliers/new"
// //             className="mt-4 md:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
// //           >
// //             <Plus size={18} />
// //             បន្ថែមអ្នកផ្គត់ផ្គង់
// //           </Link>
// //         )}
// //       </div>

// //       {/* Search */}
// //       <div className="bg-white p-4 rounded-lg shadow mb-6">
// //         <div className="flex flex-col md:flex-row gap-3">
// //           <select
// //             value={searchType}
// //             onChange={(e) => setSearchType(e.target.value)}
// //             className="border border-gray-300 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full md:w-48"
// //           >
// //             <option value="all">ស្វែងរកទាំងអស់</option>
// //             <option value="id">ស្វែងរកតាម ID</option>
// //             <option value="name">ស្វែងរកតាមឈ្មោះ</option>
// //             <option value="phone">ស្វែងរកតាមទូរស័ព្ទ</option>
// //             <option value="address">ស្វែងរកតាមអាសយដ្ឋាន</option>
// //           </select>

// //           <div className="relative flex-1">
// //             <Search className="absolute left-3 top-3 text-gray-400" size={18} />
// //             <input
// //               className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
// //               placeholder={
// //                 searchType === "all"
// //                   ? "ស្វែងរកទាំងអស់..."
// //                   : searchType === "id"
// //                     ? "ស្វែងរកតាម ID..."
// //                     : searchType === "name"
// //                       ? "ស្វែងរកតាមឈ្មោះ..."
// //                       : searchType === "phone"
// //                         ? "ស្វែងរកតាមទូរស័ព្ទ..."
// //                         : "ស្វែងរកតាមអាសយដ្ឋាន..."
// //               }
// //               value={searchTerm}
// //               onChange={(e) => setSearchTerm(e.target.value)}
// //             />
// //             {searchTerm && (
// //               <button
// //                 onClick={clearSearch}
// //                 className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
// //               >
// //                 <X size={18} />
// //               </button>
// //             )}
// //           </div>

// //           <button
// //             onClick={filterSuppliers}
// //             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
// //           >
// //             <Search size={18} />
// //             <span className="hidden md:inline">ស្វែងរក</span>
// //           </button>
// //         </div>

// //         {/* Search Results Info */}
// //         {searchTerm && (
// //           <div className="mt-3 text-sm text-gray-600">
// //             រកឃើញ{" "}
// //             <span className="font-semibold text-blue-600">
// //               {filteredSuppliers.length}
// //             </span>{" "}
// //             លទ្ធផល
// //             {searchType !== "all" && (
// //               <span>
// //                 {" "}
// //                 សម្រាប់{" "}
// //                 <span className="font-semibold">
// //                   {searchType === "id"
// //                     ? "ID"
// //                     : searchType === "name"
// //                       ? "ឈ្មោះ"
// //                       : searchType === "phone"
// //                         ? "ទូរស័ព្ទ"
// //                         : "អាសយដ្ឋាន"}
// //                 </span>
// //               </span>
// //             )}
// //           </div>
// //         )}
// //       </div>

// //       {error && (
// //         <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
// //           <AlertCircle size={18} />
// //           {error}
// //         </div>
// //       )}

// //       {/* Table */}
// //       <div className="bg-white rounded-lg shadow overflow-hidden">
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   ID
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   ឈ្មោះ
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   ទូរស័ព្ទទី១
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   ទូរស័ព្ទទី២
// //                 </th>
// //                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                   អាសយដ្ឋាន
// //                 </th>

// //                 {(canEdit || canDelete) && (
// //                   <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                     សកម្មភាព
// //                   </th>
// //                 )}
// //               </tr>
// //             </thead>

// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {getCurrentPageItems().map((s) => (
// //                 <tr key={s.id} className="hover:bg-gray-50 transition-colors">
// //                   <td className="px-6 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
// //                     #{s.id}
// //                   </td>
// //                   <td className="px-6 py-3 whitespace-nowrap text-sm">
// //                     <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
// //                       {s.name || "-"}
// //                     </span>
// //                   </td>
// //                   <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
// //                     {s.phone_first || "-"}
// //                   </td>
// //                   <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-700">
// //                     {s.phone_second || "-"}
// //                   </td>
// //                   <td className="px-6 py-3 whitespace-nowrap text-sm">
// //                     <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
// //                       {s.address || "-"}
// //                     </span>
// //                   </td>

// //                   {(canEdit || canDelete) && (
// //                     <td className="px-6 py-3 whitespace-nowrap text-sm text-center">
// //                       <div className="flex justify-center gap-2">
// //                         {canEdit && (
// //                           <Link
// //                             to={`/suppliers/edit/${s.id}`}
// //                             className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
// //                             title="កែសម្រួល"
// //                           >
// //                             <Edit size={16} />
// //                           </Link>
// //                         )}

// //                         {canDelete && (
// //                           <button
// //                             onClick={() => handleDelete(s.id)}
// //                             className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
// //                             title="លុប"
// //                           >
// //                             <Trash2 size={16} />
// //                           </button>
// //                         )}
// //                       </div>
// //                     </td>
// //                   )}
// //                 </tr>
// //               ))}
// //             </tbody>
// //           </table>
// //         </div>

// //         {filteredSuppliers.length === 0 ? (
// //           <div className="text-center p-12 text-gray-500">
// //             <svg
// //               className="mx-auto h-12 w-12 text-gray-400"
// //               fill="none"
// //               viewBox="0 0 24 24"
// //               stroke="currentColor"
// //             >
// //               <path
// //                 strokeLinecap="round"
// //                 strokeLinejoin="round"
// //                 strokeWidth={2}
// //                 d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
// //               />
// //             </svg>
// //             <h3 className="mt-4 text-lg font-medium text-gray-900">
// //               {searchTerm ? "គ្មានលទ្ធផលស្វែងរក" : "គ្មានអ្នកផ្គត់ផ្គង់ទេ"}
// //             </h3>
// //             <p className="mt-2 text-sm text-gray-600">
// //               {searchTerm
// //                 ? "សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង"
// //                 : canCreate
// //                   ? "ចាប់ផ្តើមដោយបន្ថែមអ្នកផ្គត់ផ្គង់ថ្មី"
// //                   : "មិនមានអ្នកផ្គត់ផ្គង់សម្រាប់អ្នកប្រើប្រាស់នេះទេ"}
// //             </p>
// //             {searchTerm && (
// //               <button
// //                 onClick={clearSearch}
// //                 className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
// //               >
// //                 សម្អាតការស្វែងរក
// //               </button>
// //             )}
// //           </div>
// //         ) : (
// //           // Pagination
// //           totalPages > 1 && (
// //             <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t bg-gray-50 gap-4">
// //               <div className="text-sm text-gray-700 order-2 sm:order-1 whitespace-nowrap">
// //                 បង្ហាញ{" "}
// //                 <span className="font-medium">
// //                   {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
// //                   {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
// //                 </span>{" "}
// //                 នៃ{" "}
// //                 <span className="font-medium">
// //                   {totalItems.toLocaleString("km-KH")}
// //                 </span>{" "}
// //                 អ្នកផ្គត់ផ្គង់
// //               </div>

// //               <nav
// //                 className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center"
// //                 aria-label="ផេកអ្នកផ្គត់ផ្គង់"
// //               >
// //                 <button
// //                   onClick={() => goToPage(1)}
// //                   disabled={currentPage === 1}
// //                   className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //                   aria-label="ទំព័រដំបូង"
// //                 >
// //                   « ដើម
// //                 </button>

// //                 <button
// //                   onClick={() => goToPage(currentPage - 1)}
// //                   disabled={currentPage === 1}
// //                   className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //                   aria-label="មុន"
// //                 >
// //                   មុន
// //                 </button>

// //                 {(() => {
// //                   const pages = [];
// //                   const range = 3;
// //                   let start = Math.max(1, currentPage - range);
// //                   let end = Math.min(totalPages, currentPage + range);

// //                   if (start > 2) {
// //                     pages.push(
// //                       <button
// //                         key={1}
// //                         onClick={() => goToPage(1)}
// //                         className={`px-4 py-2 border rounded text-sm ${
// //                           currentPage === 1
// //                             ? "bg-blue-600 text-white border-blue-600"
// //                             : "border-gray-300 hover:bg-gray-50"
// //                         }`}
// //                       >
// //                         ១
// //                       </button>,
// //                     );
// //                     if (start > 3)
// //                       pages.push(
// //                         <span
// //                           key="left-ellipsis"
// //                           className="px-2 py-2 text-gray-500"
// //                         >
// //                           …
// //                         </span>,
// //                       );
// //                   }

// //                   for (let i = start; i <= end; i++) {
// //                     pages.push(
// //                       <button
// //                         key={i}
// //                         onClick={() => goToPage(i)}
// //                         className={`px-4 py-2 border rounded text-sm font-medium ${
// //                           currentPage === i
// //                             ? "bg-blue-600 text-white border-blue-600"
// //                             : "border-gray-300 hover:bg-gray-50"
// //                         }`}
// //                       >
// //                         {i.toLocaleString("km-KH")}
// //                       </button>,
// //                     );
// //                   }

// //                   if (end < totalPages - 1) {
// //                     if (end < totalPages - 2)
// //                       pages.push(
// //                         <span
// //                           key="right-ellipsis"
// //                           className="px-2 py-2 text-gray-500"
// //                         >
// //                           …
// //                         </span>,
// //                       );
// //                     pages.push(
// //                       <button
// //                         key={totalPages}
// //                         onClick={() => goToPage(totalPages)}
// //                         className={`px-4 py-2 border rounded text-sm ${
// //                           currentPage === totalPages
// //                             ? "bg-blue-600 text-white border-blue-600"
// //                             : "border-gray-300 hover:bg-gray-50"
// //                         }`}
// //                       >
// //                         {totalPages.toLocaleString("km-KH")}
// //                       </button>,
// //                     );
// //                   }

// //                   return pages;
// //                 })()}

// //                 <button
// //                   onClick={() => goToPage(currentPage + 1)}
// //                   disabled={currentPage === totalPages}
// //                   className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //                   aria-label="បន្ទាប់"
// //                 >
// //                   បន្ទាប់
// //                 </button>

// //                 <button
// //                   onClick={() => goToPage(totalPages)}
// //                   disabled={currentPage === totalPages}
// //                   className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //                   aria-label="ទំព័រចុងក្រោយ"
// //                 >
// //                   ចុង »
// //                 </button>
// //               </nav>
// //             </div>
// //           )
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default SupplierList;

import React, { useEffect, useMemo, useState } from "react";
import { fetchSuppliers, deleteSupplier } from "../../api/supplier.api";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Search,
  X,
  Users,
  Mail,
  Phone,
  MapPin,
  Building2,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { can } from "../../utils/permissions";

const ITEMS_PER_PAGE = 10;

const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

const SupplierList = () => {
  const { user } = useAuth();

  const canCreate = can(user, "supplier", "create");
  const canEdit = can(user, "supplier", "edit");
  const canDelete = can(user, "supplier", "delete");

  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");

  // pagination
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchSuppliers();
      const sorted = Array.isArray(data)
        ? data.sort((a, b) => b.id - a.id)
        : [];
      setSuppliers(sorted);
    } catch (err) {
      setError("មិនអាចទាញយកបញ្ជីអ្នកផ្គត់ផ្គង់បានទេ");
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = useMemo(() => {
    const term = normalize(searchTerm);
    if (!term) return suppliers;

    return suppliers.filter((s) => {
      const id = (s?.id ?? "").toString();
      const name = normalize(s?.name);
      const email = normalize(s?.email);
      const phone1 = normalize(s?.phone_first);
      const phone2 = normalize(s?.phone_second);
      const address = normalize(s?.address);

      switch (searchType) {
        case "id":
          return id.includes(term);
        case "name":
          return name.includes(term);
        case "email":
          return email.includes(term);
        case "phone":
          return phone1.includes(term) || phone2.includes(term);
        case "address":
          return address.includes(term);
        default:
          return (
            id.includes(term) ||
            name.includes(term) ||
            email.includes(term) ||
            phone1.includes(term) ||
            phone2.includes(term) ||
            address.includes(term)
          );
      }
    });
  }, [searchTerm, searchType, suppliers]);

  const totalItems = filteredSuppliers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSuppliers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSuppliers, currentPage]);

  const handleDelete = async (id) => {
    if (!canDelete) return;

    if (window.confirm("តើអ្នកប្រាកដថាចង់លុបអ្នកផ្គត់ផ្គង់នេះទេ?")) {
      try {
        setDeleting(id);
        await deleteSupplier(id);
        await loadSuppliers();
      } catch {
        setError("មិនអាចលុបអ្នកផ្គត់ផ្គង់បានទេ");
      } finally {
        setDeleting(null);
      }
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchType("all");
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const pages = [];
    const maxButtons = 7;

    if (totalPages <= maxButtons) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    const left = Math.max(1, currentPage - 1);
    const right = Math.min(totalPages, currentPage + 1);

    pages.push(1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) {
      if (i !== 1 && i !== totalPages) pages.push(i);
    }
    if (right < totalPages - 1) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  // Calculate statistics
  const stats = useMemo(() => {
    const totalSuppliers = suppliers.length;
    const withEmail = suppliers.filter((s) => s.email).length;
    const withPhone = suppliers.filter(
      (s) => s.phone_first || s.phone_second,
    ).length;
    const withAddress = suppliers.filter((s) => s.address).length;

    return {
      total: totalSuppliers,
      withEmail,
      withPhone,
      withAddress,
    };
  }, [suppliers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                អ្នកផ្គត់ផ្គង់
              </h1>
              <p className="text-gray-600 text-sm">
                គ្រប់គ្រងអ្នកផ្គត់ផ្គង់ទាំងអស់
              </p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">អ្នកផ្គត់ផ្គង់សរុប</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-xs text-gray-500 mt-1">ក្នុងប្រព័ន្ធ</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">មាន Email</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.withEmail}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((stats.withEmail / stats.total) * 100 || 0).toFixed(1)}%
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Mail className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">មានទូរស័ព្ទ</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.withPhone}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((stats.withPhone / stats.total) * 100 || 0).toFixed(1)}%
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Phone className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">មានអាសយដ្ឋាន</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.withAddress}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((stats.withAddress / stats.total) * 100 || 0).toFixed(1)}%
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="flex flex-col gap-4">
            {/* Search Controls */}
            <div className="flex flex-col lg:flex-row gap-3">
              <select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
                className="lg:w-52 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="all">ស្វែងរកទាំងអស់</option>
                <option value="id">ស្វែងរកតាម ID</option>
                <option value="name">ស្វែងរកតាមឈ្មោះ</option>
                <option value="email">ស្វែងរកតាម Email</option>
                <option value="phone">ស្វែងរកតាមទូរស័ព្ទ</option>
                <option value="address">ស្វែងរកតាមអាសយដ្ឋាន</option>
              </select>

              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder={
                    searchType === "all"
                      ? "ស្វែងរក ID, ឈ្មោះ, Email, ទូរស័ព្ទ..."
                      : searchType === "name"
                        ? "ស្វែងរកឈ្មោះ..."
                        : searchType === "email"
                          ? "ស្វែងរក Email..."
                          : searchType === "phone"
                            ? "ស្វែងរកទូរស័ព្ទ..."
                            : searchType === "address"
                              ? "ស្វែងរកអាសយដ្ឋាន..."
                              : "ស្វែងរក ID..."
                  }
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {canCreate && (
                <Link
                  to="/suppliers/new"
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  បន្ថែមអ្នកផ្គត់ផ្គង់
                </Link>
              )}
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="text-sm text-gray-600">
                រកឃើញ{" "}
                <span className="font-semibold text-blue-600">
                  {filteredSuppliers.length}
                </span>{" "}
                លទ្ធផល
                {searchType !== "all" && (
                  <span>
                    {" "}
                    សម្រាប់{" "}
                    <span className="font-semibold">
                      {searchType === "name"
                        ? "ឈ្មោះ"
                        : searchType === "email"
                          ? "Email"
                          : searchType === "phone"
                            ? "ទូរស័ព្ទ"
                            : searchType === "address"
                              ? "អាសយដ្ឋាន"
                              : "ID"}
                    </span>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-center gap-3">
            <AlertCircle className="h-5 w-5" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">
              កំពុងទាញយកទិន្នន័យ...
            </p>
          </div>
        ) : totalItems === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "គ្មានលទ្ធផលស្វែងរក" : "គ្មានអ្នកផ្គត់ផ្គង់ទេ"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង"
                : canCreate
                  ? "ចាប់ផ្តើមដោយបន្ថែមអ្នកផ្គត់ផ្គង់ថ្មី"
                  : "មិនមានអ្នកផ្គត់ផ្គង់សម្រាប់អ្នកប្រើប្រាស់នេះទេ"}
            </p>
            {searchTerm ? (
              <button
                onClick={clearSearch}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg transition-all"
              >
                សម្អាតការស្វែងរក
              </button>
            ) : canCreate ? (
              <Link
                to="/suppliers/new"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-medium shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                បង្កើតអ្នកផ្គត់ផ្គង់ថ្មី
              </Link>
            ) : null}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ឈ្មោះ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ទូរស័ព្ទទី១
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ទូរស័ព្ទទី២
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      អាសយដ្ឋាន
                    </th>
                    {(canEdit || canDelete) && (
                      <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        សកម្មភាព
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {pageItems.map((s, index) => (
                    <tr
                      key={s.id}
                      className={`hover:bg-blue-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-bold rounded-lg">
                          #{s.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {s.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {s.name || "-"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.email ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span>{s.email}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.phone_first ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{s.phone_first}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.phone_second ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="h-4 w-4 text-gray-400" />
                            <span>{s.phone_second}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {s.address ? (
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="max-w-xs truncate">
                              {s.address}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">-</span>
                        )}
                      </td>
                      {(canEdit || canDelete) && (
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex items-center justify-end gap-2">
                            {canEdit && (
                              <Link
                                to={`/suppliers/edit/${s.id}`}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                                title="កែសម្រួល"
                              >
                                <Edit className="h-5 w-5" />
                              </Link>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(s.id)}
                                disabled={deleting === s.id}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                title="លុប"
                              >
                                {deleting === s.id ? (
                                  <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t bg-gradient-to-r from-gray-50 to-gray-100 gap-3">
                <div className="text-sm text-gray-700 font-medium">
                  បង្ហាញ{" "}
                  <span className="font-bold text-blue-600">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                  </span>{" "}
                  នៃ{" "}
                  <span className="font-bold text-blue-600">{totalItems}</span>{" "}
                  អ្នកផ្គត់ផ្គង់
                </div>

                <nav className="flex items-center gap-1 flex-wrap justify-center">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    « ដើម
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    មុន
                  </button>

                  {renderPageButtons().map((p, idx) =>
                    p === "..." ? (
                      <span
                        key={`dots-${idx}`}
                        className="px-2 text-gray-500 font-bold"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-4 py-2 border rounded-lg text-sm font-medium transition-all transform hover:scale-105 ${
                          currentPage === p
                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600 shadow-lg"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    បន្ទាប់
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ចុង »
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplierList;
