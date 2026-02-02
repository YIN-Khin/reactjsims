// src/components/layout/Sidebar.jsx
import React, { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  X,
  LayoutDashboard,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
  User,
  Shield,
  Settings,
  BarChart3,
  Tag,
  Award,
  ChevronDown,
  ChevronRight,
  Store,
  IdCard,
  Bell,
  LogOut,
} from "lucide-react";
import { AdminOnly } from "../../utils/permissions";
import { useNotifications } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext";

// Debug import for testing
// import { debugUserPermissions, forceAdminRole } from "../../utils/permissions";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProductMenuOpen, setIsProductMenuOpen] = useState(false);
  const [isReportMenuOpen, setIsReportMenuOpen] = useState(false);
  const [isInventoryMenuOpen, setIsInventoryMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  // Get notification context for unread count
  const notificationContext = useNotifications();
  const unreadCount = notificationContext?.unreadCount || 0;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  // Check if current path is in product menu
  const isProductMenuActive =
    location.pathname.startsWith("/products") ||
    location.pathname.startsWith("/categories") ||
    location.pathname.startsWith("/brands");

  // Check if current path is in report menu
  const isReportMenuActive = location.pathname.startsWith("/reports");
  // Check if current path is in inventory menu
  const isInventoryMenuActive =
    location.pathname.startsWith("/purchases") ||
    location.pathname.startsWith("/sales") ||
    location.pathname.startsWith("/payments");
  location.pathname.startsWith("/suppliers");
  // Auto-open product menu if on product-related page
  React.useEffect(() => {
    if (isProductMenuActive) {
      setIsProductMenuOpen(true);
    }
  }, [isProductMenuActive]);

  // Auto-open report menu if on report-related page
  React.useEffect(() => {
    if (isReportMenuActive) {
      setIsReportMenuOpen(true);
    }
  }, [isReportMenuActive]);

  React.useEffect(() => {
    if (isInventoryMenuActive) {
      setIsInventoryMenuOpen(true);
    }
  }, [isInventoryMenuActive]);
  const menuItems = [
    {
      path: "/dashboard",
      label: "Dashboard", // Dashboard in Khmer
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      type: "dropdown",
      label: "Inventory", // Products in Khmer
      icon: <Package className="h-5 w-5" />,
      isOpen: isProductMenuOpen,
      toggle: () => setIsProductMenuOpen(!isProductMenuOpen),
      children: [
        {
          path: "/products",
          label: "Products", // Products
          icon: <Package className="h-4 w-4" />,
        },
        {
          path: "/categories",
          label: "Categories", // Categories
          icon: <Tag className="h-4 w-4" />,
        },
        {
          path: "/brands",
          label: "Brands", // Brands
          icon: <Award className="h-4 w-4" />,
        },
      ],
    },

    {
      path: "/customers",
      label: "Customers", // Customers in Khmer
      icon: <Users className="h-5 w-5" />,
    },

    {
      type: "dropdown",
      label: "Operation", // Inventory in Khmer
      adminOnly: true,
      icon: <TrendingUp className="h-5 w-5" />,
      isOpen: isInventoryMenuOpen,
      toggle: () => setIsInventoryMenuOpen(!isInventoryMenuOpen),
      children: [
        {
          path: "/suppliers",
          label: "Suppliers", // Suppliers
          icon: <Store className="h-5 w-5" />,
        },
        {
          path: "/purchases",
          label: "Purchases", // Purchases
          icon: <TrendingUp className="h-5 w-5" />,
          adminOnly: true,
        },
        {
          path: "/sales",
          label: "Sales", // Sales
          icon: <ShoppingCart className="h-5 w-5" />,
          adminOnly: true,
        },
        {
          path: "/payments",
          label: "Payments", // Payments
          icon: <IdCard className="h-5 w-5" />,
          adminOnly: true,
        },
      ],
    },

    {
      // adminOnly: true,
      type: "dropdown",
      label: "Reports", // Reports in Khmer
      adminOnly: true,
      icon: <BarChart3 className="h-5 w-5" />,
      isOpen: isReportMenuOpen,
      toggle: () => setIsReportMenuOpen(!isReportMenuOpen),

      children: [
        {
          path: "/sells/reports",
          label: "Sale Report", // Sales Report
          icon: <ShoppingCart className="h-4 w-4" />,
          adminOnly: true,
        },
        {
          adminOnly: true,
          path: "/reports/imports",
          label: "Import Report", // Import Report
          icon: <TrendingUp className="h-4 w-4" />,
        },
        {
          adminOnly: true,
          path: "/reports/profit",
          label: "Profit Report", // Profit Report
          icon: <BarChart3 className="h-4 w-4" />,
        },
      ],
    },
    // {
    //   path: "/sells/reports",
    //   label: "Sale Report", // Sales Report
    //   icon: <ShoppingCart className="h-4 w-4" />,
    //   // adminOnly: true,
    // },
    {
      adminOnly: true,
      path: "/staff",
      label: "Staff", // Staff in Khmer
      icon: <Users className="h-5 w-5" />,
    },
    {
      path: "/roles",
      label: "Roles", // Roles in Khmer
      icon: <Shield className="h-5 w-5" />,
      adminOnly: true,
    },

    {
      adminOnly: true,
      path: "/users",
      label: "Users", // Users in Khmer
      icon: <User className="h-5 w-5" />,
    },
    {
      path: "/notifications",
      label: "Notifications", // Notifications in Khmer
      icon: <Bell className="h-5 w-5" />,
      badge: unreadCount > 0 ? unreadCount : null, // Show unread count as badge
    },
    {
      path: "/settings",
      label: "Settings", // Settings in Khmer
      icon: <Settings className="h-5 w-5" />,
      // adminOnly: true, // Make settings admin-only for consistency
    },
  ];

  const getPhotoUrl = () => {
    if (!user?.photo || user.photo.trim() === "") return null;
    const photo = user.photo.trim();

    if (photo.startsWith("data:")) return photo;

    if (
      photo.match(/^[A-Za-z0-9+/=]+$/) ||
      photo.includes("/9j/") ||
      photo.includes("iVBOR")
    ) {
      return `data:image/jpeg;base64,${photo}`;
    }

    if (photo.startsWith("http")) return photo;

    return null;
  };

  const photoUrl = getPhotoUrl();
  const initials = user?.name?.charAt(0)?.toUpperCase() || "?";

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="lg:hidden fixed top-20 left-4 z-40 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-lg"
        aria-label="Toggle sidebar"
      >
        <svg
          className="h-6 w-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-30"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 left-0 h-screen bg-white border-r shadow-lg border-gray-200 w-[260px] transform transition-transform duration-300 ease-in-out z-40 flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Close Button (Mobile Only) */}
        <button
          onClick={closeSidebar}
          className="lg:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-900 z-10"
          aria-label="Close sidebar"
        >
          <X size={24} />
        </button>

        {/* Logo Section */}
        <div className="p-3 border-b border-gray-200 flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-800 text-center">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-gray-50">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                {photoUrl ? (
                  <img
                    src={photoUrl}
                    alt={user?.name}
                    className="h-full w-full  object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  initials
                )}
              </div>
              <div className="max-w-[120px]">
                <p className="text-[14px] font-semibold text-gray-900 truncate leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] w-[60px] text-white bg-orange-500 rounded-md  truncate leading-tight">
                  {user?.role || "Role"}
                </p>
              </div>
            </div>
          </h2>
        </div>

        {/* Navigation - Scrollable */}
        <nav className="flex-1 overflow-y-auto px-4 py-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => {
              // Check if item should be admin-only
              const renderMenuItem = () => {
                if (item.type === "dropdown") {
                  const hasActiveChild = item.children?.some(
                    (child) =>
                      location.pathname === child.path ||
                      location.pathname.startsWith(child.path + "/"),
                  );
                  return (
                    <li key={`dropdown-${index}`}>
                      <button
                        onClick={() => {
                          item.toggle();
                          closeSidebar();
                        }}
                        className={`
                          w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all
                          ${
                            hasActiveChild || item.isOpen
                              ? "bg-blue-500 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={
                              hasActiveChild || item.isOpen
                                ? "text-white"
                                : "text-gray-500"
                            }
                          >
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.isOpen ? (
                          <ChevronDown
                            className={`h-4 w-4 ${
                              hasActiveChild || item.isOpen
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          />
                        ) : (
                          <ChevronRight
                            className={`h-4 w-4 ${
                              hasActiveChild || item.isOpen
                                ? "text-white"
                                : "text-gray-500"
                            }`}
                          />
                        )}
                      </button>
                      {item.isOpen && item.children && (
                        <ul className="mt-1 ml-4 space-y-1 border-l-2 border-gray-200 pl-2">
                          {item.children.map((child) => {
                            const isChildActive =
                              location.pathname === child.path ||
                              location.pathname.startsWith(child.path + "/");
                            return (
                              <li key={child.path}>
                                <NavLink
                                  to={child.path}
                                  onClick={closeSidebar}
                                  className={`
                                    flex items-center space-x-2 px-3 py-2 rounded-lg transition-all text-sm
                                    ${
                                      isChildActive
                                        ? "bg-blue-50 text-blue-700 font-medium border-l-2 border-blue-600"
                                        : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"
                                    }
                                  `}
                                >
                                  <span
                                    className={
                                      isChildActive
                                        ? "text-blue-600"
                                        : "text-gray-400"
                                    }
                                  >
                                    {child.icon}
                                  </span>
                                  <span>{child.label}</span>
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                } else {
                  const isActive =
                    location.pathname === item.path ||
                    location.pathname.startsWith(item.path + "/");
                  return (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        onClick={closeSidebar}
                        className={`
                          flex items-center justify-between px-4 py-3 rounded-lg transition-all
                          ${
                            isActive
                              ? "bg-blue-500 text-white shadow-md"
                              : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                          }
                        `}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={
                              isActive ? "text-white" : "text-gray-500"
                            }
                          >
                            {item.icon}
                          </span>
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {/* Badge for notifications */}
                        {item.badge && (
                          <span
                            className={`
                            inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full min-w-[20px] h-5
                            ${
                              isActive
                                ? "bg-white text-blue-600"
                                : "bg-red-500 text-white"
                            }
                          `}
                          >
                            {item.badge > 20 ? "20+" : item.badge}
                          </span>
                        )}
                      </NavLink>
                    </li>
                  );
                }
              };

              // Wrap admin-only items with AdminOnly component
              if (item.adminOnly) {
                return (
                  <AdminOnly key={item.path || `dropdown-${index}`}>
                    {renderMenuItem()}
                  </AdminOnly>
                );
              }

              return renderMenuItem();
            })}
          </ul>
          <div className="flex-shrink-0 p-3 border-t border-gray-200">
            <div
              onClick={handleLogout}
              className="rounded-lg px-3 py-2 text-red-500
                   flex items-center gap-2 cursor-pointer hover:bg-indigo-100"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </div>
          </div>
        </nav>

        {/* Footer Section */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-xs text-gray-500 text-center">
            <p>Inventory Management</p>
            <p className="mt-1">Version 1.0.0</p>

            <div className="mt-2 space-y-1">
              <button
                // onClick={() => debugUserPermissions()}
                className="block w-full text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200"
                title="Debug Permissions"
              >
                Debug Permissions
              </button>
              <button
                // onClick={() => forceAdminRole()}
                className="block w-full text-xs bg-red-100 text-red-600 px-2 py-1 rounded hover:bg-red-200"
                title="Force Admin Role"
              >
                Force Admin Role
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
