"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [isAdmin, setIsAdmin] = useState(false); // Thêm trạng thái để kiểm tra vai trò admin
    const [message, setMessage] = useState(''); // Thêm state cho thông báo

    useEffect(() => {
        const checkLoginStatus = () => {
            const token = localStorage.getItem('token');
            if (token) {
                setIsLoggedIn(true);
                try {
                    const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );

            const payload = JSON.parse(jsonPayload);
                    setUsername(payload.user.username);
                    setUserId(payload.user._id);
                    setIsAdmin(payload.user.role === 'admin'); // Kiểm tra vai trò admin
                } catch (error) {
                    console.error("Không thể giải mã token:", error);
                }
            }
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        if (userId) {
            const fetchCartCount = async () => {
                try {
                    const response = await fetch(`http://localhost:3000/cart/${userId}`);
                    if (!response.ok) {
                        throw new Error('Không thể lấy giỏ hàng');
                    }
                    const data = await response.json();
                    setCartCount(data.items.length);
                } catch (error) {
                    console.error(error);
                }
            };
            fetchCartCount();
        }
    }, [userId]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setMessage("Đã đăng xuất");
        setTimeout(() => {
            setMessage(''); // Ẩn thông báo sau 3 giây
          }, 3000);
        router.push('/'); // Điều hướng đến trang chủ
    };

    const handleUsernameClick = () => {
        if (isAdmin) {
            router.push('http://localhost:3002'); // Điều hướng đến trang admin nếu là admin
        }
    };

    return (
        <>
        <header>
            <div className="top-bar">
                <div className="container d-flex justify-content-between align-items-center py-2">
                    <div className="contact-info">
                        <a style={{backgroundColor:"white"}} href="tel: 09111918807">Hotline: 0911918807</a>
                        <a className="info" href="#"><i className="bi bi-facebook"></i></a>
                        <a className="info" href="#"><i className="bi bi-twitter"></i></a>
                        <a className="info" href="#"><i className="bi bi-instagram"></i></a>
                        <a className="info" href="#"><i className="bi bi-youtube"></i></a>
                    </div>
                    
                    <div className="user-auth">
                        {isLoggedIn ? (
                            <>
                                <span className="username" onClick={handleUsernameClick} style={{ cursor: 'pointer', textDecoration: 'none',width:'100px' }}>
                                    {username}
                                </span> | 
                                <a onClick={handleLogout} className="auth-link"style={{ cursor: 'pointer', textDecoration: 'none' }}>
                                    <i className="fa fa-sign-out-alt"></i> Đăng xuất
                                </a>
                            </>
                        ) : (
                            <> 
                            <i className="fa fa-user-plus"></i>
                                <a href="/dangnhap" className="auth-link">
                                    Đăng Nhập
                                </a> | 
                                <a href="/dangky" className="auth-link">
                                     Đăng Ký
                                </a>
                            </>
                        )}
                    </div>
                </div>
            </div>
            <div className="main-header">
                <div className="container">
                    <div className="logosearch">
                        <div className="logo">
                            <a href="/">
                                <img src="/image/logofesh.png" alt="Logo" className="img-fluid" />
                            </a>
                        </div>
                        <div className="search d-flex">
                            <form className="search-bar ml-auto" action="/timkiem">
                                <input className="form-control me-2" name="keyword" placeholder="Nhập tên sản phẩm" />
                                <button className="" type="submit"><i className="bi bi-search"></i></button>
                            </form>  
                            <div className="cart-icon position-relative">
                                <a href="/giohang"><i className="bi bi-cart-fill"></i></a>
                                {cartCount > 0 && (
                                    <span className="cart-count">{cartCount}</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="navbar col-lg-8">
                            <nav>
                                <ul className="nav">
                                    <li className="nav-item"><a href="/" className="nav-link">Trang Chủ</a></li>
                                    <li className="nav-item"><a href="/sanpham" className="nav-link">Thực Đơn</a></li>
                                    <li className="nav-item"><a href="/news" className="nav-link">Tin Tức</a></li>
                                    <li className="nav-item"><a href="/gioithieu" className="nav-link">Giới Thiệu</a></li>
                                    <li className="nav-item"><a href="/lienhe" className="nav-link">Liên Hệ</a></li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <style jsx>{`
       
        `}</style>
         {/* Hiển thị thông báo ở góc dưới màn hình */}
         {message && (
          <div className="toast-message">
            {message}
          </div>
        )}
    </>
    );
}
