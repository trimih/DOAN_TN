'use client';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';

export default function SanPham() {
  const [data, setData] = useState([]);
  const [dmdata, setDmdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomProducts, setRandomProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Số sản phẩm mỗi trang

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:3000/sanpham");
        const result = await res.json();
        setData(result);
        const resdm = await fetch("http://localhost:3000/danhmuc");
        const resultdm = await resdm.json();
        setDmdata(resultdm);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const shuffledProducts = shuffleArray([...data]);
      setRandomProducts(shuffledProducts);
    }
  }, [data]);

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

      const responseData = await response.json();
      console.log(responseData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Tính toán sản phẩm cần hiển thị theo trang hiện tại
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = randomProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  // Hàm xử lý thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Hiển thị trạng thái loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // Tính toán tổng số trang
  const totalPages = Math.ceil(randomProducts.length / productsPerPage);

  return (
    <>
      <section className="listsp" style={{ marginTop: '10px' }}>
        {dmdata.map(dm =>(
        <ul key={dm._id}>
          <li><Link href={`/sanphamdm?id=${dm._id}`} className='news-link'> {dm.name} </Link></li>
        </ul>
        ))}
      </section>
      <section className="foods py-5">
        <div className="container">
          <div className="row">
            {currentProducts.map(sp => (
              <div className="col-md-3" key={sp._id} onClick={() => handleClick(sp._id)}>
                <Link href={`/chitietsp/${sp._id}`} className='news-link'>
                  <div className="food-item">
                    <img src={sp.image} alt={sp.name} className="img-fluid" />
                    <p>{sp.name}</p>
                    <span style={{ fontWeight: 'bold', color: 'black' }}>{sp.price.toLocaleString('vi-VN')} VNĐ</span><br /><br />
                    <a href={`/chitietsp/${sp._id}`} className="xem">Xem chi tiết</a>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <nav>
        <ul className="pagination">
          {Array.from({ length: totalPages }, (_, index) => (
            <li key={index + 1} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
