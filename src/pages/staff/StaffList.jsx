// src/pages/staff/StaffList.jsx
import React, { useState, useEffect, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  User,
  Phone,
  Calendar,
  Users,
  UserCheck,
  UserX,
  Briefcase,
  X,
  Filter,
  Shield,
} from "lucide-react";
import {
  fetchAllStaff,
  deleteStaff,
  toggleStaffStatus,
} from "../../api/staff.api";
import StaffForm from "./StaffForm";
import { SuperAdminOnly } from "../../utils/permissions";

const ITEMS_PER_PAGE = 10;

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleting, setDeleting] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    try {
      setLoading(true);
      const response = await fetchAllStaff();

      if (response.success && response.data) {
        setStaff(response.data);
      } else if (Array.isArray(response)) {
        setStaff(response);
      } else if (response.data && Array.isArray(response.data)) {
        setStaff(response.data);
      } else {
        setStaff([]);
      }
    } catch (error) {
      console.error("Error loading staff:", error);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter staff
  const filteredStaff = useMemo(() => {
    let filtered = staff;

    if (searchTerm) {
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.staff_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          s.phone?.includes(searchTerm),
      );
    }

    if (statusFilter !== "all") {
      const statusValue = statusFilter === "active" ? 1 : 0;
      filtered = filtered.filter((s) => s.status === statusValue);
    }

    return filtered;
  }, [staff, searchTerm, statusFilter]);

  // Calculate statistics
  const stats = useMemo(() => {
    const total = staff.length;
    const active = staff.filter((s) => s.status === 1).length;
    const inactive = staff.filter((s) => s.status === 0).length;

    return { total, active, inactive };
  }, [staff]);

  const handleEdit = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("តើអ្នកប្រាកដថាចង់លុបបុគ្គលិកនេះទេ?")) {
      return;
    }

    try {
      setDeleting(id);
      const response = await deleteStaff(id);
      if (response.success) {
        loadStaff();
      }
    } catch (error) {
      console.error("Error deleting staff:", error);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const response = await toggleStaffStatus(id);
      if (response.success) {
        loadStaff();
      }
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedStaff(null);
    loadStaff();
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  // Pagination
  const totalItems = filteredStaff.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const paginatedStaff = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredStaff.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredStaff, currentPage]);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("km-KH");
  };

  const getPhotoSrc = (photo) => {
    if (!photo || photo.trim() === "") return null;
    if (photo.startsWith("data:")) return photo;
    if (/^[A-Za-z0-9+/=]+$/.test(photo))
      return `data:image/jpeg;base64,${photo}`;
    if (photo.startsWith("http://") || photo.startsWith("https://"))
      return photo;
    return `data:image/jpeg;base64,${photo}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">បុគ្គលិក</h1>
              <p className="text-gray-600 text-sm">គ្រប់គ្រងបុគ្គលិកទាំងអស់</p>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-indigo-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">បុគ្គលិកសរុប</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.total}
                </p>
                <p className="text-xs text-gray-500 mt-1">ទាំងអស់</p>
              </div>
              <div className="h-12 w-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-green-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">សកម្ម</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.active}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.total > 0
                    ? ((stats.active / stats.total) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-5 border-l-4 border-red-500 transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">អសកម្ម</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.inactive}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {stats.total > 0
                    ? ((stats.inactive / stats.total) * 100).toFixed(1)
                    : 0}
                  %
                </p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="bg-white rounded-xl shadow-md p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              ស្វែងរក និង តម្រង
            </h3>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ស្វែងរកតាមឈ្មោះ, លេខកូដ, ទូរស័ព្ទ..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all hover:border-indigo-300"
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
            </div>

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="md:w-48 px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white transition-all hover:border-indigo-300"
            >
              <option value="all">ទាំងអស់</option>
              <option value="active">សកម្ម</option>
              <option value="inactive">អសកម្ម</option>
            </select>

            <SuperAdminOnly fallback={null}>
              <button
                onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                បន្ថែមបុគ្គលិក
              </button>
            </SuperAdminOnly>
          </div>

          {(searchTerm || statusFilter !== "all") && (
            <div className="mt-4 text-sm text-gray-600">
              រកឃើញ{" "}
              <span className="font-semibold text-indigo-600">
                {filteredStaff.length}
              </span>{" "}
              លទ្ធផល
            </div>
          )}
        </div>

        {/* Staff List */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-500 border-t-transparent"></div>
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
              {searchTerm || statusFilter !== "all"
                ? "មិនមានលទ្ធផលស្វែងរក"
                : "មិនមានបុគ្គលិក"}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all"
                ? "សូមព្យាយាមស្វែងរកជាមួយពាក្យគន្លឹះផ្សេង"
                : "សូមបន្ថែមបុគ្គលិកថ្មី"}
            </p>
            {searchTerm || statusFilter !== "all" ? (
              <button
                onClick={handleClearSearch}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg transition-all"
              >
                សម្អាតការស្វែងរក
              </button>
            ) : (
              <SuperAdminOnly fallback={null}>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-medium shadow-lg transition-all"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  បន្ថែមបុគ្គលិកថ្មី
                </button>
              </SuperAdminOnly>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      បុគ្គលិក
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      តួនាទី
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ទូរស័ព្ទ
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ថ្ងៃខែឆ្នាំកំណើត
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      ភេទ
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
                  {paginatedStaff.map((staffMember, index) => {
                    const photoSrc = getPhotoSrc(staffMember.photo);

                    return (
                      <tr
                        key={staffMember.id}
                        className={`hover:bg-indigo-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            {photoSrc ? (
                              <img
                                src={photoSrc}
                                alt={staffMember.name}
                                className="h-12 w-12 rounded-full object-cover border-2 border-indigo-200 shadow-sm"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-sm"
                              style={{ display: photoSrc ? "none" : "flex" }}
                            >
                              <User className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="text-sm font-semibold text-gray-900">
                                {staffMember.name}
                              </div>
                              <div className="text-xs text-gray-500 flex items-center gap-1">
                                <Shield className="h-3 w-3" />
                                {staffMember.staff_id}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Briefcase className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {staffMember.Role?.name || "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Phone className="h-4 w-4 text-gray-400" />
                            {staffMember.phone}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatDate(staffMember.dob)}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 rounded-lg text-sm font-medium">
                            {staffMember.gender}
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <button
                            onClick={() => handleToggleStatus(staffMember.id)}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold shadow-sm transition-all hover:scale-105 ${
                              staffMember.status === 1
                                ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
                                : "bg-gradient-to-r from-red-500 to-pink-500 text-white"
                            }`}
                          >
                            {staffMember.status === 1 ? (
                              <>
                                <UserCheck className="h-3 w-3 mr-1" />
                                សកម្ម
                              </>
                            ) : (
                              <>
                                <UserX className="h-3 w-3 mr-1" />
                                អសកម្ម
                              </>
                            )}
                          </button>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <SuperAdminOnly
                            fallback={
                              <span className="text-gray-400 text-xs">
                                គ្មានសិទ្ធិ
                              </span>
                            }
                          >
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleEdit(staffMember)}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-all transform hover:scale-110"
                                title="កែប្រែ"
                              >
                                <Edit className="h-5 w-5" />
                              </button>
                              <button
                                onClick={() => handleDelete(staffMember.id)}
                                disabled={deleting === staffMember.id}
                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-all transform hover:scale-110 disabled:opacity-50"
                                title="លុប"
                              >
                                {deleting === staffMember.id ? (
                                  <div className="h-5 w-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <Trash2 className="h-5 w-5" />
                                )}
                              </button>
                            </div>
                          </SuperAdminOnly>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between border-t bg-gradient-to-r from-gray-50 to-gray-100 gap-3">
                <div className="text-sm text-gray-700 font-medium">
                  បង្ហាញ{" "}
                  <span className="font-bold text-indigo-600">
                    {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)}
                  </span>{" "}
                  នៃ{" "}
                  <span className="font-bold text-indigo-600">
                    {totalItems}
                  </span>{" "}
                  បុគ្គលិក
                </div>

                <nav className="flex items-center gap-1 flex-wrap justify-center">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    « ដើម
                  </button>

                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-indigo-600 shadow-lg"
                            : "border-gray-300 bg-white text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600"
                        }`}
                      >
                        {p}
                      </button>
                    ),
                  )}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    បន្ទាប់
                  </button>

                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ចុង »
                  </button>
                </nav>
              </div>
            )}
          </div>
        )}

        {showForm && (
          <StaffForm staff={selectedStaff} onClose={handleFormClose} />
        )}
      </div>
    </div>
  );
};

export default StaffList;
