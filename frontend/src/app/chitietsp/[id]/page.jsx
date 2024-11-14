"use client"
import { useState, useEffect } from "react";
import useSWR from 'swr';
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DetailPage({ params }) {
    const [quantity, setQuantity] = useState(1);
    const [userID, setUserID] = useState(null);

    const { data: product, error, isLoading } = useSWR(`http://localhost:3000/sanpham/${params.id}`, fetcher, {
        refreshInterval: 6000,
    });

    const { data: relatedProducts } = useSWR(
        product ? `http://localhost:3000/sanpham/danhmuc/${product.id_danhmuc}` : null,
        fetcher
    );

    useEffect(() => {
        const getUserIDFromToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setUserID(payload.user._id);
                } catch (error) {
                    console.error("Không thể giải mã token:", error);
                }
            }
        };
        getUserIDFromToken();
    }, []);

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
            console.log(data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    if (error) return <div>Lỗi load dữ liệu.</div>;
    if (isLoading) return <div>Đang tải...</div>;

    const handleAddToCart = async () => {
        if (!userID) {
            alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: userID,
                    productId: product._id,
                    quantity: Number(quantity)
                })
            });

            if (response.ok) {
                alert("Sản phẩm đã được thêm vào giỏ hàng!");
            } else {
                alert("Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại.");
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Đã xảy ra lỗi khi thêm vào giỏ hàng.");
        }
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };

    return (
        <>
            <div className="product-container">
                <div className="product-images">
                    <img src={product.image} alt={product.name} className="main-image" />
                </div>
                <div className="product-details">
                    <h2 style={{ fontSize: '40px' }}>{product.name}</h2>
                    <p style={{ fontWeight: 'bold', color: 'black' }} className="price">{product.price.toLocaleString('vi-VN')} VNĐ</p>
                    <p className="description">{product.description}</p>
                    <p className="note">Giá chỉ áp dụng khi đặt hàng qua App/Web feshsite.com</p>

                    {/* Số lượng với nút cộng và trừ */}
                    <div className="quantity-container">
                        <button className="quantity-btn" onClick={handleDecrease}>-</button>
                        <input 
                            className="form-control quantity-input" 
                            min="1" 
                            type="number" 
                            value={quantity} 
                            onChange={(e) => setQuantity(Number(e.target.value))}
                        />
                        <button className="quantity-btn" onClick={handleIncrease}>+</button>
                    </div>

                    <div className="order-options" style={{ marginTop: '100px' }}>
                        <button className="btn btn-primary my-2" style={{ width: '170px' }} onClick={handleAddToCart}>
                            Thêm vào giỏ hàng
                        </button>
                    </div>
                </div>
            </div>

            {/* Phần Sản Phẩm Tương Tự */}
            <h3>Những Sản Phẩm Tương Tự</h3>
            <section className="foods py-5">
                <div className="container">
                    <div className="row">
                        {relatedProducts && relatedProducts.map((sp) => (
                            <div key={sp._id} className="col-md-3" onClick={() => handleClick(sp._id)}>
                                <Link href={`/chitietsp/${sp._id}`} className='news-link'>
                                    <div className="food-item">
                                        <img src={sp.image} alt={sp.name} className="img-fluid"/>
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
        </>
    );
}
