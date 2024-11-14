"use client";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';

export default function Header() {
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [userId, setUserId] = useState("");
    const [isAdmin, setIsAdmin] = useState(false); // Trạng thái kiểm tra vai trò admin

    useEffect(() => {
        // Đánh dấu là đã mounted khi client đã sẵn sàng
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {  // Kiểm tra đã mounted trước khi lấy trạng thái đăng nhập
            const checkLoginStatus = () => {
                const token = localStorage.getItem('token');
                if (token) {
                    setIsLoggedIn(true);
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        setUsername(payload.user.username);
                        setUserId(payload.user._id);
                        setIsAdmin(payload.user.role === 'admin'); // Kiểm tra vai trò admin
                    } catch (error) {
                        console.error("Không thể giải mã token:", error);
                    }
                }
            };
            checkLoginStatus();
        }
    }, [isMounted]);

    useEffect(() => {
        if (isMounted && userId) {  // Kiểm tra đã mounted và có userId trước khi gọi API giỏ hàng
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
    }, [isMounted, userId]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/'); // Điều hướng về trang chủ
    };

    const handleUsernameClick = () => {
        if (isAdmin) {
            router.push('http://localhost:3002'); // Điều hướng đến trang admin nếu là admin
        }
    };

    if (!isMounted) return null; // Không render component cho đến khi mounted

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
                                    <span className="username" onClick={handleUsernameClick} style={{ cursor: 'pointer', textDecoration: 'none' }}>
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
                                        <li className="nav-item"><a href="#" className="nav-link">Giới Thiệu</a></li>
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
        </>
    );
}
