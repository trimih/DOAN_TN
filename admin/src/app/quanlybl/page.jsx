'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page(){
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState(''); // Thêm state cho thông báo
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const res = await fetch("http://localhost:3000/comments");
          const result = await res.json();
          const sortedData = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          setData(sortedData);
          console.log(result);
          setLoading(false);
          setMessage(' tải thành công!'); // Hiển thị thông báo khi tải dữ liệu thành công
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
    const handleDelete = async (id) => {
        if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
    
        try {
          const res = await fetch(`http://localhost:3000/comments/${id}`, {
            method: 'DELETE',
          });
    
          if (res.ok) {
            setData((prev) => prev.filter((item) => item._id !== id));
            setMessage('Xóa bình luận thành công!');
          } else {
            setMessage('Lỗi khi xóa bình luận!');
          }
        } catch (error) {
          console.error('Lỗi khi xóa:', error);
          setMessage('Đã xảy ra lỗi khi xóa bình luận!');
        } finally {
          setTimeout(() => setMessage(''), 3000);
        }
      };
  
    // Hiển thị trạng thái loading trong khi chờ dữ liệu
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <>
        <div className="container">
          <div className="tableContainer">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên người dùng</th>
                  <th>Tên sản phẩm</th>
                  <th>Nội dung</th>
                  <th>Chức năng</th>
                </tr>
              </thead>
              <tbody>
                {data.map((bl, index) => (
                  <tr key={bl._id || index}>
                    <td>{index + 1}</td>
                    <td>{bl.userId.username}</td>
                    <td>{bl.productId.name}</td>
                    <td>{bl.description}</td>
                    <td><button
                      className="btn btn-danger"
                      onClick={() => handleDelete(bl._id)}
                    >
                      <i class="bi bi-trash3"></i>
                    </button></td>
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