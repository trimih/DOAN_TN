"use client"
import { useState, useEffect } from "react";
import useSWR from 'swr';
import Link from "next/link";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function DetailPage({ params }) {
    const [quantity, setQuantity] = useState(1);
    const [userID, setUserID] = useState(null);
    const [message, setMessage] = useState(''); // Thêm state cho thông báo

    const { data: product, error, isLoading } = useSWR(`http://localhost:3000/sanpham/${params.id}`, fetcher, {
        refreshInterval: 6000,
    });
    
    const { data: comments, error: commentsError, isLoading: commentsLoading } = useSWR(
        product ? `http://localhost:3000/comments/product/${product._id}` : null,
        fetcher,
        { refreshInterval: 6000 }
    );
    
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
            // Hiển thị thông báo yêu cầu đăng nhập
            setMessage("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!");
            setTimeout(() => {
                setMessage(''); // Ẩn thông báo sau 3 giây
            }, 3000);
            return; // Dừng hàm tại đây, không thêm sản phẩm vào giỏ hàng
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
                setMessage("Sản phẩm đã được thêm vào giỏ hàng!");
                setTimeout(() => {
                    setMessage(''); // Ẩn thông báo sau 3 giây
                }, 3000);
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
            <div className="comments-section">
    <h3>BÌNH LUẬN SẢN PHẨM</h3>
    {/* Hiển thị danh sách bình luận */}
    {commentsLoading ? (
        <p>Đang tải bình luận...</p>
    ) : commentsError ? (
        <p>Không thể tải bình luận. Vui lòng thử lại sau.</p>
    ) : comments && comments.length > 0 ? (
        <ul className="comments-list">
            {comments.map((comment) => (
                <li key={comment._id}>
                    <strong><img src="/image/user.jpg" width={'7%'} style={{borderRadius:'50px',padding:'0 12px '}} alt="" />{comment.userId.username}</strong>
                    <p>{comment.description}</p>
                    <small>{new Date(comment.createdAt).toLocaleString()}</small>
                </li>
            ))}
        </ul>
    ) : (
        <p>Chưa có bình luận nào.</p>
    )}
     {/* Form thêm bình luận */}
     <form
        className="comment-form"
        onSubmit={async (e) => {
            e.preventDefault();
            const commentContent = e.target.comment.value;

            if (!userID) {
                setMessage("Vui lòng đăng nhập để bình luận!");
                setTimeout(() => {
                    setMessage(''); // Ẩn thông báo sau 3 giây
                  }, 3000);
                return;
            }

            try {
                const response = await fetch(`http://localhost:3000/comments/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        productId: product._id,
                        userId: userID,
                        description: commentContent,
                    }),
                });

                if (response.ok) {
                    e.target.comment.value = "";
                   
                } else {
                    alert("Không thể thêm bình luận. Vui lòng thử lại.");
                    
                }
            } catch (error) {
                console.error("Error adding comment:", error);
                alert("Đã xảy ra lỗi khi thêm bình luận.");
            }
        }}
    >
        <textarea
            name="comment"
            className="form-control"
            placeholder="Nhập bình luận của bạn..."
            required
        ></textarea>
        <button type="submit" className="btn btn-primary my-2">
            Gửi bình luận
        </button>
    </form>
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
             {/* Hiển thị thông báo ở góc dưới màn hình */}
        {message && (
          <div className="toast-message">
            {message}
          </div>
        )}
        </>
    );
}
