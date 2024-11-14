'use client';   
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from 'next/link';

export default function Login() {
    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Bắt buộc'),
            password: Yup.string().required('Bắt buộc'),
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const res = await fetch('http://localhost:3000/user/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: values.email, password: values.password }),
                });
            
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Đăng nhập thất bại');
                }
            
                // Lưu token vào localStorage
                const data = await res.json();
                localStorage.setItem('token', data.token);
            
                // Kiểm tra token và vai trò người dùng
                const token = data.token;
                const payload = JSON.parse(atob(token.split('.')[1]));
                console.log("Token payload:", payload); // Kiểm tra payload
            
                if (payload.user.role === 'admin') {
                    console.log("Vai trò: Admin, chuyển hướng đến trang quản trị");
                    window.location.href = 'http://localhost:3002';
                } else {
                    console.log("Vai trò: User, chuyển hướng đến trang chủ");
                    window.location.href = '/';
                }
            } catch (error) {
                setFieldError('general', error.message);
            } finally {
                setSubmitting(false);
            }            
        },
    });

    return (
        <>
<div className="containerdn">
<div className="loginBox">
  <div className="logodn">
    <img src="/image/logofesh.png" alt="Fast Food Logo" />
  </div>
  <h1 className="title">ĐĂNG NHẬP</h1>
  <form onSubmit={formik.handleSubmit}>
    <input
    style={{marginBottom:'40px',borderRadius:'8px'}}
      type="email"
      placeholder='Email'
      name="email"
      className="form-control"
      {...formik.getFieldProps('email')}
    />
    {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                    ) : null}
    <input
    style={{marginBottom:'10px',borderRadius:'8px'}}
      type="password"
      placeholder='Password'
      name="password"
      className="form-control"
      {...formik.getFieldProps('password')}
    />
    {formik.touched.password && formik.errors.password ? (
                        <div style={{marginBottom:'10px'}} className="text-danger">{formik.errors.password}</div>
                    ) : null}
    <div className="forgotPassword">
      <Link href="/reset-password">Quên mật khẩu?</Link>
    </div>
    <button type="submit" className=" loginButtondn" disabled={formik.isSubmitting}>
                    Đăng nhập
                </button>
                {formik.errors.general ? (
                    <div className="text-danger mt-2">{formik.errors.general}</div>
                ) : null}
  </form>
  <div className="signup">
    Bạn chưa có tài khoản? <Link href="/dangky">Đăng ký Ngay</Link>
  </div>
</div>
</div>
</>
    );
}
