export default function Footer() {
    return(
<footer style={{ marginTop: '300px' }}
>
    <div class="footer-container">
        <div class="footer-section logo-section">
            <img src="/image/logofesh.png" alt="Fast Food Logo" class="footer-logo"/>
            <ul>
                <li>Hệ thống cửa hàng</li>
                <li>Giấy phép kinh doanh</li>
                <li>Quy chế hoạt động</li>
                <li>Chính sách đổi trả</li>
                <li>Chính sách giao hàng</li>
                <li>Chính sách bảo mật</li>
            </ul>
        </div>
        <div class="footer-section">
            <h4>DANH MỤC</h4>
            <ul>
                <li>Menu Chính</li>
                <li>Menu Điểm Tâm</li>
                <li>Fesh Drink & Coffe</li>
            </ul>
        </div>
        <div class="footer-section">
            <h4>HỖ TRỢ KHÁCH HÀNG</h4>
            <ul>
                <li>Điều kiện giao dịch chung</li>
                <li>Hướng dẫn mua hàng online</li>
                <li>Chính sách giao hàng</li>
                <li>Chính sách thanh toán</li>
                <li>Lịch sử đơn hàng</li>
            </ul>
        </div>
        <div class="footer-section contact-section">
            <div class="contact-item">
                <i class="bi bi-envelope"></i> 
                <p style={{marginRight:'10px '}}>E-MAIL:</p>
                <p>hominhtri0712@gmail.com</p> 
            </div>
            <div class="contact-item">
                <i class="bi bi-geo-alt"></i>
                <p>Địa Chỉ:</p>
                <p>Tân Phước, Tân Hồng, Đồng Tháp, Việt Nam</p>  
            </div>
            <div class="contact-item">
                <i class="bi bi-telephone"></i> 
                <p>What App Của Chúng Tôi:</p>
                <p>+84 911018807</p>
            </div>
        </div>
    </div>
</footer>

    )
}
