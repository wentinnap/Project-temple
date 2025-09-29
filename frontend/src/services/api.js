// services/api.js
import axios from 'axios';

// สร้าง instance ของ axios
const API = axios.create({
  baseURL: 'http://localhost:5000/api', // ⚠️ เปลี่ยน URL ตามของคุณ
  headers: {
    'Content-Type': 'application/json'
  }
});

// ⭐ Interceptor สำหรับส่ง token อัตโนมัติทุก request
API.interceptors.request.use(
  (config) => {
    // ดึง token จาก localStorage
    const token = localStorage.getItem('token');
    
    if (token) {
      // เพิ่ม Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ⭐ Interceptor สำหรับจัดการ error
API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // ถ้า token หมดอายุหรือไม่ถูกต้อง (401)
    if (error.response && error.response.status === 401) {
      // ลบ token เก่า
      localStorage.removeItem('token');
      
      // Redirect ไปหน้า login
      window.location.href = '/login';
      
      alert('Session หมดอายุ กรุณา Login ใหม่');
    }
    
    return Promise.reject(error);
  }
);

export default API;