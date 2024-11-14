'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Page({ params }) {
  const router = useRouter();
  const resolvedParams = use(params); // Sử dụng `use()` để xử lý `params` như là một Promise
  const { id } = resolvedParams;
  const [hoadon, setHoadon] = useState(null);

  useEffect(() => {
    const gethd = async () => {
      try {
        const res = await fetch(`http://localhost:3000/orderdetail/${id}`);
        const data = await res.json();
        setHoadon(data);
        console.log(data);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu hóa đơn:', error);
      }
    };
    if (id) {
      gethd();
    }
  }, [id]);

  if (!hoadon) {
    return <p>Đang tải dữ liệu...</p>;
  }

  return (
    <>
    <div>
  <div className="page-header"></div>
  <h3 className="page-title">Chi Tiết Hóa Đơn</h3>
  <div className="order-detail">
    <h4>Mã hóa đơn: {hoadon._id}</h4>
    <h5>Các sản phẩm:</h5>
    <table className="order-table">
      <thead>
        <tr>
          <th>Sản phẩm</th>
          <th>Ảnh</th>
          <th>Số lượng</th>
          <th>Giá</th>
        </tr>
      </thead>
      <tbody>
        {hoadon.items.map((item, index) => (
          <tr key={index}>
            <td>{item.productId.name}</td>
            <td><img src={item.productId.image} alt="" width="100" /></td>
            <td>{item.quantity}</td>
            <td>{item.price.toLocaleString('vi-VN')} VNĐ</td>
          </tr>
        ))}
      </tbody>
    </table>
    <div className="total-price-container">
      <h5>Tổng hóa đơn: <span className="total-price">{hoadon.totalPrice.toLocaleString('vi-VN')} VNĐ</span></h5>
    </div>
  </div>
</div>

    </>
  );
}
