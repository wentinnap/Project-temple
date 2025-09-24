import React, { useState, useEffect } from 'react';
import { 
  Users, 
  FileText, 
  Calendar, 
  MessageSquare, 
  TrendingUp, 
  Activity, 
  Clock,
  Bell,
  Settings,
  BarChart3,
  PieChart,
  Eye,
  UserPlus,
  BookOpen,
  Heart,
  Phone,
  Mail
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalNews: 0
  });
  
  const [recentActivities, setRecentActivities] = useState([]);
  const [quickStats, setQuickStats] = useState({
    onlineUsers: 0,
    todayBookings: 0,
    monthlyNews: 0
  });

  // Add missing loading state
  const [loading, setLoading] = useState(true);
  
  // Chart data states
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [activityDistributionData, setActivityDistributionData] = useState([]);

  // คำนวณสถิติเพิ่มเติม
  const calculateQuickStats = (bookings, news) => {
    const today = new Date().toDateString();
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();

    const todayBookings = bookings.filter(booking => 
      new Date(booking.created_at).toDateString() === today
    ).length;

    const monthlyNews = news.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate.getMonth() === thisMonth && itemDate.getFullYear() === thisYear;
    }).length;

    setQuickStats({
      onlineUsers: Math.floor(Math.random() * 30) + 10, // Mock data for online users
      todayBookings,
      monthlyNews
    });
  };

  // ดึงข้อมูลจาก Backend
  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // ดึงข้อมูลผู้ใช้
      const usersRes = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const users = await usersRes.json();

      // ดึงข้อมูลการจอง
      const bookingsRes = await fetch('http://localhost:5000/api/bookings');
      const bookings = await bookingsRes.json();

      // ดึงข้อมูลข่าวสาร
      const newsRes = await fetch('http://localhost:5000/api/news', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const news = await newsRes.json();

      setStats({
        totalUsers: users.length || 0,
        totalBookings: bookings.length || 0,
        totalNews: news.length || 0
      });

      // สร้าง Recent Activities จากข้อมูลจริง
      const activities = [];
      
      // เพิ่มกิจกรรมจากการจองล่าสุด
      if (bookings.length > 0) {
        const latestBooking = bookings[0];
        activities.push({
          id: `booking_${latestBooking.id}`,
          type: 'booking',
          message: `การจองพิธีใหม่: ${latestBooking.ceremony} จาก ${latestBooking.full_name}`,
          time: new Date(latestBooking.created_at).toLocaleString('th-TH'),
          status: latestBooking.status
        });
      }

      // เพิ่มกิจกรรมจากผู้ใช้ล่าสุด
      if (users.length > 0) {
        const latestUser = users[0];
        activities.push({
          id: `user_${latestUser.id}`,
          type: 'user',
          message: `ผู้ใช้ใหม่ลงทะเบียน: ${latestUser.email}`,
          time: new Date(latestUser.created_at).toLocaleString('th-TH'),
          status: 'new'
        });
      }

      // เพิ่มกิจกรรมจากข่าวล่าสุด
      if (news.length > 0) {
        const latestNews = news[0];
        activities.push({
          id: `news_${latestNews.id}`,
          type: 'news',
          message: `ข่าวใหม่ถูกเผยแพร่: "${latestNews.title}"`,
          time: new Date(latestNews.date).toLocaleString('th-TH'),
          status: 'published'
        });
      }

      setRecentActivities(activities);
      
      // คำนวณสถิติด่วน
      calculateQuickStats(bookings, news);
      
    } catch (error) {
      console.error('Error fetching stats:', error);
      // ใช้ข้อมูล fallback หากเกิดข้อผิดพลาด
      setStats({
        totalUsers: 0,
        totalBookings: 0,
        totalNews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Add missing handleRefresh function
  const handleRefresh = () => {
    fetchStats();
  };

  // Add useEffect to call fetchStats on component mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Navigate functions (สำหรับปุ่มการดำเนินการด่วน)
  const navigateToNews = () => {
    // ใน React Router จะใช้ navigate('/admin/news')
    window.location.href = '/admin/news';
  };

  const navigateToBookings = () => {
    // ใน React Router จะใช้ navigate('/admin/bookings')  
    window.location.href = '/admin/bookings';
  };

  const navigateToUsers = () => {
    // ใน React Router จะใช้ navigate('/admin/users')
    window.location.href = '/admin/users';
  };

  const StatCard = ({ title, value, change, icon: Icon, color, trend }) => (
    <div className="bg-white rounded-2xl p-6 shadow-xl border border-orange-100 hover:shadow-2xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className={`text-sm font-medium px-2 py-1 rounded-full ${
          trend === 'up' ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100'
        }`}>
          {change}
        </div>
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        <p className="text-gray-600 text-sm">{title}</p>
      </div>
    </div>
  );

  const ActivityItem = ({ activity }) => {
    const getActivityColor = (type) => {
      switch (type) {
        case 'booking': return 'bg-blue-100 text-blue-600';
        case 'user': return 'bg-green-100 text-green-600';
        case 'news': return 'bg-orange-100 text-orange-600';
        default: return 'bg-gray-100 text-gray-600';
      }
    };

    const getActivityIcon = (type) => {
      switch (type) {
        case 'booking': return Calendar;
        case 'user': return UserPlus;
        case 'news': return FileText;
        default: return Activity;
      }
    };

    const Icon = getActivityIcon(activity.type);

    return (
      <div className="flex items-start space-x-3 p-3 hover:bg-orange-50 rounded-lg transition-colors">
        <div className={`p-2 rounded-lg ${getActivityColor(activity.type)}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.message}</p>
          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-orange-600">กำลังโหลดข้อมูล...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-yellow-50 to-orange-100">
        {/* Header */}
        <div className="bg-white shadow-lg rounded-2xl mb-8 p-6 border border-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                แดชบอร์ดผู้ดูแลระบบ
              </h1>
              <p className="text-gray-600 mt-1">ภาพรวมการใช้งานระบบวัดกำแพง</p>
            </div>
            <div className="flex items-center space-x-3">
              <button 
                onClick={handleRefresh}
                className="relative p-3 bg-orange-100 hover:bg-orange-200 rounded-xl transition-colors"
                disabled={loading}
              >
                <Activity className={`w-5 h-5 text-orange-600 ${loading ? 'animate-spin' : ''}`} />
              </button>
              <button className="relative p-3 bg-orange-100 hover:bg-orange-200 rounded-xl transition-colors">
                <Bell className="w-5 h-5 text-orange-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-3 bg-orange-100 hover:bg-orange-200 rounded-xl transition-colors">
                <Settings className="w-5 h-5 text-orange-600" />
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="ผู้ใช้งานทั้งหมด"
            value={stats.totalUsers}
            change="+12%"
            icon={Users}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend="up"
          />
          <StatCard
            title="การจองพิธี"
            value={stats.totalBookings}
            change="+8%"
            icon={Calendar}
            color="bg-gradient-to-r from-green-500 to-green-600"
            trend="up"
          />
          <StatCard
            title="ข่าวสาร"
            value={stats.totalNews}
            change="+5%"
            icon={FileText}
            color="bg-gradient-to-r from-orange-500 to-yellow-500"
            trend="up"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Activities */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-xl border border-orange-100">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-orange-600" />
                กิจกรรมล่าสุด
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">ยังไม่มีกิจกรรมล่าสุด</p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <button className="text-orange-600 hover:text-orange-700 font-medium text-sm">
                  ดูกิจกรรมทั้งหมด →
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-orange-600" />
                สถิติด่วน
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ผู้ใช้งานออนไลน์</span>
                  <span className="text-green-600 font-semibold">{quickStats.onlineUsers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">การจองวันนี้</span>
                  <span className="text-blue-600 font-semibold">{quickStats.todayBookings}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">คำถามที่ยังไม่ตอบ</span>
                  <span className="text-red-600 font-semibold">-</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ข่าวสารเดือนนี้</span>
                  <span className="text-purple-600 font-semibold">{quickStats.monthlyNews}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">การดำเนินการด่วน</h3>
              <div className="space-y-3">
                <button 
                  onClick={navigateToNews}
                  className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <FileText size={20} />
                  <span>เพิ่มข่าวใหม่</span>
                </button>
                <button 
                  onClick={navigateToBookings}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Calendar size={20} />
                  <span>ดูการจองใหม่</span>
                </button>
                <button 
                  onClick={navigateToUsers}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-3 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                >
                  <Users size={20} />
                  <span>จัดการผู้ใช้</span>
                </button>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                สถานะระบบ
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">เซิร์ฟเวอร์</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 text-sm">ปกติ</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ฐานข้อมูล</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-600 text-sm">ปกติ</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">การสำรองข้อมูล</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-yellow-600 text-sm">กำลังทำงาน</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">การอัปเดต</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-blue-600 text-sm">ล่าสุด</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <BarChart3 className="w-5 h-5 mr-2 text-orange-600" />
              การเติบโตของผู้ใช้งาน
            </h3>
            <div className="h-64 space-y-4">
              {/* Simple Bar Chart with CSS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">มกราคม</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-4 rounded-full" style={{width: '70%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-blue-600">35</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">กุมภาพันธ์</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-4 rounded-full" style={{width: '85%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-green-600">42</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">มีนาคม</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div className="bg-gradient-to-r from-orange-500 to-yellow-500 h-4 rounded-full" style={{width: '92%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-orange-600">46</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">เมษายน</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-purple-600">39</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">พฤษภาคม</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div className="bg-gradient-to-r from-pink-500 to-pink-600 h-4 rounded-full" style={{width: '95%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-pink-600">48</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">มิถุนายน</span>
                  <div className="flex-1 mx-4">
                    <div className="bg-gray-200 rounded-full h-4">
                      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-4 rounded-full" style={{width: '100%'}}></div>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-indigo-600">{stats.totalUsers}</span>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full"></div>
                    <span className="text-gray-600">ผู้ใช้งานใหม่</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-green-600 font-semibold">+15% จากเดือนก่อน</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Distribution Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
              <PieChart className="w-5 h-5 mr-2 text-orange-600" />
              การกระจายของกิจกรรม
            </h3>
            <div className="h-64 flex items-center justify-center">
              {/* Simple Pie Chart representation */}
              <div className="relative w-48 h-48">
                {/* Pie Chart Segments */}
                <div className="absolute inset-0 rounded-full border-8 border-blue-500 border-r-green-500 border-b-orange-500 border-l-purple-500 animate-pulse"></div>
                <div className="absolute inset-4 rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800">{stats.totalBookings + stats.totalUsers + stats.totalNews}</div>
                    <div className="text-sm text-gray-600">กิจกรรมทั้งหมด</div>
                  </div>
                </div>
                
                {/* Activity indicators around the circle */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    การจอง {stats.totalBookings}
                  </div>
                </div>
                <div className="absolute top-1/2 -right-8 transform -translate-y-1/2">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ผู้ใช้ {stats.totalUsers}
                  </div>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    ข่าวสาร {stats.totalNews}
                  </div>
                </div>
                <div className="absolute top-1/2 -left-8 transform -translate-y-1/2">
                  <div className="bg-purple-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    อื่นๆ 5
                  </div>
                </div>
              </div>
            </div>
            
            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">การจองพิธี</span>
                <span className="text-sm font-semibold text-gray-800">({stats.totalBookings})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">ผู้ใช้งาน</span>
                <span className="text-sm font-semibold text-gray-800">({stats.totalUsers})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <span className="text-sm text-gray-600">ข่าวสาร</span>
                <span className="text-sm font-semibold text-gray-800">({stats.totalNews})</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                <span className="text-sm text-gray-600">กิจกรรมอื่นๆ</span>
                <span className="text-sm font-semibold text-gray-800">(5)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">ข้อมูลติดต่อวัด</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">02-XXX-XXXX</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-orange-600" />
                <span className="text-gray-700">info@watkampaeng.org</span>
              </div>
            </div>
          </div>

          {/* Recent Updates */}
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">อัปเดตล่าสุด</h3>
            <div className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">ระบบจัดการใหม่ v2.1</p>
                <p className="text-gray-600">เพิ่มฟีเจอร์การแจ้งเตือนและปรับปรุง UI</p>
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">การสำรองข้อมูลอัตโนมัติ</p>
                <p className="text-gray-600">ระบบสำรองข้อมูลทุกวันเวลา 02:00 น.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;