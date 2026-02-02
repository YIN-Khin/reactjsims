// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate, Link } from 'react-router-dom';
// import { fetchSupplierById, createSupplier, updateSupplier } from '../../api/supplier.api';
// import { ArrowLeft, Save } from 'lucide-react';

// const SupplierForm = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     name: '',
//     phone_first: '',
//     phone_second: '',
//     address: ''
//   });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [isEditing, setIsEditing] = useState(false);

//   useEffect(() => {
//     if (id) {
//       loadSupplier();
//     }
//   }, [id]);

//   const loadSupplier = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchSupplierById(id);
//       setFormData(data);
//       setIsEditing(true);
//     } catch (err) {
//       setError('Failed to load supplier. Please try again.');
//       console.error('Error loading supplier:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);

//     try {
//       if (isEditing) {
//         await updateSupplier(id, formData);
//       } else {
//         await createSupplier(formData);
//       }
//       navigate('/suppliers');
//     } catch (err) {
//       setError('Failed to save supplier. Please try again.');
//       console.error('Error saving supplier:', err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading && isEditing) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">
//           {isEditing ? 'Edit Supplier' : 'Add New Supplier'}
//         </h1>
//         <Link
//           to="/suppliers"
//           className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
//         >
//           <ArrowLeft size={18} />
//           Back to Suppliers
//         </Link>
//       </div>

//       {error && (
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
//           {error}
//         </div>
//       )}

//       <div className="bg-white rounded-lg shadow p-6">
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Name *
//             </label>
//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter supplier name"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone Number 1
//             </label>
//             <input
//               type="text"
//               name="phone_first"
//               value={formData.phone_first}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter first phone number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phone Number 2
//             </label>
//             <input
//               type="text"
//               name="phone_second"
//               value={formData.phone_second}
//               onChange={handleChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter second phone number"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Address
//             </label>
//             <textarea
//               name="address"
//               value={formData.address}
//               onChange={handleChange}
//               rows="3"
//               className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter supplier address"
//             ></textarea>
//           </div>

//           <div className="flex gap-3 pt-4">
//             <button
//               type="submit"
//               disabled={loading}
//               className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
//             >
//               <Save size={18} />
//               {loading ? 'Saving...' : (isEditing ? 'Update Supplier' : 'Create Supplier')}
//             </button>
//             <Link
//               to="/suppliers"
//               className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//             >
//               Cancel
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default SupplierForm;

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  fetchSupplierById,
  createSupplier,
  updateSupplier,
} from "../../api/supplier.api";
import { ArrowLeft, Save } from "lucide-react";

const SupplierForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "", // ✅ added
    phone_first: "",
    phone_second: "",
    address: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (id) loadSupplier();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadSupplier = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await fetchSupplierById(id);

      // ✅ pick only fields we need (avoid createdAt/updatedAt etc.)
      setFormData({
        name: data?.name || "",
        email: data?.email || "",
        phone_first: data?.phone_first || "",
        phone_second: data?.phone_second || "",
        address: data?.address || "",
      });

      setIsEditing(true);
    } catch (err) {
      setError("Failed to load supplier. Please try again.");
      console.error("Error loading supplier:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ basic validation
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone_first: formData.phone_first.trim() || null,
        phone_second: formData.phone_second.trim() || null,
        address: formData.address.trim() || null,
      };

      if (isEditing) {
        await updateSupplier(id, payload);
      } else {
        await createSupplier(payload);
      }

      navigate("/suppliers");
    } catch (err) {
      setError("Failed to save supplier. Please try again.");
      console.error("Error saving supplier:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          {isEditing ? "Edit Supplier" : "Add New Supplier"}
        </h1>

        <Link
          to="/suppliers"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft size={18} />
          Back to Suppliers
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter supplier name"
            />
          </div>

          {/* ✅ Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email (for alerts)
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="example@gmail.com"
            />
            <p className="text-xs text-gray-500 mt-1">
              បើចង់ផ្ញើ Email alert (outstock/expire) ត្រូវបំពេញ Email
            </p>
          </div>

          {/* Phone 1 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number 1
            </label>
            <input
              type="text"
              name="phone_first"
              value={formData.phone_first}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter first phone number"
            />
          </div>

          {/* Phone 2 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number 2
            </label>
            <input
              type="text"
              name="phone_second"
              value={formData.phone_second}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter second phone number"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter supplier address"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} />
              {loading
                ? "Saving..."
                : isEditing
                ? "Update Supplier"
                : "Create Supplier"}
            </button>

            <Link
              to="/suppliers"
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplierForm;
