'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function News({ newsData }) {
    const [data, setData] = useState([]);
    const [hottt,setHottt] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await fetch("http://localhost:3000/news"); // Gọi API lấy sản phẩm
            const result = await res.json(); // Chuyển đổi phản hồi sang JSON
            setData(result); // Lưu dữ liệu vào state
            const reshot = await fetch("http://localhost:3000/news/hot"); // Gọi API lấy sản phẩm
            const resulthot = await reshot.json(); // Chuyển đổi phản hồi sang JSON
            setHottt(resulthot);
            setLoading(false); // Tắt trạng thái loading khi dữ liệu đã được lấy

        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            setLoading(false); // Tắt trạng thái loading nếu lỗi xảy ra
          }
        };
        fetchData();
        }, []);
        const handleClick = async (newsID) => {
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
        
    if (loading) {
        return <div>Loading...</div>;
        }
  return (
    <div className="container py-5">
      {/* Hot News of the Day */}
      <section className="hot-news mb-4">
        <div className="row">
          <div className="col-md-9">
            <div className="hot-news-item card ">
              <img src="/image/tt4.jpg" alt="Special Offer" className="img-fluid " />
              <p>Ngày Đăng: 23/10/2024</p>
              <p>Ngày 30/3 có COVID-19 với gần đến 280</p>
              <p style={{color:'blue',marginLeft:'8px',fontSize:'18px'}} ><i class="bi bi-plus-circle-fill"></i> <span style={{fontWeight: 'bold', color: 'white'}}>Đọc thêm</span></p>
            </div>
          </div>
          <div className="col-md-3">
            <img src="/image/tt5.jpg" alt="Side Ad 1" className="img-fluid mb-3" />
            <img src="/image/tt6.jpg" alt="Side Ad 2" className="img-fluid mb-3" />
            <img src="/image/tt7.jpg" alt="Side Ad 3" className="img-fluid" />
          </div>
        </div>
      </section>
      {/* Latest News */}
      <section className="latest-news mb-5">
        <h2 className="section-title">Tin Hot</h2>
        <div className="row">
          {hottt.slice(0,4).map((news, index) => (
            <div key={index} className="col-md-3 mb-4">
              <Link href={`/chitiettt/${news._id}`} className="news-item card news-link " onClick={() => handleClick(news._id)}>
                  <img src={news.image} alt="News Image" className="img-fluid mb-2" />
                  <p>Ngày Đăng: <span style={{color:'blue'}}>{new Date(news.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                  <p className='tl' style={{fontSize:'15px',fontWeight:'bold'}}>{news.tiltle}</p>
                  <p style={{marginTop:'5px',fontSize:'15px'}} className="read-more text-primary"><i className="bi bi-plus-circle-fill"></i> Đọc thêm</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
      {/* Weekly News */}
      <section className="latest-news mb-5">
        <h2 className="section-title">Các Tin Tức Khác</h2>
        <div className="row">
          {data.map((news, index) => (
            <div key={index} className="col-md-3 mb-4">
              <Link href={`/chitiettt/${news._id}`} className="news-item card news-link " onClick={() => handleClick(news._id)}>
                  <img src={news.image} alt="News Image" className="img-fluid mb-2" />
                  <p>Ngày Đăng: <span style={{color:'blue'}}>{new Date(news.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'long', day: 'numeric' })}</span></p>
                  <p className='tl' style={{fontSize:'15px',fontWeight:'bold'}}>{news.tiltle}</p>
                  <p style={{marginTop:'5px',fontSize:'15px'}} className="read-more text-primary"><i className="bi bi-plus-circle-fill"></i> Đọc thêm</p>
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}