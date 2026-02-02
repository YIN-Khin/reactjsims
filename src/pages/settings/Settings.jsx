// src/pages/settings/Settings.jsx
import { useState, useEffect } from "react";
import {
  Settings as SettingsIcon,
  Shield,
  Database,
  Bell,
  Palette,
  Save,
  RefreshCw,
  User,
  Upload,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  Camera,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { AdminOnly, hasPermission } from "../../utils/permissions";
import { getSettings, updateSettings } from "../../api/settings.api";
import { getUserById, updateUser } from "../../api/user.api";

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagePreview, setImagePreview] = useState("");

  // Profile state
  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    photo: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [settings, setSettings] = useState({
    siteName: "Inventory Management System",
    siteDescription: "ប្រព័ន្ធគ្រប់គ្រងស្តុក",
    language: "km",
    timezone: "Asia/Phnom_Penh",
    currency: "USD",
    autoBackup: true,
    backupFrequency: "daily",
    maxLoginAttempts: 5,
    sessionTimeout: 30,
    emailNotifications: true,
    systemAlerts: true,
    lowStockAlerts: true,
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    autoStockCheck: true,
    stockCheckInterval: 30,
    theme: "light",
    itemsPerPage: 10,
    dateFormat: "DD/MM/YYYY",
    numberFormat: "1,234.56",
  });

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await fetchProfile();
      } catch (err) {
        console.error("Initial load failed:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProfile = async () => {
    try {
      if (!user?.id) return;

      const response = await getUserById(user.id);
      if (response && (response.user || response.data)) {
        const userData = response.user || response.data;
        setProfileData({
          name: userData.name || "",
          username: userData.username || "",
          email: userData.email || "",
          phone: userData.phone || "",
          photo: userData.photo || "",
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        if (userData.photo) {
          setImagePreview(userData.photo);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("រូបភាពធំពេក។ សូមជ្រើសរើសរូបភាពតូចជាង 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setProfileData((prev) => ({
          ...prev,
          photo: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate password if changing
      if (profileData.newPassword) {
        if (profileData.newPassword.length < 6) {
          setError("ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 6 តួអក្សរ");
          setSaving(false);
          return;
        }
        if (profileData.newPassword !== profileData.confirmPassword) {
          setError("ពាក្យសម្ងាត់មិនត្រូវគ្នាទេ");
          setSaving(false);
          return;
        }
      }

      const updateData = {
        name: profileData.name,
        email: profileData.email,
        phone: profileData.phone,
        photo: profileData.photo,
      };

      if (profileData.newPassword) {
        updateData.password = profileData.newPassword;
      }

      const response = await updateUser(user.id, updateData);

      if (response && (response.success === true || response.user)) {
        setSuccess("បានរក្សាទុកព័ត៌មានផ្ទាល់ខ្លួនដោយជោគជ័យ");
        // Clear password fields
        setProfileData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setTimeout(() => setSuccess(null), 3500);
      } else {
        setError(response?.message || "មិនអាចរក្សាទុកបានទេ");
      }
    } catch (err) {
      console.error("Profile save error:", err);
      setError("មានបញ្ហាក្នុងការរក្សាទុក សូមព្យាយាមម្ដងទៀត");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-12 w-12 bg-gradient-to-br from-teal-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <SettingsIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">ការកំណត់</h1>
              <p className="text-gray-600 text-sm">
                គ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន និងការកំណត់ប្រព័ន្ធ
              </p>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-500" />
            <span className="text-green-700">{success}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600 font-medium">
                កំពុងទាញយកទិន្នន័យ...
              </p>
            </div>
          ) : (
            <div className="p-8">
              {/* Profile Photo Section */}
              <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-200">
                <div className="relative group">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Profile"
                      className="w-32 h-32 rounded-full object-cover border-4 border-teal-100 shadow-lg"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gradient-to-br from-teal-100 to-cyan-100 flex items-center justify-center border-4 border-teal-200 shadow-lg">
                      <User className="h-16 w-16 text-teal-600" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 h-10 w-10 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl transition-all transform hover:scale-110">
                    <Camera className="h-5 w-5 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-4">
                  រូបភាពត្រូវតែតូចជាង 5MB
                </p>
                <h2 className="text-2xl font-bold text-gray-900 mt-2">
                  {profileData.name || "អ្នកប្រើប្រាស់"}
                </h2>
                <p className="text-sm text-gray-600">@{profileData.username}</p>
              </div>

              {/* Profile Information */}
              <div className="space-y-6 mb-8">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <User className="h-5 w-5 text-teal-600" />
                  ព័ត៌មានផ្ទាល់ខ្លួន
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ឈ្មោះពេញ *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.name}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="បញ្ចូលឈ្មោះ"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ឈ្មោះអ្នកប្រើប្រាស់
                    </label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={profileData.username}
                        disabled
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      មិនអាចកែប្រែបានទេ
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      អ៊ីមែល
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }))
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="បញ្ចូលអ៊ីមែល"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      លេខទូរស័ព្ទ
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }))
                        }
                        className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="បញ្ចូលលេខទូរស័ព្ទ"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Password Section */}
              <div className="pt-8 border-t border-gray-200 space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Lock className="h-5 w-5 text-teal-600" />
                  ផ្លាស់ប្តូរពាក្យសម្ងាត់
                </h3>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    ទុកទទេប្រសិនបើអ្នកមិនចង់ផ្លាស់ប្តូរពាក្យសម្ងាត់។
                    ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 6 តួអក្សរ។
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ពាក្យសម្ងាត់ថ្មី
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showPassword ? "text" : "password"}
                        value={profileData.newPassword}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="បញ្ចូលពាក្យសម្ងាត់ថ្មី"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      >
                        {showPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      បញ្ជាក់ពាក្យសម្ងាត់
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={profileData.confirmPassword}
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            confirmPassword: e.target.value,
                          }))
                        }
                        className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition"
                        placeholder="បញ្ជាក់ពាក្យសម្ងាត់"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-4 pt-8 mt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={fetchProfile}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-2 font-medium"
                >
                  <RefreshCw className="h-5 w-5" />
                  កំណត់ឡើងវិញ
                </button>
                <button
                  onClick={handleProfileSave}
                  disabled={saving}
                  className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      កំពុងរក្សាទុក...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      រក្សាទុក
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Info Summary Card */}
        <div className="mt-6 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border border-teal-200">
          <h3 className="text-lg font-semibold text-teal-900 mb-4">
            សេចក្តីណែនាំ
          </h3>
          <ul className="space-y-2 text-sm text-teal-800">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>
                រូបភាពប្រវត្តិរូបដែលស្អាតនឹងជួយឱ្យគេមើលឃើញអ្នកកាន់តែច្បាស់
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>
                ពាក្យសម្ងាត់ខ្លាំងគួរតែមានអក្សរធំ អក្សរតូច លេខ និងសញ្ញាពិសេស
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-5 w-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <span>សូមកុំចែករំលែកពាក្យសម្ងាត់របស់អ្នកជាមួយនរណាម្នាក់ឡើយ</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
