"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";

export default function Header() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState(""); // Thêm state để lưu tên người dùng

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const payload = JSON.parse(atob(token.split('.')[1])); // Giải mã token để lấy thông tin người dùng
            console.log(payload); // Kiểm tra payload
            setIsLoggedIn(true); // Nếu token tồn tại, coi như đã đăng nhập
            setUsername(payload.user.username || "Admin"); // Lấy tên người dùng từ payload, nếu không có thì mặc định là "Admin"
        }
    }, []);

    const handleLogout = () => {
        console.log("Đang đăng xuất..."); // Kiểm tra xem hàm có được gọi không
        localStorage.removeItem('token'); // Xóa token
        setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
        router.push('http://localhost:3001'); // Điều hướng đến trang chủ
    };  

    return (
        <div className="headerContainer">
            <div className="navLinks">
                <Link className='logo' style={{backgroundColor: '#f8e1bc'}} href="/"><img src="/image/logofesh.png" width={'200px'} alt="" /></Link>
                <Link href="/"> Trang Quản Trị</Link>
                <Link href="/quanlysp">Quản lý sản phẩm</Link>
                <Link href="/quanlydm">Quản lý danh mục</Link>
                <Link href="/quanlyuser">Quản lý User</Link>
                <Link href="/quanlytt">Quản lý tin tức</Link>
                <Link href="/quanlybl">Quản lý bình luận</Link>
                <Link href="/quanlyhd">Quản lý hóa đơn</Link>
                <Link href="http://localhost:3001" className="backButton">Quay về trang chủ</Link> 
            </div>
            <div className="welcomeText" style={{margin: ' 0 100px',fontSize: '30px',color: 'black'}}>
            Quản trị: <strong>{username || "Admin"}</strong> {/* Hiển thị tên người dùng */}
            </div>
            {isLoggedIn && ( // Chỉ hiển thị nút đăng xuất nếu đã đăng nhập
                <button onClick={handleLogout} className="logoutButton">Đăng xuất</button>
            )}
        </div>
    );
}
