// src/pages/customers/CustomerList.jsx
import React, { useEffect, useState, useMemo } from "react";
import { fetchCustomers, deleteCustomer } from "../../api/customer.api";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  User,
  X,
  RefreshCw,
  Users,
  TrendingUp,
  Calendar,
  Phone,
  MapPin,
  Sparkles,
  UserCheck,
  Activity,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { can } from "../../utils/permissions";
import CustomerForm from "./CustomerForm";
import debounce from "lodash/debounce";

const ITEMS_PER_PAGE = 10;

const CustomerList = () => {
  const { user } = useAuth();

  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState(null);

  // Permissions
  const canCreate = can(user, "customer", "create");
  const canEdit = can(user, "customer", "edit");
  const canDelete = can(user, "customer", "delete");

  // Debounce search
  useEffect(() => {
    const handler = debounce((value) => {
      setDebouncedSearch(value.trim());
      setCurrentPage(1);
    }, 400);

    handler(searchTerm);
    return () => handler.cancel();
  }, [searchTerm]);

  // Fetch customers
  const loadCustomers = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchCustomers();
      const customersArray = Array.isArray(data) ? data : [];
      const sortedCustomers = customersArray.sort((a, b) => b.id - a.id);
      setCustomers(sortedCustomers);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("មិនអាចទាញយកបញ្ជីអតិថិជនបានទេ");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Handlers
  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកប្រាកដជាចង់លុបអតិថិជននេះមែនទេ?")) return;
    try {
      setDeleting(id);
      await deleteCustomer(id);
      loadCustomers();
    } catch (err) {
      console.error("Error deleting customer:", err);
      setError("មិនអាចលុបអតិថិជនបានទេ");
    } finally {
      setDeleting(null);
    }
  };

  const handleAddNew = () => {
    setEditingCustomerId(null);
    setShowForm(true);
  };

  const handleEdit = (customer) => {
    setEditingCustomerId(customer.id);
    setShowForm(true);
  };

  const handleFormClose = () => setShowForm(false);
  const handleFormSuccess = () => {
    setShowForm(false);
    loadCustomers();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Client-side Filtering & Pagination
  const filteredCustomers = useMemo(() => {
    if (!debouncedSearch) return customers;

    const term = debouncedSearch.toLowerCase();
    return customers.filter((c) =>
      `${c.name || ""} ${c.phone || ""} ${c.address || ""}`
        .toLowerCase()
        .includes(term),
    );
  }, [customers, debouncedSearch]);

  // Statistics
  const stats = useMemo(() => {
    const today = new Date();
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    return {
      total: customers.length,
      newThisMonth: customers.filter(
        (c) => c.created_at && new Date(c.created_at) >= thisMonth,
      ).length,
      withPhone: customers.filter((c) => c.phone).length,
      withAddress: customers.filter((c) => c.address).length,
    };
  }, [customers]);

  const totalItems = filteredCustomers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedCustomers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredCustomers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
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

  // Generate avatar color based on name
  const getAvatarColor = (name) => {
    const colors = [
      "from-rose-400 to-pink-500",
      "from-blue-400 to-cyan-500",
      "from-green-400 to-emerald-500",
      "from-purple-400 to-violet-500",
      "from-orange-400 to-amber-500",
      "from-teal-400 to-cyan-500",
      "from-indigo-400 to-blue-500",
      "from-fuchsia-400 to-pink-500",
    ];
    const index = (name?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 p-4 md:p-6 lg:p-8">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:ital,wght@0,100..700;1,100..700&family=Merienda:wght@300..900&display=swap');
        
        * {
          font-family: 'Kantumruy Pro', system-ui, -apple-system, sans-serif;
        }
        
        .customer-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .customer-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 40px -10px rgba(59, 130, 246, 0.3);
        }
        
        .stat-card {
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.5) 100%);
          z-index: 0;
        }
        
        .stat-card > * {
          position: relative;
          z-index: 1;
        }
        
        .stat-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 20px 50px -15px rgba(59, 130, 246, 0.4);
        }
        
        .ripple-effect {
          position: relative;
          overflow: hidden;
        }
        
        .ripple-effect::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          transform: translate(-50%, -50%);
          transition: width 0.6s, height 0.6s;
        }
        
        .ripple-effect:active::after {
          width: 300px;
          height: 300px;
        }
        
        .shimmer-border {
          position: relative;
        }
        
        .shimmer-border::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(59, 130, 246, 0.4) 50%, 
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        .shimmer-border:hover::before {
          opacity: 1;
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        .fade-in {
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes fadeIn {
          to {
            opacity: 1;
            transform: translateY(0);
          }
          from {
            opacity: 0;
            transform: translateY(15px);
          }
        }
        
        .stagger-1 { animation-delay: 0.1s; }
        .stagger-2 { animation-delay: 0.2s; }
        .stagger-3 { animation-delay: 0.3s; }
        .stagger-4 { animation-delay: 0.4s; }
        
        .pulse-glow {
          animation: pulseGlow 2s ease-in-out infinite;
        }
        
        @keyframes pulseGlow {
          0%, 100% { 
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% { 
            box-shadow: 0 0 40px rgba(59, 130, 246, 0.6);
          }
        }
        
        .gradient-text {
          background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 50%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 fade-in">
          <div className="relative">
            {/* Decorative Elements */}
            <div className="absolute -top-8 -left-8 w-40 h-40 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div
              className="absolute -top-4 -right-12 w-48 h-48 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full blur-3xl opacity-15 animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            <div className="relative flex items-center gap-5 mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-3xl flex items-center justify-center  transform hover:rotate-6 transition-all duration-300 pulse-glow">
                <Users className="h-8 w-8  text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-3xl md:text-3xl font-black gradient-text">
                  បញ្ជីអតិថិជន
                </h1>
                <p className="text-gray-600 text-base md:text-lg font-semibold mt-2 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-cyan-500" />
                  គ្រប់គ្រងអតិថិជនទាំងអស់ប្រកបដោយប្រសិទ្ធភាព
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {[
            {
              label: "អតិថិជនសរុប",
              value: stats.total,
              sublabel: "ក្នុងប្រព័ន្ធ",
              icon: Users,
              gradient: "from-blue-500 to-cyan-500",
              bgGradient: "from-blue-50 to-cyan-50",
              delay: "stagger-1",
            },
            {
              label: "អតិថិជនថ្មី",
              value: stats.newThisMonth,
              sublabel: "ខែនេះ",
              icon: UserCheck,
              gradient: "from-green-500 to-emerald-500",
              bgGradient: "from-green-50 to-emerald-50",
              delay: "stagger-2",
            },
            {
              label: "មានលេខទូរស័ព្ទ",
              value: stats.withPhone,
              sublabel: `${((stats.withPhone / stats.total) * 100 || 0).toFixed(0)}% នៃសរុប`,
              icon: Phone,
              gradient: "from-purple-500 to-violet-500",
              bgGradient: "from-purple-50 to-violet-50",
              delay: "stagger-3",
            },
            {
              label: "មានអាសយដ្ឋាន",
              value: stats.withAddress,
              sublabel: `${((stats.withAddress / stats.total) * 100 || 0).toFixed(0)}% នៃសរុប`,
              icon: MapPin,
              gradient: "from-rose-500 to-pink-500",
              bgGradient: "from-rose-50 to-pink-50",
              delay: "stagger-4",
            },
          ].map((stat, index) => (
            <div
              key={index}
              className={`stat-card bg-gradient-to-br ${stat.bgGradient} rounded-2xl shadow-sm p-6 border-2 border-blue-300 backdrop-blur-sm fade-in ${stat.delay}`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p
                    className={`text-3xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-2 font-semibold">
                    {stat.sublabel}
                  </p>
                </div>
                <div
                  className={`h-11 w-11 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center shadow-xl transform hover:rotate-12 hover:scale-110 transition-all`}
                >
                  <stat.icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="h-2 bg-white/50 rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                  style={{
                    width: `${Math.min(100, (stat.value / stats.total) * 100 || 0)}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Actions Bar */}
        <div className="bg-white/90 backdrop-blur-2xl rounded-2xl shadow-sm p-6 mb-8 border-2 border-cyan-100 fade-in">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-cyan-400 group-focus-within:text-cyan-600 transition-colors z-10" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ស្វែងរកឈ្មោះ លេខទូរស័ព្ទ ឬអាសយដ្ឋាន..."
                className="w-full pl-14 pr-14 py-4 bg-gradient-to-r from-cyan-50 to-blue-50 border-2 border-cyan-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-200 focus:border-cyan-400 transition-all text-gray-800 font-semibold placeholder:text-cyan-300 shimmer-border"
              />
              {searchTerm && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-cyan-600 transition-colors p-1.5 hover:bg-cyan-100 rounded-lg z-10"
                  aria-label="Clear search"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {/* Refresh Button */}
            <button
              onClick={loadCustomers}
              disabled={loading}
              className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl border-2 border-gray-300"
              aria-label="Refresh"
            >
              <RefreshCw
                className={`h-5 w-5 ${loading ? "animate-spin" : ""}`}
              />
              <span className="hidden md:inline">ផ្ទុកឡើងវិញ</span>
            </button>

            {/* Add Button */}
            {canCreate && (
              <button
                onClick={handleAddNew}
                className="ripple-effect bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white px-6 py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-xl hover: transform hover:scale-105 transition-all border-2 border-blue-400"
                aria-label="Add new customer"
              >
                <Plus className="h-5 w-5" strokeWidth={3} />
                <span className="hidden md:inline">បន្ថែមអតិថិជនថ្មី</span>
              </button>
            )}
          </div>

          {/* Search Results Info */}
          {searchTerm && (
            <div className="mt-5 flex items-center gap-3 text-sm font-bold text-cyan-700 bg-cyan-50 px-4 py-3 rounded-lg border-2 border-cyan-200">
              <TrendingUp className="h-5 w-5" />
              រកឃើញ{" "}
              <span className="px-3 py-1 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-lg shadow-md">
                {filteredCustomers.length}
              </span>{" "}
              លទ្ធផល
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-5 bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 rounded-xl text-red-700 flex items-center gap-3 shadow-lg fade-in font-semibold">
            <Activity className="h-6 w-6 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Main Content */}
        {loading ? (
          <div className="bg-white/90 backdrop-blur-2xl rounded-2xl  p-16 text-center border-2 border-cyan-100">
            <div className="inline-block relative mb-6">
              <div className="animate-spin rounded-full h-24 w-24 border-4 border-cyan-200"></div>
              <div className="animate-spin rounded-full h-24 w-24 border-4 border-t-cyan-600 border-r-transparent border-b-transparent border-l-transparent absolute top-0 left-0"></div>
            </div>
            <p className="text-gray-600 font-black text-xl">
              កំពុងទាញយកទិន្នន័យ...
            </p>
            <div className="mt-5 flex justify-center gap-1.5">
              <div className="w-3 h-3 bg-cyan-600 rounded-full animate-bounce"></div>
              <div
                className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="w-3 h-3 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
          </div>
        ) : totalItems === 0 ? (
          <div className="bg-white/90 backdrop-blur-2xl rounded-2xl  p-16 text-center border-2 border-cyan-100">
            <div className="h-32 w-32 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 ">
              <Users className="h-16 w-16 text-cyan-400" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-3">
              {debouncedSearch ? "មិនមានលទ្ធផលស្វែងរក" : "មិនទាន់មានអតិថិជន"}
            </h3>
            <p className="text-gray-600 mb-8 font-semibold text-lg max-w-md mx-auto">
              {debouncedSearch
                ? `គ្មានអតិថិជនណាមួយដែលត្រូវនឹង "${debouncedSearch}"`
                : canCreate
                  ? "ចាប់ផ្តើមដោយបន្ថែមអតិថិជនថ្មី"
                  : "សូមទាក់ទងអ្នកគ្រប់គ្រងប្រសិនបើអ្នកត្រូវការបន្ថែមអតិថិជន"}
            </p>
            {debouncedSearch ? (
              <button
                onClick={handleClearSearch}
                className="ripple-effect inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white rounded-xl font-black  transform hover:scale-105 transition-all"
              >
                <X className="h-5 w-5 mr-2" />
                សម្អាតការស្វែងរក
              </button>
            ) : canCreate ? (
              <button
                onClick={handleAddNew}
                className="ripple-effect inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 hover:from-blue-700 hover:via-cyan-700 hover:to-teal-700 text-white rounded-xl font-black  transform hover:scale-105 transition-all"
              >
                <Plus className="h-5 w-5 mr-2" strokeWidth={3} />
                បង្កើតអតិថិជនថ្មី
              </button>
            ) : null}
          </div>
        ) : (
          <div className="bg-white/90 backdrop-blur-2xl rounded-2xl  overflow-hidden border-2 border-cyan-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-cyan-200">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-100 via-blue-100 to-indigo-100">
                    <th className="px-6 py-5 text-left text-xs font-black text-cyan-900 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-cyan-900 uppercase tracking-wider">
                      អតិថិជន
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-cyan-900 uppercase tracking-wider">
                      <Phone className="inline h-3.5 w-3.5 mr-1" />
                      លេខទូរស័ព្ទ
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-cyan-900 uppercase tracking-wider">
                      <MapPin className="inline h-3.5 w-3.5 mr-1" />
                      អាសយដ្ឋាន
                    </th>
                    <th className="px-6 py-5 text-left text-xs font-black text-cyan-900 uppercase tracking-wider">
                      <Calendar className="inline h-3.5 w-3.5 mr-1" />
                      បង្កើត
                    </th>
                    <th className="px-6 py-5 text-right text-xs font-black text-cyan-900 uppercase tracking-wider">
                      សកម្មភាព
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-cyan-100">
                  {paginatedCustomers.map((customer, index) => (
                    <tr
                      key={customer.id}
                      className={`customer-card hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all fade-in ${
                        index % 2 === 0 ? "bg-white" : "bg-cyan-50/30"
                      }`}
                      style={{ animationDelay: `${index * 0.03}s` }}
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1.5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-xs font-black rounded-lg shadow-md font-mono">
                          #{customer.id}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-10 w-10 rounded-xl bg-gradient-to-br ${getAvatarColor(customer.name)} flex items-center justify-center flex-shrink-0 shadow-lg transform hover:scale-110 transition-transform`}
                          >
                            <span className="text-white font-black text-lg">
                              {customer.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-black text-gray-900">
                              {customer.name || "—"}
                            </div>
                            <div className="text-xs text-gray-500 font-semibold">
                              អតិថិជន #{customer.id}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {customer.phone ? (
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-purple-100 to-violet-100 rounded-lg flex items-center justify-center">
                              <Phone className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="text-sm font-bold text-gray-700 font-mono">
                              {customer.phone}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 font-semibold">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 max-w-xs">
                        {customer.address ? (
                          <div className="flex items-start gap-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-rose-100 to-pink-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                              <MapPin className="h-4 w-4 text-rose-600" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 line-clamp-2">
                              {customer.address}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 font-semibold">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        {customer.created_at ? (
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-lg flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-emerald-600" />
                            </div>
                            <span className="text-sm font-bold text-gray-700">
                              {new Date(customer.created_at).toLocaleDateString(
                                "km-KH",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400 font-semibold">
                            —
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          {canEdit && (
                            <button
                              onClick={() => handleEdit(customer)}
                              className="ripple-effect p-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 rounded-xl transition-all transform hover:scale-110 shadow-md hover:shadow-lg"
                              aria-label={`Edit ${customer.name}`}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                          )}
                          {canDelete && (
                            <button
                              onClick={() => handleDelete(customer.id)}
                              disabled={deleting === customer.id}
                              className="ripple-effect p-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 rounded-xl transition-all transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                              aria-label={`Delete ${customer.name}`}
                            >
                              {deleting === customer.id ? (
                                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
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
              <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between border-t-2 border-cyan-200 bg-gradient-to-r from-cyan-50 to-blue-50 gap-4">
                <div className="text-sm font-bold text-gray-700">
                  បង្ហាញ{" "}
                  <span className="text-cyan-600">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                  </span>{" "}
                  នៃ <span className="text-cyan-600">{totalItems}</span> អតិថិជន
                </div>

                <nav
                  className="flex items-center gap-2 flex-wrap justify-center"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border-2 border-cyan-300 rounded-lg text-sm font-bold text-cyan-600 bg-white hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    « ដើម
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border-2 border-cyan-300 rounded-lg text-sm font-bold text-cyan-600 bg-white hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    មុន
                  </button>

                  {renderPageButtons().map((p, idx) =>
                    p === "..." ? (
                      <span
                        key={`dots-${idx}`}
                        className="px-2 text-cyan-400 font-black"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all transform hover:scale-110 ${
                          currentPage === p
                            ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg border-2 border-cyan-400"
                            : "border-2 border-cyan-300 bg-white text-cyan-600 hover:bg-cyan-50"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border-2 border-cyan-300 rounded-lg text-sm font-bold text-cyan-600 bg-white hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    បន្ទាប់
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border-2 border-cyan-300 rounded-lg text-sm font-bold text-cyan-600 bg-white hover:bg-cyan-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ចុង »
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      <CustomerForm
        isOpen={showForm}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        customerId={editingCustomerId}
      />
    </div>
  );
};

export default CustomerList;
