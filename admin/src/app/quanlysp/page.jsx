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
        const res = await fetch("http://localhost:3000/sanpham");
        const result = await res.json();
        const sortedData = result.sort((a, b) => b.views - a.views); // sắp xếp theo lượt xem nhiều nhất
        // const sortedData = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); //sắp xếp theo ngày tạo mới nhất
        setData(sortedData);
        console.log(result);
        setMessage('Tải sản phẩm thành công!'); // Hiển thị thông báo khi tải dữ liệu thành công
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
        setLoading(false); // Đảm bảo loading luôn tắt
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  const deleteProduct = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa sản phẩm này không?')) {
      try {
        const res = await fetch(`http://localhost:3000/sanpham/${id}`, {
          method: 'DELETE',
        });
  
        // Kiểm tra Content-Type xem phản hồi có phải JSON không
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const result = isJson ? await res.json() : await res.text();
  
        if (res.ok) {
          // Thông báo thành công
          setMessage('Sản phẩm đã được xóa thành công!');
          setData(prevData => prevData.filter(sp => sp._id !== id)); // Cập nhật danh sách sản phẩm
        } else {
          // Nếu là JSON, sử dụng `result.message`; nếu không, hiển thị kết quả dạng văn bản
          setMessage(isJson ? result.message : result || 'Đã xảy ra lỗi khi xóa sản phẩm!');
        }
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        setMessage('Đã xảy ra lỗi khi xóa sản phẩm!'); // Thông báo lỗi
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
          placeholder="Tìm kiếm sản phẩm..."
          className="searchBar"
        />
        <Link href="/quanlysp/them" className='add'>Thêm sản phẩm</Link>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Photo</th>
                <th>Price</th>
                <th>Description</th>
                <th>Views</th>
                <th>Edit</th>
                <th>Del</th>
              </tr>
            </thead>
            <tbody>
              {data.map((sp, index) => (
                <tr key={sp._id || index}>
                  <td>{index + 1}</td>
                  <td>{sp.name}</td>
                  <td><img src={sp.image} alt="Admin" className="photo" /></td>
                  <td>{sp.price.toLocaleString('vi-VN')} VNĐ</td>
                  <td>{sp.description}</td>
                  <td>{sp.views}</td>
                  <td><Link className="btn btn-primary mx-2" href={`/quanlysp/sua/${sp._id}`}>Sửa</Link></td>
                  <td><button className="delButton" onClick={() => deleteProduct(sp._id)}>Del</button></td>
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
