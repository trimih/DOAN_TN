'use client'; // Ensure this is at the very top of your file
import Link from "next/link";
import React, { useEffect, useState } from 'react';

export default function Timkiem({ searchParams }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://localhost:3000/sanpham/timkiem/' + searchParams.keyword);
      const result = await res.json();
      setData(result); // Set the fetched data to state
      console.log(result);
    };

    fetchData(); // Fetch the data when the component mounts
  }, [searchParams.keyword]);

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

      const result = await response.json();
      console.log(result); // You can handle the response here if needed
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <section className="foods py-5">
      <div className="container">
        <div className="row">
          {data.map(sp => (
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
  );
}
