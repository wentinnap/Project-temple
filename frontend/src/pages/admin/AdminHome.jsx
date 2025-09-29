import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  Activity,
  RefreshCw,
  Plus,
  Eye
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import API from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalNews: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data from API
  const fetchStats = async () => {
    setLoading(true);
    setError('');
    
    try {
      // Fetch all data in parallel
      const [usersRes, bookingsRes, newsRes] = await Promise.all([
        API.get('/admin/users').catch(() => ({ data: [] })),
        API.get('/bookings').catch(() => ({ data: [] })),
        API.get('/news').catch(() => ({ data: [] }))
      ]);

      setStats({
        totalUsers: Array.isArray(usersRes.data) ? usersRes.data.length : 0,
        totalBookings: Array.isArray(bookingsRes.data) ? bookingsRes.data.length : 0,
        totalNews: Array.isArray(newsRes.data) ? newsRes.data.length : 0
      });

    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('ไม่สามารถโหลดข้อมูลได้');
      setStats({ totalUsers: 0, totalBookings: 0, totalNews: 0 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // Navigate functions
  const navigateTo = (path) => {
    window.location.href = path;
  };

  const StatCard = ({ title, value, icon: Icon, color, onClick }) => (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl p-6 shadow-sm border hover:shadow-md transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <Eye className="w-4 h-4 text-gray-400" />
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin text-orange-500 mx-auto mb-4" />
            <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">แดชบอร์ด</h1>
              <p className="text-gray-600">ภาพรวมระบบจัดการวัด</p>
            </div>
            <button 
              onClick={fetchStats}
              disabled={loading}
              className="p-2 bg-orange-100 hover:bg-orange-200 rounded-lg transition-colors"
            >
              <RefreshCw className={`w-5 h-5 text-orange-600 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="ผู้ใช้งาน"
            value={stats.totalUsers}
            icon={Users}
            color="bg-blue-500"
            onClick={() => navigateTo('/admin/users')}
          />
          <StatCard
            title="การจองพิธี"
            value={stats.totalBookings}
            icon={Calendar}
            color="bg-green-500"
            onClick={() => navigateTo('/admin/bookings')}
          />
          <StatCard
            title="ข่าวสาร"
            value={stats.totalNews}
            icon={FileText}
            color="bg-orange-500"
            onClick={() => navigateTo('/admin/news')}
          />
        </div>

        {/* Chart Section */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">กราฟสถิติ</h2>
          
          {/* Bar Chart */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-20">ผู้ใช้งาน</span>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-1000 ease-out" 
                    style={{width: `${stats.totalUsers > 0 ? Math.min((stats.totalUsers / Math.max(stats.totalUsers, stats.totalBookings, stats.totalNews)) * 100, 100) : 0}%`}}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-bold text-blue-600 w-12 text-right">{stats.totalUsers}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-20">การจอง</span>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-6 rounded-full transition-all duration-1000 ease-out" 
                    style={{width: `${stats.totalBookings > 0 ? Math.min((stats.totalBookings / Math.max(stats.totalUsers, stats.totalBookings, stats.totalNews)) * 100, 100) : 0}%`}}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-bold text-green-600 w-12 text-right">{stats.totalBookings}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 w-20">ข่าวสาร</span>
              <div className="flex-1 mx-4">
                <div className="bg-gray-200 rounded-full h-6">
                  <div 
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-6 rounded-full transition-all duration-1000 ease-out" 
                    style={{width: `${stats.totalNews > 0 ? Math.min((stats.totalNews / Math.max(stats.totalUsers, stats.totalBookings, stats.totalNews)) * 100, 100) : 0}%`}}
                  ></div>
                </div>
              </div>
              <span className="text-sm font-bold text-orange-600 w-12 text-right">{stats.totalNews}</span>
            </div>
          </div>

          {/* Chart Summary */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="w-4 h-4 bg-blue-500 rounded-full mx-auto mb-2"></div>
                <div className="text-xs text-gray-600">ผู้ใช้งาน</div>
                <div className="text-sm font-semibold text-gray-900">{stats.totalUsers} คน</div>
              </div>
              <div>
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="text-xs text-gray-600">การจองพิธี</div>
                <div className="text-sm font-semibold text-gray-900">{stats.totalBookings} รายการ</div>
              </div>
              <div>
                <div className="w-4 h-4 bg-orange-500 rounded-full mx-auto mb-2"></div>
                <div className="text-xs text-gray-600">ข่าวสาร</div>
                <div className="text-sm font-semibold text-gray-900">{stats.totalNews} บทความ</div>
              </div>
            </div>
            
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.totalUsers + stats.totalBookings + stats.totalNews}
              </div>
              <div className="text-sm text-gray-600">ข้อมูลทั้งหมดในระบบ</div>
            </div>
          </div>
        </div>

        {/* Simple Activity Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-orange-600" />
            สรุปกิจกรรม
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">ผู้ใช้ทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{stats.totalBookings}</div>
              <div className="text-sm text-gray-600">การจองทั้งหมด</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.totalNews}</div>
              <div className="text-sm text-gray-600">ข่าวสารทั้งหมด</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;