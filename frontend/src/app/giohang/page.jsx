"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import styles from "../page.module.css"; // Nhúng file CSS

export default function CartPage() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userId, setUserId] = useState(null);
    const [address, setAddress] = useState(""); // State cho địa chỉ
    const [paymentMethod, setPaymentMethod] = useState("tiền mặt"); // State cho phương thức thanh toán
    const [paymentMethods] = useState(["tiền mặt", "thẻ tín dụng"]); // Các phương thức thanh toán
    const [message, setMessage] = useState(''); // Thêm state cho thông báo

    useEffect(() => {
        const getUserIdFromToken = () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    setUserId(payload.user._id);
                    setAddress(payload.user.address); // Giả sử token chứa địa chỉ trong `user.address`
                } catch (error) {
                    console.error("Không thể giải mã token:", error);
                }
            }
        };

        getUserIdFromToken();
    }, []);

    useEffect(() => {
        const fetchCart = async () => {
            if (!userId) {
                setLoading(false);//không cần tải giỏ hàng khi chưa có userId
                return;
            }
               
            try {
                const response = await fetch(`http://localhost:3000/cart/${userId}`);
                if (!response.ok) {
                    throw new Error('Không thể lấy giỏ hàng');
                }
                const data = await response.json();
                setCart(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [userId]);

    if (loading) return <div>Đang tải giỏ hàng...</div>;
    if (error) return <div>{error}</div>;

    if (!cart || !cart.items) {
        return <div>
                <p>Vui lòng đăng nhập để xem giỏ hàng.</p>
                <Link href="/dangnhap">Đăng nhập</Link>
                </div>;
    }

    const handleQuantityChange = async (productId, quantity) => {
        if (quantity < 1) return;

        setCart(prevCart => {
            const updatedItems = prevCart.items.map(item => {
                if (item.productId._id === productId) {
                    return { ...item, quantity: parseInt(quantity, 10) };
                }
                return item;
            });

            const newTotalPrice = updatedItems.reduce((total, item) => {
                return total + (item.productId.price * item.quantity);
            }, 0);

            return {
                ...prevCart,
                items: updatedItems,
                totalPrice: newTotalPrice,
            };
        });

        try {
            const response = await fetch(`http://localhost:3000/cart/${userId}/update`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                throw new Error('Không thể cập nhật số lượng sản phẩm');
            }

            const updatedCart = await response.json();
            setCart(updatedCart);
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleRemove = async (productId) => {
        const confirmDelete = window.confirm('Bạn có chắc muốn xóa sản phẩm này không?');
        if (!confirmDelete) return;

        try {
            const response = await fetch(`http://localhost:3000/cart/${userId}/remove`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error('Không thể xóa sản phẩm khỏi giỏ hàng');
            }

            const updatedCart = await response.json();
            setCart(updatedCart);
            window.location.reload();
        } catch (error) {
            console.error(error.message);
        }
    };

    const handleClearCart = async () => {
        try {
            const response = await fetch(`http://localhost:3000/cart/${userId}/clear`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Không thể xóa giỏ hàng');
            }

            setCart({ items: [], totalPrice: 0 }); // Reset giỏ hàng
        } catch (error) {
            console.error(error.message);
        }
    };
    const sendOrderEmail = async (orderId) => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
    
        try {
            const emailResponse = await fetch(`http://localhost:3000/send-mail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Gửi token qua header
                },
                body: JSON.stringify({
                    orderId: orderId,
                    userId: userId,
                    totalAmount: cart.totalPrice,
                    paymentMethod: paymentMethod,
                    address: address
                }),
            });
    
            if (!emailResponse.ok) {
                throw new Error('Không thể gửi email thông báo đơn hàng');
            }
    
            console.log('Email đã được gửi thành công!');
        } catch (error) {
            console.error(error.message);
        }
    };
    
    
    const createOrder = async () => {
        try {
            // Tạo đơn hàng
            const response = await fetch(`http://localhost:3000/orders/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId: userId,
                    totalAmount: cart.totalPrice,
                    paymentMethod: paymentMethod,
                    address: address
                })
            });
    
            if (!response.ok) {
                throw new Error('Không thể tạo đơn hàng');
            }
    
            const result = await response.json();
            return result._id; // Trả về orderId của đơn hàng mới tạo
        } catch (error) {
            console.error('Lỗi khi tạo đơn hàng:', error.message);
            throw error; // Ném lỗi ra ngoài nếu có
        }
    };
    
    const addOrderDetail = async (orderId) => {
        try {
            // Thêm sản phẩm vào OrderDetail
            const orderDetailResponse = await fetch(`http://localhost:3000/orderdetail/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    orderId: orderId,
                    items: cart.items.map(item => ({
                        productId: item.productId._id, // Lấy productId của sản phẩm
                        quantity: item.quantity,
                        price: item.productId.price // Giá của sản phẩm
                    }))
                })
            });
    
            if (!orderDetailResponse.ok) {
                throw new Error('Không thể thêm sản phẩm vào OrderDetail');
            }
    
            const orderDetailResult = await orderDetailResponse.json();
            console.log('Order Detail đã được thêm:', orderDetailResult);
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm vào OrderDetail:', error.message);
            throw error; // Ném lỗi ra ngoài nếu có
        }
    };
    
    const handleCheckout = async () => {
        if (!cart.items || cart.items.length === 0) {
            alert('Giỏ hàng trống! Không thể thanh toán.');
            return;
        }
    
        try {
            // Tạo đơn hàng và lấy orderId
            const orderId = await createOrder();
            
            // // Thêm sản phẩm vào OrderDetail
            await addOrderDetail(orderId);
    
              // Lưu thông tin đơn hàng vào localStorage
                const orderData = {
                orderId: orderId,
                userId: userId,
                totalAmount: cart.totalPrice,
                paymentMethod: paymentMethod,
                address: address,
                items: cart.items.map(item => ({
                productId: item.productId._id,
                name: item.productId.name,
                quantity: item.quantity,
                price: item.productId.price,
                    })),
                };
                localStorage.setItem('lastOrder', JSON.stringify(orderData));
    
            // Gửi email thông báo đơn hàng
            await sendOrderEmail(orderId);
    
            // Xóa giỏ hàng sau khi thanh toán thành công
            await handleClearCart();
            setMessage('Đặt hàng thành công!'); // Thông báo thành công
            setTimeout(() => {
                setMessage(''); // Ẩn thông báo sau 3 giây
              }, 3000);
        } catch (error) {
            console.error('Lỗi trong quá trình thanh toán:', error.message);
        }
    };
    

    return (
        <div className="containergh mt-3">
            {cart.items.length === 0 ? (
                <div>
                    <p>Giỏ hàng của bạn đang trống.</p>
                    <Link href="/sanpham">Tiếp tục mua sắm</Link>
                </div>
            ) : (
                <div className="cartWrapper">
                    {/* Bảng sản phẩm */}
                    <div className="cartItems">
                        <h2>Giỏ hàng của bạn</h2>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">Ảnh Sản Phẩm</th>
                                    <th scope="col">Tên sản phẩm</th>
                                    <th scope="col">Số lượng</th>
                                    <th scope="col">Giá</th>
                                    <th scope="col">Thành tiền</th>
                                    <th scope="col">Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.items.map((item) => (
                                    <tr key={item.productId._id}>
                                        <td>
                                            <img src={item.productId.image} alt={item.productId.name} width={70} height={70} />
                                        </td>
                                        <td>{item.productId.name}</td>
                                        <td>
                                            <div className="quantity-controls">
                                                <button 
                                                    className="quantity-button" 
                                                    onClick={() => handleQuantityChange(item.productId._id, item.quantity - 1)} 
                                                    disabled={item.quantity <= 1}
                                                >
                                                    −
                                                </button>
                                                <input 
                                                    className="quantity-input"
                                                    min="1"
                                                    type="number" 
                                                    value={item.quantity} 
                                                    readOnly
                                                />
                                                <button 
                                                    className="quantity-button" 
                                                    onClick={() => handleQuantityChange(item.productId._id, item.quantity + 1)} 
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: 'bold', color: 'black' }}>
                                            {item.productId.price ? item.productId.price.toLocaleString('vi-VN') : '0'} VNĐ
                                        </td>
                                        <td style={{ fontWeight: 'bold', color: 'black' }}>
                                            {(item.productId.price * item.quantity) ? (item.productId.price * item.quantity).toLocaleString('vi-VN') : '0'} VNĐ
                                        </td>
                                        <td>
                                            <button className="btn btn-danger" style={{backgroundColor:'white',color:'black',border:'none'}} onClick={() => handleRemove(item.productId._id)}>
                                            <i class="bi bi-trash3"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                
                            </tbody>
                        </table>
                    </div>
    
                    {/* Bảng thông tin thanh toán */}
                    <div className="payment-info">
                        <h3>Thông tin thanh toán</h3>
                        <div className="payment-method">
                            <label>Phương thức thanh toán:</label>
                            {paymentMethods.map((method) => (
                                <div key={method}>
                                    <input
                                        type="radio"
                                        id={method}
                                        name="paymentMethod"
                                        value={method}
                                        checked={paymentMethod === method}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                    />
                                    <label htmlFor={method}>{method}</label>
                                </div>
                            ))}
                        </div>
                        <div className="totalSection">
                        <strong><span style={{ fontWeight: 'bold', color: 'black',marginRight: '80px' }}>Tổng tiền:</span> {cart.totalPrice.toLocaleString('vi-VN')} VNĐ</strong>
                        </div>
                        <button className="btn btn-primary" style={{backgroundColor: '#fba823'}} onClick={handleCheckout}>
                            Thanh toán
                        </button>
                    </div>
                </div>
            )}
             {/* Hiển thị thông báo ở góc dưới màn hình */}
        {message && (
          <div className="toast-message">
            {message}
          </div>
        )}
        </div>
    );
}
