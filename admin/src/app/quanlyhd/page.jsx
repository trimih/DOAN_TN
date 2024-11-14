'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // Thêm state cho thông báo
  const [selectedStatus, setSelectedStatus] = useState(''); // State cho trạng thái được chọn

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/orders");
        const result = await res.json();
        setData(result);
        setLoading(false);
        setMessage('Tải danh mục thành công!'); // Hiển thị thông báo khi tải dữ liệu thành công
        setTimeout(() => {
          setMessage(''); // Ẩn thông báo sau 3 giây
        }, 3000);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
        setMessage('Đã xảy ra lỗi khi tải dữ liệu!'); // Hiển thị thông báo lỗi
        setTimeout(() => {
          setMessage(''); // Ẩn thông báo sau 3 giây
        }, 3000);
      }
    };
    fetchData();
  }, []);

  // Hàm cập nhật trạng thái đơn hàng
  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`http://localhost:3000/orders/updateStatus/${orderId}`, {
        method: 'PUT', // Dùng PATCH để cập nhật trạng thái
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }), // Gửi trạng thái mới
      });

      if (res.ok) {
        setMessage(`Trạng thái đơn hàng đã được cập nhật thành ${newStatus}!`);
        // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái
        const updatedOrder = await res.json();
        setData(prevData =>
          prevData.map(order =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
      } else {
        setMessage('Cập nhật trạng thái thất bại!');
      }

      setTimeout(() => {
        setMessage('');
      }, 3000);

    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      setMessage('Đã xảy ra lỗi khi cập nhật trạng thái!');
      setTimeout(() => {
        setMessage('');
      }, 3000);
    }
  };

  // Hiển thị trạng thái loading trong khi chờ dữ liệu
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        {/* <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          className="searchBar"
        /> */}
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Tên</th>
                <th>Địa Chỉ GH</th>
                <th>Trạng Thái</th>
                <th>Tổng Tiền</th>
                <th>Phương Thức TT</th>
                <th>Edit</th>
                <th>Xác nhận</th>
              </tr>
            </thead>
            <tbody>
              {data.map((hd, index) => (
                <tr key={hd._id || index}>
                  <td>{index + 1}</td>
                  <td>{hd.userId.username}</td>
                  <td>{hd.userId.address}</td>
                  <td>{hd.status}</td>
                  <td>{hd.totalAmount}</td>
                  <td>{hd.paymentMethod}</td>
                  <td>
                    <Link  className="btn btn-primary mx-2" href={`/quanlyhd/sua/${hd._id}`}>Sửa</Link>
                    <Link  className="btn btn-primary mx-2" href={`/quanlyhd/hoadonct/${hd._id}`}>Xem chi tiết</Link>
                  </td>
                  <td>
                    {/* Dropdown chọn trạng thái */}
                    <select 
                        className="custom-select" 
                        value={selectedStatus} 
                        onChange={(e) => setSelectedStatus(e.target.value)}
                      >
                        <option value="đang chờ">Đang chờ</option>
                        <option value="đã xác nhận">Đã xác nhận</option>
                        <option value="đã giao">Đã giao</option>
                        <option value="đã hủy">Đã hủy</option>
                      </select>

                      <button 
                        className="btn-update" 
                        onClick={() => updateStatus(hd._id, selectedStatus)}
                      >
                        Cập nhật
                      </button>


                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Hiển thị thông báo ở góc dưới màn hình */}
      {message && (
        <div className="toast-message">
          {message}
        </div>
      )}
    </>
  );
}
