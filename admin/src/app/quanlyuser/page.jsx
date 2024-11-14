'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/user");
        const result = await res.json();
        setData(result);
        console.log(result);
        setMessage('Tải người dùng thành công!');
        setTimeout(() => {
          setMessage(''); // Ẩn thông báo sau 3 giây
        }, 3000);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setMessage('Đã xảy ra lỗi khi tải dữ liệu!');
        setTimeout(() => {
          setMessage('');
        }, 3000);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const deleteUser = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này không?')) {
      try {
        const res = await fetch(`http://localhost:3000/user/${id}`, {
          method: 'DELETE',
        });

        const isJson = res.headers.get('content-type')?.includes('application/json');
        const result = isJson ? await res.json() : await res.text();

        if (res.ok) {
          setMessage('Người dùng đã được xóa thành công!');
          setData(prevData => prevData.filter(user => user._id !== id));
        } else {
          setMessage(isJson ? result.message : result || 'Đã xảy ra lỗi khi xóa người dùng!');
        }
      } catch (error) {
        console.error("Lỗi khi xóa người dùng:", error);
        setMessage('Đã xảy ra lỗi khi xóa người dùng!');
      } finally {
        setTimeout(() => {
          setMessage('');
        }, 3000);
      }
    }
  };

  return (
    <>
      <div className="container">
        <input
          type="text"
          placeholder="Tìm kiếm khách hàng..."
          className="searchBar"
        />
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Address</th>
                <th>Phone number</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.map((us, index) => (
                <tr key={us._id || index}>
                  <td>{index + 1}</td>
                  <td>{us.username}</td>
                  <td>{us.address}</td>
                  <td>{us.phone}</td>
                  <td>{us.email}</td>
                  <td>{us.role}</td>
                  <td>
                    <Link className="btn btn-primary mx-2" href={`/quanlyuser/sua/${us._id}`}>Sửa</Link>
                    <button className="delButton" onClick={() => deleteUser(us._id)}>Del</button>
                    </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {message && (
        <div className="toast-message">
          {message}
        </div>
      )}
    </>
  );
}
