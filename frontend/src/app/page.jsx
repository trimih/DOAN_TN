'use client';
import Image from "next/image";
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import Link from "next/link";

export default function Home() {
  const [data, setData] = useState([]); // Dữ liệu sản phẩm
  const [hotProducts, setHotProducts] = useState([]); // Dữ liệu sản phẩm hot
  const [loading, setLoading] = useState(true); // Biến để kiểm soát trạng thái loading
  const [tintuc,setTintuc] = useState([]); // Dữ liệu tin tức 

  // Sử dụng useEffect để gọi API khi component được render lần đầu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/sanpham"); // Gọi API lấy sản phẩm
        const result = await res.json(); // Chuyển đổi phản hồi sang JSON
        setData(result); // Lưu dữ liệu vào state
        console.log(result);
        
        // Gọi API để lấy sản phẩm hot
        const hotRes = await fetch("http://localhost:3000/sanpham/hot"); // Gọi API lấy sản phẩm hot
        const hotResult = await hotRes.json(); // Chuyển đổi phản hồi sang JSON
        setHotProducts(hotResult); // Lưu sản phẩm hot vào state

        const tintucRes = await fetch("http://localhost:3000/news/hot"); // Gọi API lấy tin tức
        const tintucResult = await tintucRes.json(); // Chuyển đổi phản hồi sang JSON
        setTintuc(tintucResult); // Lưu tin tức

        setLoading(false); // Tắt trạng thái loading
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false); // Tắt trạng thái loading nếu lỗi xảy ra
      }
    };

    fetchData(); // Gọi hàm fetchData
  }, []); // Mảng rỗng [] để đảm bảo useEffect chỉ chạy một lần sau lần render đầu tiên

  // Hiển thị trạng thái loading trong khi chờ dữ liệu
  if (loading) {
    return <div>Loading...</div>;
  }
  const handleClick = async (productId) => {
    try {
      const response = await fetch(`http://localhost:3000/sanpham/${productId}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update views');
      }

      const data = await response.json();
      console.log(data); // Có thể hiển thị thông tin hoặc cập nhật giao diện
    } catch (error) {
      console.error('Error:', error);
    }
  };
  const handleClickView = async (newsID) => {
    try {
      const response = await fetch(`http://localhost:3000/news/${newsID}/views`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to update views');
      }

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
    {/* // <!-- Banner Section --> */}
  <section class="banner" style={{ marginTop: '10px' }}
  >
    <div class="container">
      <div class="row">
        {/* <!-- Main Banner --> */}
        <div class="col-lg-8">
          <div class="main-banner">
            <img src="/image/banner1.png" alt="Burger" class="img-fluid"/>
            
          </div>
        </div>
  
        {/* <!-- Side Banners --> */}
        <div class="col-lg-4">
          <div class="side-banner mb-4">
            <img src="/image/banner2.png" alt="Signature Burgers" class="img-fluid"/>
            
          </div>
          <div class="side-banner">
            <img src="/image/banner3.png" alt="Fresh RT Services" class="img-fluid"/>
           
          </div>
        </div>
      </div>
    </div>
  </section>
  <section class="logo2">
    <img src="/image/banner4.png" alt="" />
    <img src="/image/banner5.png" alt="" />
    <img src="/image/banner6.png" alt="" />
    <img src="/image/banner7.png" alt="" />
    <img src="/image/banner8.png" alt="" />
  </section>
  {/* <!-- Hot Foods Section --> */}
  <section class="hot-foods py-5">
    <div class="container ">
      <h2>Thức Ăn Hot!</h2>
      <div class="row">
      {hotProducts.map(sp =>(
        <div class="col-md-3" onClick={() => handleClick(sp._id)}>
          <Link href={`/chitietsp/${sp._id}`} className='news-link'>
          <div class="food-item">
            <img src={sp.image} alt="Burger Thịt Nướng" class="img-fluid"/>
            <p>{sp.name}</p>
            <span style={{ fontWeight: 'bold', color: 'black' }}>{sp.price.toLocaleString('vi-VN')} VNĐ</span><br /><br />
            <a href="/chitietsp" className="xem">Xem chi tiết</a>
          </div>
          </Link>
        </div>
        ))};
      </div>
    </div>
  </section>

  {/* <!-- Food Menu Banner --> */}
  <section class="food-menu-banner ">
    <img src="/image/banner9.png" alt="Food Menu" class="img-fluid"/>
  </section>

  {/* <!-- Baked Goods Section --> */}
  <section className="foods py-5">
        <div className="container">
        <h2>Các Món Ăn</h2>
          <div className="row">
          {data.slice(3, 11).map(sp =>(
              <div className="col-md-3" key={sp._id}  onClick={() => handleClick(sp._id)}>
                <Link href={`/chitietsp/${sp._id}`} className="news-link">
                  <div className="food-item">
                    <img src={sp.image} alt={sp.name} className="img-fluid" />
                    <p>{sp.name}</p>
                    <span style={{ fontWeight: 'bold', color: 'black' }}>{sp.price.toLocaleString('vi-VN')} VNĐ</span><br /><br />
                    <a href="/chitietsp" className="xem">Xem chi tiết</a>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="news py-5 bg-light">
    <div className="container">
      <h2>Tin Tức</h2>
      <div className="row">
       {tintuc.slice(0,3).map((tt, index) => (
        <div key={index} className="col-md-4">
           <Link href={`/chitiettt/${tt._id}`} className="news-link" onClick={() => handleClickView(tt._id)}>
          <div className="news-item">
            <img src={tt.image} alt="News" className="img-fluid"/>
            <p> Ngày Đăng: <span style={{color: 'blue'}}> {new Date(tt.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
            <p style={{fontSize:'15px',fontWeight:'bold'}}>{tt.tiltle}</p>
            <p style={{color:'blue',marginLeft:'8px',fontSize:'18px',marginTop:'30px'}} ><i class="bi bi-plus-circle-fill"></i> <span style={{fontWeight: 'bold', color: 'black'}}>Đọc thêm</span></p>
          </div>
          </Link>
        </div>
        ))}
      </div>
    </div>
  </section>
</>
  );
}
