'use client';
import Link from "next/link";
import React, { useEffect, useState } from 'react';

export default function SanPhamDM(params) {
  const [dsDM, setDsDM] = useState([]);
  const [dmdata, setDmdata] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000/sanpham/danhmuc/'+params.searchParams.id);
        if (!res.ok) throw new Error("Data not found");
        const data = await res.json();
        setDsDM(data);
        const resdm = await fetch("http://localhost:3000/danhmuc");
        const resultdm = await resdm.json();
        setDmdata(resultdm);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [params.searchParams.id]);


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
      console.log(`Views updated for product ID: ${productId}`);
    } catch (error) {
      console.error('Error updating views:', error);
    }
  };  
  if (loading) {
    return <div>Loading...</div>;
  }

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
        <div className="row news-link">
          {dsDM.map(sp => (
            <div className="col-md-3" key={sp._id} onClick={() => handleClick(sp._id)}>
              <Link href={`/chitietsp/${sp._id}`} className="news-link">       
                  <div className="food-item">
                    <img src={sp.image} alt={sp.name} className="img-fluid" />
                    <p>{sp.name}</p>
                    <span style={{ fontWeight: 'bold', color: 'black' }}>{sp.price.toLocaleString('vi-VN')} VNĐ</span><br /><br />
                    <span className="xem">Xem chi tiết</span>
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
