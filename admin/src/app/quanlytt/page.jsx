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
        const res = await fetch("http://localhost:3000/news");
        const result = await res.json();
        const sortedData = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
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

  const deleteNews = async (id) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này không?')) {
      try {
        const res = await fetch(`http://localhost:3000/news/${id}`, {
          method: 'DELETE',
        });
  
        // Kiểm tra Content-Type xem phản hồi có phải JSON không
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const result = isJson ? await res.json() : await res.text();
  
        if (res.ok) {
          // Thông báo thành công
          setMessage('Bài viết đã được xóa thành công!');
          setData(prevData => prevData.filter(tt => tt._id !== id)); // Cập nhật danh sách sản phẩm
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
          placeholder="Tìm kiếm Bài Viết..."
          className="searchBar"
        />
        <Link href="/quanlytt/them" className='add'>Thêm Bài Viết</Link>
        <div className="tableContainer">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Tiêu Đề Bài Viết</th>
                <th>Photo</th>
                <th>Description</th>
                <th>Views</th>
                <th>Edit</th>
                <th>Del</th>
              </tr>
            </thead>
            <tbody>
              {data.map((tt, index) => (
                <tr key={tt._id || index}>
                  <td>{index + 1}</td>
                  <td>{tt.tiltle}</td>
                  <td><img src={tt.image} alt="Admin" className="photo" /></td>
                  <td>{tt.description}</td>
                  <td>{tt.view}</td>
                  <td><Link className="btn btn-primary mx-2" href={`/quanlytt/sua/${tt._id}`}><i class="bi bi-pencil-square"></i></Link></td>
                  <td><button className="delButton" onClick={() => deleteNews(tt._id)}> <i class="bi bi-trash3"></i></button></td>
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
