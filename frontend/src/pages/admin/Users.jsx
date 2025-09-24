import { useEffect, useState } from "react";
import AdminLayout from "../../layouts/AdminLayout";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // 📌 ดึงข้อมูลผู้ใช้จาก backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 📌 อัปเดต role
  const updateRole = async (id, role, status) => {
    try {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ role, status }),
      });
      fetchUsers();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // 📌 สลับสถานะ active/inactive
  const toggleStatus = async (id, currentStatus, role) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    await updateRole(id, role, newStatus);
  };

  // 📌 ลบผู้ใช้
  const deleteUser = async (id) => {
    if (!window.confirm("คุณแน่ใจหรือไม่ว่าจะลบผู้ใช้นี้?")) return;
    try {
      await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchUsers();
    } catch (err) {
      console.error("Error:", err);
    }
  };

  // 📌 Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.first_name && user.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.last_name && user.last_name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === "all" || user.role === filterRole;
    const matchesStatus = filterStatus === "all" || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // 📌 Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "admin": return "bg-gradient-to-r from-red-500 to-pink-600 text-white";
      case "monk": return "bg-gradient-to-r from-orange-500 to-yellow-500 text-white";
      case "user": return "bg-gradient-to-r from-blue-500 to-blue-600 text-white";
      default: return "bg-gray-500 text-white";
    }
  };

  // 📌 Get status badge color
  const getStatusBadgeColor = (status) => {
    return status === "active" 
      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white"
      : "bg-gradient-to-r from-gray-500 to-gray-600 text-white";
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        {/* Header Section */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-3 rounded-xl">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                  จัดการผู้ใช้งาน
                </h1>
                <p className="text-gray-600 mt-1">ดูรายชื่อผู้ใช้งาน และปรับสิทธิ์การใช้งาน</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-500 to-yellow-500 p-4 rounded-xl text-white text-center shadow-lg">
              <div className="text-2xl font-bold">{users.length}</div>
              <div className="text-sm opacity-90">ผู้ใช้ทั้งหมด</div>
            </div>
          </div>
        </div>

        {/* Controls Section */}
        <div className="bg-white shadow-xl rounded-2xl mb-8 p-6 border border-orange-100">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <input
                  type="text"
                  placeholder="ค้นหาผู้ใช้งาน..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                />
                <svg className="w-5 h-5 text-orange-400 absolute left-3 top-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Filters */}
              <div className="flex gap-3">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="px-4 py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">ทุกสิทธิ์</option>
                  <option value="admin">Admin</option>
                  <option value="monk">Monk</option>
                  <option value="user">User</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 border border-orange-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                >
                  <option value="all">ทุกสถานะ</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Add User Button */}
            <button
              onClick={() => alert("เพิ่มผู้ใช้ใหม่!")}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-3 rounded-xl transition-all duration-200 hover:shadow-lg flex items-center space-x-2 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>เพิ่มผู้ใช้งาน</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-orange-100">
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 border-b border-orange-200">
            <h3 className="text-xl font-semibold text-orange-800 flex items-center">
              <svg className="w-6 h-6 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              รายชื่อผู้ใช้งาน ({filteredUsers.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <svg className="animate-spin w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                  <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"></path>
                </svg>
                <span className="ml-2 text-gray-600">กำลังโหลด...</span>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">ข้อมูลผู้ใช้</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">สิทธิ์</th>
                    <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider">สถานะ</th>
                    <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-orange-50 transition-colors duration-200">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-400 to-yellow-500 rounded-full text-white font-bold">
                            {user.id}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-12 w-12">
                              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-orange-400 to-yellow-500 flex items-center justify-center text-white font-semibold text-lg">
                                {(user.first_name?.[0] || user.email[0]).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.first_name && user.last_name 
                                  ? `${user.first_name} ${user.last_name}`
                                  : user.email.split('@')[0]
                                }
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={user.role}
                            onChange={(e) => updateRole(user.id, e.target.value, user.status)}
                            className={`px-3 py-2 rounded-lg text-sm font-medium border-0 ${getRoleBadgeColor(user.role)} cursor-pointer transition-all duration-200 hover:shadow-md`}
                          >
                            <option value="user">User</option>
                            <option value="monk">Monk</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(user.status)}`}>
                            <span className={`w-2 h-2 rounded-full mr-2 ${user.status === 'active' ? 'bg-white' : 'bg-gray-300'}`}></span>
                            {user.status === 'active' ? 'ใช้งานได้' : 'ปิดการใช้งาน'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <button
                              onClick={() => toggleStatus(user.id, user.status, user.role)}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center space-x-1 ${
                                user.status === 'active' 
                                  ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white'
                                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              <span>{user.status === 'active' ? 'ปิด' : 'เปิด'}</span>
                            </button>
                            
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md flex items-center space-x-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              <span>ลบ</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center">
                          <svg className="w-16 h-16 text-orange-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                          </svg>
                          <p className="text-orange-600 text-lg font-medium">ไม่พบผู้ใช้งาน</p>
                          <p className="text-orange-500 text-sm mt-1">
                            {searchTerm || filterRole !== 'all' || filterStatus !== 'all' 
                              ? 'ลองเปลี่ยนเงื่อนไขการค้นหา' 
                              : 'เริ่มต้นโดยการเพิ่มผู้ใช้งานใหม่'
                            }
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}