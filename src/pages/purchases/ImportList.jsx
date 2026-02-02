// // src/pages/purchases/ImportList.jsx
// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { fetchPurchases, deletePurchase } from "../../api/purchase.api";
// import { useAuth } from "../../context/AuthContext";
// import { AdminOnly, can } from "../../utils/permissions";
// import { ShieldX, Search, X, Flame } from "lucide-react";

// const ITEMS_PER_PAGE = 10;

// const ImportList = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [purchases, setPurchases] = useState([]);
//   const [filteredPurchases, setFilteredPurchases] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [searchType, setSearchType] = useState("all");

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);

//   // Permission checks
//   const canCreate = can(user, "purchase", "create");
//   const canEdit = can(user, "purchase", "edit");
//   const canDelete = can(user, "purchase", "delete");

//   useEffect(() => {
//     loadPurchases();
//   }, []);

//   useEffect(() => {
//     filterPurchases();
//   }, [searchTerm, searchType, purchases]);

//   useEffect(() => {
//     // Update pagination when filtered purchases change
//     const total = filteredPurchases.length;
//     setTotalItems(total);
//     setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));

//     // Reset to page 1 if current page is invalid
//     if (currentPage > Math.ceil(total / ITEMS_PER_PAGE)) {
//       setCurrentPage(1);
//     }
//   }, [filteredPurchases, currentPage]);

//   const loadPurchases = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const response = await fetchPurchases();
//       const purchasesData =
//         response?.purchase || response?.data || response || [];
//       const sortedPurchases = Array.isArray(purchasesData)
//         ? purchasesData.sort((a, b) => b.id - a.id) // Sort by ID DESC (newest first)
//         : [];
//       setPurchases(sortedPurchases);
//       setFilteredPurchases(sortedPurchases);
//     } catch (error) {
//       console.error("Error loading purchases:", error);
//       setError("មិនអាចទាញយកបញ្ជីទិញបានទេ");
//       setPurchases([]);
//       setFilteredPurchases([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filterPurchases = () => {
//     if (!searchTerm.trim()) {
//       setFilteredPurchases(purchases);
//       return;
//     }

//     const term = searchTerm.toLowerCase();
//     const filtered = purchases.filter((purchase) => {
//       switch (searchType) {
//         case "supplier":
//           return purchase.Supplier?.name?.toLowerCase().includes(term);
//         case "date":
//           const dateStr = purchase.created_at
//             ? new Date(purchase.created_at).toLocaleDateString("en-US")
//             : "";
//           return dateStr.toLowerCase().includes(term);
//         case "id":
//           return purchase.id.toString().includes(term);
//         case "all":
//         default:
//           return (
//             purchase.id.toString().includes(term) ||
//             purchase.Supplier?.name?.toLowerCase().includes(term) ||
//             purchase.total?.toString().includes(term) ||
//             purchase.paid?.toString().includes(term) ||
//             purchase.balance?.toString().includes(term)
//           );
//       }
//     });

//     setFilteredPurchases(filtered);
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("តើអ្នកពិតជាចង់លុបការទិញនេះមែនទេ?")) {
//       return;
//     }

//     try {
//       await deletePurchase(id);
//       loadPurchases();
//     } catch (error) {
//       console.error("Error deleting purchase:", error);
//       setError("មិនអាចលុបការទិញបានទេ");
//     }
//   };

//   const handleEdit = (id) => {
//     navigate(`/purchases/edit/${id}`);
//   };

//   const handleClearSearch = () => {
//     setSearchTerm("");
//     setSearchType("all");
//   };

//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) {
//       setCurrentPage(page);
//     }
//   };

//   // Calculate totals from filtered purchases
//   const totalAmount = filteredPurchases.reduce(
//     (sum, purchase) => sum + parseFloat(purchase.total || 0),
//     0,
//   );
//   const totalPaid = filteredPurchases.reduce(
//     (sum, purchase) => sum + parseFloat(purchase.paid || 0),
//     0,
//   );
//   const totalBalance = filteredPurchases.reduce(
//     (sum, purchase) => sum + parseFloat(purchase.balance || 0),
//     0,
//   );

//   // Get current page items
//   const getCurrentPageItems = () => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     return filteredPurchases.slice(startIndex, endIndex);
//   };

//   return (
//     <div>
//       <div className="p-4 md:p-6">
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//           <div>
//             <h2 className="text-xl md:text-2xl font-bold text-gray-800">
//               បញ្ជីទិញចូល
//             </h2>
//             <p className="text-gray-600 text-sm mt-1">
//               គ្រប់គ្រងការទិញទាំងអស់ ({totalItems})
//             </p>
//           </div>
//           {canCreate && (
//             <button
//               onClick={() => navigate("/purchases/new")}
//               className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M12 4v16m8-8H4"
//                 />
//               </svg>
//               បន្ថែមការទិញថ្មី
//             </button>
//           )}
//         </div>

//         {/* Search Section */}
//         <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//           <div className="flex flex-col md:flex-row gap-3">
//             {/* Search Type Selector */}
//             <div className="w-full md:w-48">
//               <select
//                 value={searchType}
//                 onChange={(e) => setSearchType(e.target.value)}
//                 className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//               >
//                 <option value="all">ស្វែងរកទាំងអស់</option>
//                 <option value="id">ស្វែងរកតាម ID</option>
//                 <option value="supplier">ស្វែងរកតាមអ្នកផ្គត់ផ្គង់</option>
//                 <option value="date">ស្វែងរកតាមថ្ងៃខែ</option>
//               </select>
//             </div>

//             {/* Search Input */}
//             <div className="flex-1 relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder={
//                   searchType === "all"
//                     ? "ស្វែងរក ID, អ្នកផ្គត់ផ្គង់, សរុប..."
//                     : searchType === "supplier"
//                       ? "ស្វែងរកឈ្មោះអ្នកផ្គត់ផ្គង់..."
//                       : searchType === "date"
//                         ? "ស្វែងរកថ្ងៃខែ (MM/DD/YYYY)..."
//                         : "ស្វែងរក ID..."
//                 }
//                 className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               {searchTerm && (
//                 <button
//                   onClick={handleClearSearch}
//                   className="absolute inset-y-0 right-0 pr-3 flex items-center"
//                 >
//                   <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
//                 </button>
//               )}
//             </div>

//             {/* Search Button */}
//             <button
//               onClick={filterPurchases}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors whitespace-nowrap"
//             >
//               <Search className="h-5 w-5" />
//               <span className="hidden md:inline">ស្វែងរក</span>
//             </button>
//           </div>

//           {/* Search Results Info */}
//           {searchTerm && (
//             <div className="mt-3 text-sm text-gray-600">
//               រកឃើញ{" "}
//               <span className="font-semibold text-blue-600">
//                 {filteredPurchases.length}
//               </span>{" "}
//               លទ្ធផល
//               {searchType !== "all" && (
//                 <span>
//                   {" "}
//                   សម្រាប់{" "}
//                   <span className="font-semibold">
//                     {searchType === "supplier"
//                       ? "អ្នកផ្គត់ផ្គង់"
//                       : searchType === "date"
//                         ? "ថ្ងៃខែ"
//                         : "ID"}
//                   </span>
//                 </span>
//               )}
//             </div>
//           )}
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//           <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm p-4 border border-blue-200">
//             <p className="text-sm text-blue-700 mb-1 font-medium">សរុបទិញ</p>
//             <p className="text-2xl font-bold text-blue-600">
//               ${totalAmount.toFixed(2)}
//             </p>
//             <p className="text-xs text-blue-600 mt-1">
//               {filteredPurchases.length} ការទិញ
//             </p>
//           </div>
//           <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg shadow-sm p-4 border border-green-200">
//             <p className="text-sm text-green-700 mb-1 font-medium">
//               សរុបបានបង់
//             </p>
//             <p className="text-2xl font-bold text-green-600">
//               ${totalPaid.toFixed(2)}
//             </p>
//             <p className="text-xs text-green-600 mt-1">
//               {((totalPaid / totalAmount) * 100 || 0).toFixed(1)}% បានបង់
//             </p>
//           </div>
//           <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-lg shadow-sm p-4 border border-red-200">
//             <p className="text-sm text-red-700 mb-1 font-medium">សរុបបំណុល</p>
//             <p className="text-2xl font-bold text-red-600">
//               ${totalBalance.toFixed(2)}
//             </p>
//             <p className="text-xs text-red-600 mt-1">
//               {((totalBalance / totalAmount) * 100 || 0).toFixed(1)}% នៅសល់
//             </p>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm flex items-center">
//             <svg
//               className="w-5 h-5 mr-2"
//               fill="currentColor"
//               viewBox="0 0 20 20"
//             >
//               <path
//                 fillRule="evenodd"
//                 d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
//                 clipRule="evenodd"
//               />
//             </svg>
//             {error}
//           </div>
//         )}

//         {/* Loading State */}
//         {loading ? (
//           <div className="bg-white rounded-lg shadow-sm p-8">
//             <div className="text-center">
//               <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//               <p className="mt-4 text-gray-600">កំពុងទាញយកទិន្នន័យ...</p>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             {filteredPurchases.length === 0 ? (
//               <div className="text-center py-12">
//                 <svg
//                   className="mx-auto h-16 w-16 text-gray-400"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
//                   />
//                 </svg>
//                 <h3 className="mt-4 text-lg font-medium text-gray-900">
//                   {searchTerm ? "គ្មានលទ្ធផលស្វែងរក" : "គ្មានការទិញទេ"}
//                 </h3>
//                 <p className="mt-2 text-sm text-gray-500">
//                   {searchTerm
//                     ? "សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង"
//                     : "ចាប់ផ្តើមដោយការបង្កើតការទិញថ្មី។"}
//                 </p>
//                 {searchTerm && (
//                   <button
//                     onClick={handleClearSearch}
//                     className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
//                   >
//                     សម្អាតការស្វែងរក
//                   </button>
//                 )}
//               </div>
//             ) : (
//               <>
//                 <div className="overflow-x-auto">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           ID
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           ថ្ងៃខែ
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           អ្នកផ្គត់ផ្គង់
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           សរុប
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           បានបង់
//                         </th>
//                         <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           បំណុល
//                         </th>
//                         <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           ស្ថានភាព
//                         </th>
//                         <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           សកម្មភាព
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {getCurrentPageItems().map((purchase) => (
//                         <tr
//                           key={purchase.id}
//                           className="hover:bg-gray-50 transition-colors"
//                         >
//                           <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                             #{purchase.id}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
//                             {purchase.created_at
//                               ? new Date(
//                                   purchase.created_at,
//                                 ).toLocaleDateString("km-KH")
//                               : "-"}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm">
//                             <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
//                               {purchase.Supplier?.name || "N/A"}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm font-semibold text-right text-gray-900">
//                             ${parseFloat(purchase.total || 0).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-right text-green-600 font-medium">
//                             ${parseFloat(purchase.paid || 0).toFixed(2)}
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
//                             <span
//                               className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
//                                 parseFloat(purchase.balance || 0) > 0
//                                   ? "bg-red-100 text-red-800"
//                                   : "bg-green-100 text-green-800"
//                               }`}
//                             >
//                               ${parseFloat(purchase.balance || 0).toFixed(2)}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
//                             <span
//                               className={`px-3 py-1 rounded-full text-xs font-semibold ${
//                                 parseFloat(purchase.balance || 0) > 0
//                                   ? "bg-yellow-100 text-yellow-800"
//                                   : "bg-green-100 text-green-800"
//                               }`}
//                             >
//                               {parseFloat(purchase.balance || 0) > 0
//                                 ? "បំណុល"
//                                 : "បានបង់"}
//                             </span>
//                           </td>
//                           <td className="px-4 py-3 whitespace-nowrap text-sm">
//                             <AdminOnly>
//                               <div className="flex justify-center space-x-2">
//                                 {canEdit && (
//                                   <button
//                                     onClick={() => handleEdit(purchase.id)}
//                                     className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
//                                   >
//                                     កែសម្រួល
//                                   </button>
//                                 )}
//                                 {canDelete && (
//                                   <button
//                                     onClick={() => handleDelete(purchase.id)}
//                                     className="bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded text-sm font-medium transition-colors"
//                                   >
//                                     លុប
//                                   </button>
//                                 )}
//                                 {!canEdit && !canDelete && (
//                                   <span className="text-gray-400 text-sm">
//                                     មិនមានសកម្មភាព
//                                   </span>
//                                 )}
//                               </div>
//                             </AdminOnly>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                   <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t bg-gray-50 gap-4">
//                     <div className="text-sm text-gray-700 order-2 sm:order-1 whitespace-nowrap">
//                       បង្ហាញ{" "}
//                       <span className="font-medium">
//                         {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
//                         {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
//                       </span>{" "}
//                       នៃ{" "}
//                       <span className="font-medium">
//                         {totalItems.toLocaleString("km-KH")}
//                       </span>{" "}
//                       ការទិញ
//                     </div>

//                     <nav
//                       className="flex items-center gap-1 order-1 sm:order-2 flex-wrap justify-center"
//                       aria-label="ផេកការទិញ"
//                     >
//                       <button
//                         onClick={() => goToPage(1)}
//                         disabled={currentPage === 1}
//                         className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         aria-label="ទំព័រដំបូង"
//                       >
//                         « ដើម
//                       </button>

//                       <button
//                         onClick={() => goToPage(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         aria-label="មុន"
//                       >
//                         មុន
//                       </button>

//                       {(() => {
//                         const pages = [];
//                         const range = 3;
//                         let start = Math.max(1, currentPage - range);
//                         let end = Math.min(totalPages, currentPage + range);

//                         if (start > 2) {
//                           pages.push(
//                             <button
//                               key={1}
//                               onClick={() => goToPage(1)}
//                               className={`px-4 py-2 border rounded text-sm ${
//                                 currentPage === 1
//                                   ? "bg-blue-600 text-white border-blue-600"
//                                   : "border-gray-300 hover:bg-gray-50"
//                               }`}
//                             >
//                               ១
//                             </button>,
//                           );
//                           if (start > 3)
//                             pages.push(
//                               <span
//                                 key="left-ellipsis"
//                                 className="px-2 py-2 text-gray-500"
//                               >
//                                 …
//                               </span>,
//                             );
//                         }

//                         for (let i = start; i <= end; i++) {
//                           pages.push(
//                             <button
//                               key={i}
//                               onClick={() => goToPage(i)}
//                               className={`px-4 py-2 border rounded text-sm font-medium ${
//                                 currentPage === i
//                                   ? "bg-blue-600 text-white border-blue-600"
//                                   : "border-gray-300 hover:bg-gray-50"
//                               }`}
//                             >
//                               {i.toLocaleString("km-KH")}
//                             </button>,
//                           );
//                         }

//                         if (end < totalPages - 1) {
//                           if (end < totalPages - 2)
//                             pages.push(
//                               <span
//                                 key="right-ellipsis"
//                                 className="px-2 py-2 text-gray-500"
//                               >
//                                 …
//                               </span>,
//                             );
//                           pages.push(
//                             <button
//                               key={totalPages}
//                               onClick={() => goToPage(totalPages)}
//                               className={`px-4 py-2 border rounded text-sm ${
//                                 currentPage === totalPages
//                                   ? "bg-blue-600 text-white border-blue-600"
//                                   : "border-gray-300 hover:bg-gray-50"
//                               }`}
//                             >
//                               {totalPages.toLocaleString("km-KH")}
//                             </button>,
//                           );
//                         }

//                         return pages;
//                       })()}

//                       <button
//                         onClick={() => goToPage(currentPage + 1)}
//                         disabled={currentPage === totalPages}
//                         className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         aria-label="បន្ទាប់"
//                       >
//                         បន្ទាប់
//                       </button>

//                       <button
//                         onClick={() => goToPage(totalPages)}
//                         disabled={currentPage === totalPages}
//                         className="px-3 py-2 border border-gray-300 rounded text-sm text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                         aria-label="ទំព័រចុងក្រោយ"
//                       >
//                         ចុង »
//                       </button>
//                     </nav>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ImportList;

// src/pages/purchases/ImportList.jsx
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchPurchases, deletePurchase } from "../../api/purchase.api";
import { useAuth } from "../../context/AuthContext";
import { AdminOnly, can } from "../../utils/permissions";
import {
  ShoppingBag,
  Search,
  X,
  Plus,
  Edit,
  Trash2,
  Package,
  DollarSign,
  TrendingDown,
  AlertCircle,
  Truck,
  Calendar,
} from "lucide-react";

const ITEMS_PER_PAGE = 10;

const ImportList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("all");
  const [deleting, setDeleting] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);

  // Permission checks
  const canCreate = can(user, "purchase", "create");
  const canEdit = can(user, "purchase", "edit");
  const canDelete = can(user, "purchase", "delete");

  useEffect(() => {
    loadPurchases();
  }, []);

  const loadPurchases = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchPurchases();
      const purchasesData =
        response?.purchase || response?.data || response || [];
      const sortedPurchases = Array.isArray(purchasesData)
        ? purchasesData.sort((a, b) => b.id - a.id)
        : [];
      setPurchases(sortedPurchases);
    } catch (error) {
      console.error("Error loading purchases:", error);
      setError("មិនអាចទាញយកបញ្ជីទិញបានទេ");
      setPurchases([]);
    } finally {
      setLoading(false);
    }
  };

  // Calculate total quantity from purchase items
  const getTotalQuantity = (purchase) => {
    if (!purchase.PurchaseItems || !Array.isArray(purchase.PurchaseItems))
      return 0;
    return purchase.PurchaseItems.reduce(
      (sum, item) => sum + (item.qty || 0),
      0,
    );
  };

  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកពិតជាចង់លុបការទិញនេះមែនទេ?")) {
      return;
    }

    try {
      setDeleting(id);
      await deletePurchase(id);
      loadPurchases();
    } catch (error) {
      console.error("Error deleting purchase:", error);
      setError("មិនអាចលុបការទិញបានទេ");
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (id) => {
    navigate(`/purchases/edit/${id}`);
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setSearchType("all");
    setCurrentPage(1);
  };

  // Filter purchases
  const filteredPurchases = useMemo(() => {
    if (!searchTerm.trim()) return purchases;

    const term = searchTerm.toLowerCase();
    return purchases.filter((purchase) => {
      switch (searchType) {
        case "supplier":
          return purchase.Supplier?.name?.toLowerCase().includes(term);
        case "date":
          const dateStr = purchase.created_at
            ? new Date(purchase.created_at).toLocaleDateString("en-US")
            : "";
          return dateStr.toLowerCase().includes(term);
        case "id":
          return purchase.id.toString().includes(term);
        case "all":
        default:
          return (
            purchase.id.toString().includes(term) ||
            purchase.Supplier?.name?.toLowerCase().includes(term) ||
            purchase.total?.toString().includes(term) ||
            purchase.paid?.toString().includes(term) ||
            purchase.balance?.toString().includes(term)
          );
      }
    });
  }, [purchases, searchTerm, searchType]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = purchases.reduce(
      (sum, p) => sum + parseFloat(p.total || 0),
      0,
    );
    const totalPaid = purchases.reduce(
      (sum, p) => sum + parseFloat(p.paid || 0),
      0,
    );
    const totalBalance = purchases.reduce(
      (sum, p) => sum + parseFloat(p.balance || 0),
      0,
    );
    const totalQty = purchases.reduce((sum, p) => sum + getTotalQuantity(p), 0);

    return {
      totalAmount,
      totalPaid,
      totalBalance,
      totalQty,
      count: purchases.length,
    };
  }, [purchases]);

  // Pagination
  const totalItems = filteredPurchases.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedPurchases = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPurchases.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPurchases, currentPage]);

  const goToPage = (p) => {
    if (p < 1 || p > totalPages) return;
    setCurrentPage(p);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-gradient-to-br from-orange-600 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">បញ្ជីទិញចូល</h1>
              <p className="text-gray-600 text-sm">គ្រប់គ្រងការទិញទាំងអស់</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ចំណាយសរុប</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.count} ការទិញ
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">បានបង់</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalPaid.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((stats.totalPaid / stats.totalAmount) * 100 || 0).toFixed(
                    1,
                  )}
                  %
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">បំណុល</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalBalance.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(
                    (stats.totalBalance / stats.totalAmount) * 100 || 0
                  ).toFixed(1)}
                  %
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ចំនួនសរុប</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalQty}
                </p>
                <p className="text-xs text-gray-500 mt-1">ទំនិញទិញចូល</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
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
                className="lg:w-48 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
              >
                <option value="all">ស្វែងរកទាំងអស់</option>
                <option value="id">ស្វែងរកតាម ID</option>
                <option value="supplier">ស្វែងរកតាមអ្នកផ្គត់ផ្គង់</option>
                <option value="date">ស្វែងរកតាមថ្ងៃខែ</option>
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
                      ? "ស្វែងរក ID, អ្នកផ្គត់ផ្គង់, សរុប..."
                      : searchType === "supplier"
                        ? "ស្វែងរកឈ្មោះអ្នកផ្គត់ផ្គង់..."
                        : searchType === "date"
                          ? "ស្វែងរកថ្ងៃខែ..."
                          : "ស្វែងរក ID..."
                  }
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                />
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {canCreate && (
                <button
                  onClick={() => navigate("/purchases/new")}
                  className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  បន្ថែមការទិញថ្មី
                </button>
              )}
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="text-sm text-gray-600">
                រកឃើញ{" "}
                <span className="font-semibold text-orange-600">
                  {filteredPurchases.length}
                </span>{" "}
                លទ្ធផល
                {searchType !== "all" && (
                  <span>
                    {" "}
                    សម្រាប់{" "}
                    <span className="font-semibold">
                      {searchType === "supplier"
                        ? "អ្នកផ្គត់ផ្គង់"
                        : searchType === "date"
                          ? "ថ្ងៃខែ"
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
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">
              កំពុងទាញយកទិន្នន័យ...
            </p>
          </div>
        ) : totalItems === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? "គ្មានលទ្ធផលស្វែងរក" : "គ្មានការទិញទេ"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? "សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង"
                : canCreate
                  ? "ចាប់ផ្តើមដោយបង្កើតការទិញថ្មី"
                  : "មិនមានការទិញសម្រាប់អ្នកប្រើប្រាស់នេះទេ"}
            </p>
            {searchTerm ? (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-medium shadow-lg transition-all"
              >
                សម្អាតការស្វែងរក
              </button>
            ) : canCreate ? (
              <button
                onClick={() => navigate("/purchases/new")}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white rounded-xl font-medium shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                បង្កើតការទិញថ្មី
              </button>
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
                      ថ្ងៃខែ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      អ្នកផ្គត់ផ្គង់
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ចំនួន
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      សរុប
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      បានបង់
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      បំណុល
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ស្ថានភាព
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      សកម្មភាព
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedPurchases.map((purchase, index) => (
                    <tr
                      key={purchase.id}
                      className={`hover:bg-orange-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 text-sm font-bold rounded-lg">
                          #{purchase.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {purchase.created_at
                            ? new Date(purchase.created_at).toLocaleDateString(
                                "km-KH",
                              )
                            : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {purchase.Supplier?.name?.charAt(0) || "?"}
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {purchase.Supplier?.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-800 text-sm font-bold rounded-lg">
                          <Package className="h-4 w-4" />
                          {getTotalQuantity(purchase)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-base font-bold text-orange-700">
                          ${parseFloat(purchase.total || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-sm font-semibold text-green-600">
                          ${parseFloat(purchase.paid || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span
                          className={`inline-flex items-center px-3 py-1 text-sm font-bold rounded-lg shadow-sm ${
                            parseFloat(purchase.balance || 0) > 0
                              ? "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                              : "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                          }`}
                        >
                          ${parseFloat(purchase.balance || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-lg text-sm font-bold ${
                            parseFloat(purchase.balance || 0) > 0
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {parseFloat(purchase.balance || 0) > 0
                            ? "បំណុល"
                            : "បានបង់"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <AdminOnly>
                          <div className="flex items-center justify-end gap-2">
                            {canEdit && (
                              <button
                                onClick={() => handleEdit(purchase.id)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                                title="កែសម្រួល"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                            )}
                            {canDelete && (
                              <button
                                onClick={() => handleDelete(purchase.id)}
                                disabled={deleting === purchase.id}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                title="លុប"
                              >
                                {deleting === purchase.id ? (
                                  <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                            )}
                            {!canEdit && !canDelete && (
                              <span className="text-gray-400 text-sm">
                                មិនមានសកម្មភាព
                              </span>
                            )}
                          </div>
                        </AdminOnly>
                      </td>
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
                  <span className="font-bold text-orange-600">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                  </span>{" "}
                  នៃ{" "}
                  <span className="font-bold text-orange-600">
                    {totalItems}
                  </span>{" "}
                  ការទិញ
                </div>

                <nav className="flex items-center gap-1 flex-wrap justify-center">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    « ដើម
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                            ? "bg-gradient-to-r from-orange-600 to-red-600 text-white border-orange-600 shadow-lg"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    បន្ទាប់
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-orange-50 hover:border-orange-300 hover:text-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

export default ImportList;
