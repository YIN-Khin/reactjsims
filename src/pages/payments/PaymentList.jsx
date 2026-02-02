// // src/pages/payments/PaymentList.jsx
// import React, { useEffect, useState } from "react";
// import { fetchPayments, deletePayment } from "../../api/payment.api";
// import { Plus, Edit, Trash2, Search, CreditCard, DollarSign } from "lucide-react";
// import { useAuth } from "../../context/AuthContext";
// import { can } from "../../utils/permissions";
// import PaymentForm from "./PaymentForm";

// const ITEMS_PER_PAGE = 10;

// const PaymentList = () => {
//   const { user } = useAuth();
//   const [payments, setPayments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [showForm, setShowForm] = useState(false);
//   const [editingPayment, setEditingPayment] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   // Permission checks
//   const canCreate = can(user, 'payment', 'create');
//   const canEdit = can(user, 'payment', 'edit');
//   const canDelete = can(user, 'payment', 'delete');

//   useEffect(() => {
//     getPayments();
//   }, []);

//   const getPayments = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const data = await fetchPayments();
//       setPayments(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error("Error fetching payments:", error);
//       setError("មិនអាចទាញយកបញ្ជីការទូទាត់បានទេ");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id) => {
//     if (!window.confirm("តើអ្នកពិតជាចង់លុបការទូទាត់នេះមែនទេ?")) {
//       return;
//     }

//     try {
//       await deletePayment(id);
//       getPayments();
//     } catch (error) {
//       console.error("Error deleting payment:", error);
//       setError("មិនអាចលុបការទូទាត់បានទេ");
//     }
//   };

//   const handleAddPayment = () => {
//     setEditingPayment(null);
//     setShowForm(true);
//   };

//   const handleEditPayment = (payment) => {
//     setEditingPayment(payment.id);
//     setShowForm(true);
//   };

//   const handleFormClose = () => {
//     setShowForm(false);
//     setEditingPayment(null);
//   };

//   const handleFormSuccess = () => {
//     getPayments();
//   };

//   const getMethodLabel = (method) => {
//     const methods = {
//       cash: "សាច់ប្រាក់",
//       credit_card: "កាតឥណទាន",
//       bank_transfer: "ផ្ទេរប្រាក់តាមធនាគារ"
//     };
//     return methods[method] || method;
//   };

//   const getMethodIcon = (method) => {
//     switch (method) {
//       case 'cash':
//         return <DollarSign className="h-4 w-4" />;
//       case 'credit_card':
//         return <CreditCard className="h-4 w-4" />;
//       case 'bank_transfer':
//         return <CreditCard className="h-4 w-4" />;
//       default:
//         return <DollarSign className="h-4 w-4" />;
//     }
//   };

//   // 🔍 Client-side search
//   const filteredPayments = payments.filter((payment) =>
//     payment.method?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     payment.amount?.toString().includes(searchTerm) ||
//     payment.id?.toString().includes(searchTerm) ||
//     (payment.sale_id && payment.sale_id.toString().includes(searchTerm))
//   );

//   // 📄 Pagination logic
//   const totalItems = filteredPayments.length;
//   const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
//   const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//   const paginatedPayments = filteredPayments.slice(startIndex, startIndex + ITEMS_PER_PAGE);

//   // 🔄 Reset to page 1 when search changes
//   const handleSearchChange = (value) => {
//     setSearchTerm(value);
//     setCurrentPage(1);
//   };

//   return (
//     <div className="p-4 md:p-6">
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
//         <div>
//           <h2 className="text-xl md:text-2xl font-bold text-gray-800">
//             បញ្ជីការទូទាត់
//           </h2>
//           <p className="text-gray-600 text-sm mt-1">
//             គ្រប់គ្រងការទូទាត់ទាំងអស់ ({totalItems})
//           </p>
//         </div>
//         {canCreate && (
//           <button
//             onClick={handleAddPayment}
//             className="mt-4 md:mt-0 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
//           >
//             <Plus className="w-5 h-5" />
//             បន្ថែមការទូទាត់ថ្មី
//           </button>
//         )}
//       </div>

//       {/* Search */}
//       <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => handleSearchChange(e.target.value)}
//             placeholder="ស្វែងរកការទូទាត់ (លេខ, វិធីសាស្ត្រ, ចំនួន...)"
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
//           {error}
//         </div>
//       )}

//       {/* Loading State */}
//       {loading ? (
//         <div className="text-center py-8">
//           <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <p className="mt-2 text-gray-600">កំពុងទាញយកទិន្នន័យ...</p>
//         </div>
//       ) : (
//         <>
//           {/* Payments Table */}
//           <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//             {paginatedPayments.length === 0 ? (
//               <div className="text-center py-8">
//                 <p className="text-gray-500">
//                   {searchTerm ? `គ្មានការទូទាត់ណាដែលផ្គូផ្គង "${searchTerm}"` : "គ្មានការទូទាត់ទេ"}
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         លេខសម្គាល់
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         ការលក់
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         ចំនួនទឹកប្រាក់
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         វិធីសាស្ត្រ
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         កាលបរិច្ឆេទ
//                       </th>
//                       <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                         សកម្មភាព
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {paginatedPayments.map((payment) => (
//                       <tr key={payment.id} className="hover:bg-gray-50">
//                         <td className="px-4 py-3 whitespace-nowrap text-sm">
//                           #{payment.id}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm">
//                           {payment.sale_id ? (
//                             <span className="text-blue-600">
//                               ការលក់ #{payment.sale_id}
//                             </span>
//                           ) : (
//                             <span className="text-gray-400">-</span>
//                           )}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-green-600">
//                           ${parseFloat(payment.amount || 0).toFixed(2)}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap">
//                           <div className="flex items-center">
//                             <div className="mr-2 text-gray-500">
//                               {getMethodIcon(payment.method)}
//                             </div>
//                             <span className="text-sm text-gray-900">
//                               {getMethodLabel(payment.method)}
//                             </span>
//                           </div>
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
//                           {payment.created_at ? new Date(payment.created_at).toLocaleDateString('km-KH') : "-"}
//                         </td>
//                         <td className="px-4 py-3 whitespace-nowrap text-sm">
//                           <div className="flex space-x-2">
//                             {canEdit && (
//                               <button
//                                 onClick={() => handleEditPayment(payment)}
//                                 className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-1 rounded text-sm flex items-center gap-1"
//                               >
//                                 <Edit className="h-4 w-4" />
//                                 កែសម្រួល
//                               </button>
//                             )}
//                             {canDelete && (
//                               <button
//                                 onClick={() => handleDelete(payment.id)}
//                                 className="bg-red-600 text-white hover:bg-red-700 px-3 py-1 rounded text-sm flex items-center gap-1"
//                               >
//                                 <Trash2 className="h-4 w-4" />
//                                 លុប
//                               </button>
//                             )}
//                             {!canEdit && !canDelete && (
//                               <span className="text-gray-400 text-sm">មិនមានសកម្មភាព</span>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>

//           {/* Pagination Controls */}
//           {totalPages > 1 && (
//             <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
//               <div className="text-sm text-gray-600">
//                 បង្ហាញ {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
//                 {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} នៃ {totalItems} ការទូទាត់
//               </div>
//               <div className="flex items-center gap-1">
//                 <button
//                   onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//                   disabled={currentPage === 1}
//                   className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   មុន
//                 </button>

//                 {[...Array(totalPages)].map((_, i) => {
//                   const pageNum = i + 1;
//                   if (totalPages <= 5) {
//                     return (
//                       <button
//                         key={pageNum}
//                         onClick={() => setCurrentPage(pageNum)}
//                         className={`px-3 py-2 border rounded-md text-sm ${
//                           currentPage === pageNum
//                             ? "bg-blue-600 text-white border-blue-600"
//                             : "border-gray-300 hover:bg-gray-50"
//                         }`}
//                       >
//                         {pageNum}
//                       </button>
//                     );
//                   } else {
//                     if (pageNum === 1 || pageNum === totalPages ||
//                         (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
//                       return (
//                         <button
//                           key={pageNum}
//                           onClick={() => setCurrentPage(pageNum)}
//                           className={`px-3 py-2 border rounded-md text-sm ${
//                             currentPage === pageNum
//                               ? "bg-blue-600 text-white border-blue-600"
//                               : "border-gray-300 hover:bg-gray-50"
//                           }`}
//                         >
//                           {pageNum}
//                         </button>
//                       );
//                     } else if (pageNum === 2 && currentPage > 3) {
//                       return <span key="start-ellipsis" className="px-2 py-2">...</span>;
//                     } else if (pageNum === totalPages - 1 && currentPage < totalPages - 2) {
//                       return <span key="end-ellipsis" className="px-2 py-2">...</span>;
//                     }
//                     return null;
//                   }
//                 })}

//                 <button
//                   onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//                   disabled={currentPage === totalPages}
//                   className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
//                 >
//                   បន្ទាប់
//                 </button>
//               </div>
//             </div>
//           )}
//         </>
//       )}

//       {/* Payment Form Modal */}
//       <PaymentForm
//         isOpen={showForm}
//         onClose={handleFormClose}
//         onSuccess={handleFormSuccess}
//         paymentId={editingPayment}
//       />
//     </div>
//   );
// };

// export default PaymentList;

// src/pages/payments/PaymentList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { fetchPayments, deletePayment } from "../../api/payment.api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  CreditCard,
  DollarSign,
  TrendingUp,
  Wallet,
  Calendar,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { can } from "../../utils/permissions";
import PaymentForm from "./PaymentForm";

const ITEMS_PER_PAGE = 10;

const PaymentList = () => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  // Permission checks
  const canCreate = can(user, "payment", "create");
  const canEdit = can(user, "payment", "edit");
  const canDelete = can(user, "payment", "delete");

  useEffect(() => {
    getPayments();
  }, []);

  const getPayments = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPayments();
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching payments:", error);
      setError("មិនអាចទាញយកបញ្ជីការទូទាត់បានទេ");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកពិតជាចង់លុបការទូទាត់នេះមែនទេ?")) {
      return;
    }

    try {
      setDeleting(id);
      await deletePayment(id);
      getPayments();
    } catch (error) {
      console.error("Error deleting payment:", error);
      setError("មិនអាចលុបការទូទាត់បានទេ");
    } finally {
      setDeleting(null);
    }
  };

  const handleAddPayment = () => {
    setEditingPayment(null);
    setShowForm(true);
  };

  const handleEditPayment = (payment) => {
    setEditingPayment(payment.id);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPayment(null);
  };

  const handleFormSuccess = () => {
    getPayments();
  };

  const getMethodLabel = (method) => {
    const methods = {
      cash: "សាច់ប្រាក់",
      credit_card: "កាតឥណទាន",
      bank_transfer: "ផ្ទេរប្រាក់តាមធនាគារ",
    };
    return methods[method] || method;
  };

  const getMethodBadgeColor = (method) => {
    switch (method) {
      case "cash":
        return "bg-gradient-to-r from-green-500 to-emerald-500 text-white";
      case "credit_card":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      case "bank_transfer":
        return "bg-gradient-to-r from-purple-500 to-pink-500 text-white";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case "cash":
        return <DollarSign className="h-4 w-4" />;
      case "credit_card":
        return <CreditCard className="h-4 w-4" />;
      case "bank_transfer":
        return <Wallet className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  // Filter payments
  const filteredPayments = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return payments;

    return payments.filter(
      (payment) =>
        payment.method?.toLowerCase().includes(q) ||
        payment.amount?.toString().includes(q) ||
        payment.id?.toString().includes(q) ||
        (payment.sale_id && payment.sale_id.toString().includes(q)),
    );
  }, [payments, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalAmount = payments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0,
    );
    const cashPayments = payments.filter((p) => p.method === "cash");
    const cardPayments = payments.filter((p) => p.method === "credit_card");
    const bankPayments = payments.filter((p) => p.method === "bank_transfer");

    const cashTotal = cashPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0,
    );
    const cardTotal = cardPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0,
    );
    const bankTotal = bankPayments.reduce(
      (sum, p) => sum + Number(p.amount || 0),
      0,
    );

    return {
      totalAmount,
      totalCount: payments.length,
      cashTotal,
      cashCount: cashPayments.length,
      cardTotal,
      cardCount: cardPayments.length,
      bankTotal,
      bankCount: bankPayments.length,
    };
  }, [payments]);

  // Pagination
  const totalItems = filteredPayments.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPayments.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

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
            <div className="h-12 w-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                បញ្ជីការទូទាត់
              </h1>
              <p className="text-gray-600 text-sm">គ្រប់គ្រងការទូទាត់ទាំងអស់</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ទឹកប្រាក់សរុប</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.totalAmount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.totalCount} ការទូទាត់
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">សាច់ប្រាក់</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.cashTotal.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.cashCount} ការទូទាត់
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-indigo-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">កាតឥណទាន</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.cardTotal.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.cardCount} ការទូទាត់
                </p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">ផ្ទេរតាមធនាគារ</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${stats.bankTotal.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.bankCount} ការទូទាត់
                </p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Wallet className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="ស្វែងរកតាម លេខ, វិធីសាស្ត្រ, ចំនួន..."
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>
            </div>

            {canCreate && (
              <button
                onClick={handleAddPayment}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                បន្ថែមការទូទាត់ថ្មី
              </button>
            )}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg text-red-700 flex items-center gap-3">
            <div className="h-5 w-5 rounded-full bg-red-200 flex items-center justify-center">
              <span className="text-red-600 font-bold text-xs">!</span>
            </div>
            <span>{error}</span>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600 font-medium">
              កំពុងទាញយកទិន្នន័យ...
            </p>
          </div>
        ) : totalItems === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              គ្មានការទូទាត់
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? `គ្មានការទូទាត់ណាដែលផ្គូផ្គង "${searchTerm}"`
                : canCreate
                  ? "ចាប់ផ្តើមដោយបន្ថែមការទូទាត់ថ្មី"
                  : "មិនមានការទូទាត់ទេ"}
            </p>
            {canCreate && !searchTerm && (
              <button
                onClick={handleAddPayment}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-medium shadow-lg transition-all"
              >
                <Plus className="h-5 w-5 mr-2" />
                បន្ថែមការទូទាត់ថ្មី
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      លេខសម្គាល់
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ការលក់
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ចំនួនទឹកប្រាក់
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      វិធីសាស្ត្រ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      កាលបរិច្ឆេទ
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      សកម្មភាព
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedPayments.map((payment, index) => (
                    <tr
                      key={payment.id}
                      className={`hover:bg-green-50 transition-colors ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-800 text-sm font-bold rounded-lg">
                          #{payment.id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {payment.sale_id ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-semibold rounded-lg">
                            <TrendingUp className="h-3 w-3" />
                            ការលក់ #{payment.sale_id}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-sm">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <span className="text-lg font-bold text-green-700">
                          ${parseFloat(payment.amount || 0).toFixed(2)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div
                          className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg font-medium text-sm shadow-sm ${getMethodBadgeColor(payment.method)}`}
                        >
                          {getMethodIcon(payment.method)}
                          {getMethodLabel(payment.method)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {payment.created_at
                            ? new Date(payment.created_at).toLocaleDateString(
                                "km-KH",
                              )
                            : "-"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <button
                              onClick={() => handleEditPayment(payment)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                              title="កែសម្រួល"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(payment.id)}
                              disabled={deleting === payment.id}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                              title="លុប"
                            >
                              {deleting === payment.id ? (
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
                  <span className="font-bold text-green-600">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                  </span>{" "}
                  នៃ{" "}
                  <span className="font-bold text-green-600">{totalItems}</span>{" "}
                  ការទូទាត់
                </div>

                <nav className="flex items-center gap-1 flex-wrap justify-center">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    « ដើម
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                            ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white border-green-600 shadow-lg"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-600"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    បន្ទាប់
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-green-50 hover:border-green-300 hover:text-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ចុង »
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Payment Form Modal */}
      <PaymentForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        paymentId={editingPayment}
      />
    </div>
  );
};

export default PaymentList;
