// src/components/notifications/NotificationDropdown.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  CheckCheck,
  AlertCircle,
  Package,
  ShoppingCart,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { formatDistanceToNow } from "../../utils/dateUtils";
import { useNavigate } from "react-router-dom";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const {
    notifications,
    unreadCount,
    loading,
    markAsRead,
    markAllAsRead,
    loadNotifications,
  } = useNotifications();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadNotifications({ limit: 10 });
    }
  }, [isOpen]);

  const handleNotificationClick = async (notification) => {
    if (!notification.is_read) {
      await markAsRead(notification.id);
    }
    setIsOpen(false);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleViewAll = () => {
    setIsOpen(false);
    navigate("/notifications");
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "low_stock":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "out_of_stock":
        return <Package className="h-4 w-4 text-red-500" />;
      case "sale_new":
        return <ShoppingCart className="h-4 w-4 text-green-500" />;
      case "purchase_new":
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case "expiring_soon":
        return <Calendar className="h-4 w-4 text-orange-500" />;
      case "expiring_today":
        return <Calendar className="h-4 w-4 text-red-600" />;
      case "expired":
        return <Calendar className="h-4 w-4 text-red-700" />;
      default:
        return <Bell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatNotificationTime = (createdAt) => {
    try {
      return formatDistanceToNow(new Date(createdAt), { addSuffix: true });
    } catch (error) {
      return "ថ្មីៗនេះ";
    }
  };

  // ✅ FIXED: Get expiration info from notification.data.expire_date first
  const getExpirationInfo = (notification) => {
    // Check data.expire_date first, then fallback to Product.expire_date
    const expireDate =
      notification.data?.expire_date || notification.Product?.expire_date;

    if (!expireDate) return null;

    const expiration = new Date(expireDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiration.setHours(0, 0, 0, 0);

    const diffTime = expiration - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // ✅ Don't show if more than 7 days
    if (diffDays > 7) return null;

    let statusClass = "";
    let statusText = "";

    if (diffDays < 0) {
      statusClass = "bg-red-100 text-red-800";
      statusText = "ផុតកំណត់";
    } else if (diffDays === 0) {
      statusClass = "bg-orange-100 text-orange-800";
      statusText = "ផុតថ្ងៃនេះ";
    } else if (diffDays <= 3) {
      statusClass = "bg-yellow-100 text-yellow-800";
      statusText = `${diffDays} ថ្ងៃ`;
    } else if (diffDays <= 7) {
      statusClass = "bg-blue-100 text-blue-800";
      statusText = `${diffDays} ថ្ងៃ`;
    }

    return {
      formatted: expiration.toLocaleDateString("km-KH"),
      statusClass,
      statusText,
      diffDays,
    };
  };

  // ✅ Filter notifications: Only show expiration notifications when <= 7 days
  const getFilteredNotifications = () => {
    return notifications
      .filter((notification) => {
        // For expiration-related notifications
        if (
          ["expiring_soon", "expiring_today", "expired"].includes(
            notification.type,
          )
        ) {
          const expirationInfo = getExpirationInfo(notification);
          // ✅ Only show if we have expiration info (means <= 7 days)
          return expirationInfo !== null;
        }

        // Show all other notification types
        return true;
      })
      .slice(0, 10);
  };

  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-black hover:bg-white/20 rounded-lg transition-colors"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
            {unreadCount > 20 ? "20+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">ការជូនដំណឹង</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">បានអានទាំងអស់</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-500">កំពុងផ្ទុក...</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">គ្មានការជូនដំណឹង</p>
                <p className="text-gray-400 text-xs mt-1">
                  អ្នកមិនមានសារថ្មីណាមួយទេ
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => {
                  const expirationInfo = getExpirationInfo(notification);

                  return (
                    <div
                      key={notification.id}
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                        !notification.is_read
                          ? "bg-blue-50 border-l-4 border-l-blue-500"
                          : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-medium text-gray-900 truncate">
                              {notification.title}
                            </h4>
                            {!notification.is_read && (
                              <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 ml-2"></div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>

                          {/* ✅ Only shows when <= 7 days */}
                          {expirationInfo && (
                            <div
                              className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${expirationInfo.statusClass}`}
                            >
                              <Calendar className="h-3 w-3" />
                              <span>{expirationInfo.statusText}</span>
                            </div>
                          )}

                          <p className="text-xs text-gray-400 mt-2">
                            {formatNotificationTime(notification.created_at)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          {filteredNotifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button
                onClick={handleViewAll}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                មើលការជូនដំណឹងទាំងអស់
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
