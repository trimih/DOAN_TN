"use client"
import { useEffect, useState } from "react";
import DashboardChart from "./bieudo/page";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Home() {
  const [revenueData, setRevenueData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [customerData, setCustomerData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/sanpham")
      .then((res) => res.json())
      .then((data) => setRevenueData(data));
    fetch("http://localhost:3000/orders")
      .then((res) => res.json())
      .then((data) => setOrderData(data));
    fetch("http://localhost:3000/user")
      .then((res) => res.json())
      .then((data) => setCustomerData(data));
  }, []);

  const totalRevenue = orderData.reduce((acc, item) => acc + item.totalAmount, 0);
  const totalquality = revenueData.reduce((acc, item) => acc + item.quantity, 0);
  const totalOrders = orderData.length;
  const totalUsers = customerData.length;
  const totalproduct = revenueData.length;
  return (
    <>
      <div className="content">
        <h1 style={{marginBottom:'15px'}}>Thống Kê</h1>
        <div className="stats">
          <div className="card">
            <h3>Số Lượng</h3>
            <p>{totalquality}</p>
          </div>
          <div className="card">
            <h3>Mặt Hàng</h3>
            <p>{totalproduct}</p>
          </div>
          <div className="card">
            <h3>Đơn Hàng</h3>
            <p>{totalOrders}</p>
          </div>
          <div className="card">
            <h3>Doanh Thu</h3>
            <p>{totalRevenue.toLocaleString('vi-VN')} VNĐ</p>
          </div>
          <div className="card">
            <h3>Tài Khoản</h3>
            <p>{totalUsers}</p>
          </div>
        </div>

        {/* Hiển thị biểu đồ thống kê */}
        <DashboardChart 
          revenueData={revenueData} 
          orderData={orderData} 
          customerData={customerData} 
        />

        <div className="recentActivity">
          <h2>Recent Activity</h2>
          <table>
            <thead>
              <tr>
                <th>Activity</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>New Customer Signup</td>
                <td>Oct 28, 2024</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>New Order Received</td>
                <td>Oct 27, 2024</td>
                <td>Completed</td>
              </tr>
              <tr>
                <td>Product Added</td>
                <td>Oct 26, 2024</td>
                <td>Pending</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
