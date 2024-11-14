'use client'
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(''); // Thêm state cho thông báo

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/danhmuc");
        const result = await res.json();
        setData(result);
        console.log(result);
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

  // Hiển thị trạng thái loading trong khi chờ dữ liệu
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <input
          type="text"
          placeholder="Tìm kiếm danh mục..."
          className="searchBar"
        />
        <Link href="/quanlydm/them" className='add'>Thêm danh mục</Link>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Name</th>
                <th>Description</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sp, index) => (
                <tr key={sp.id || index}>
                  <td>{index + 1}</td>
                  <td>{sp.name}</td>
                  <td>{sp.description}</td>
                  <td><Link  className="btn btn-primary mx-2" href={`/quanlydm/sua/${sp._id}`}>Sửa</Link></td>
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
