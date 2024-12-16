'use client';
import React from 'react';
import { useFormik } from 'formik';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import Link from 'next/link';
import { useEffect, useState } from "react";

// Trang đăng ký
export default function Register() {
    const [message, setMessage] = useState(''); // Thêm state cho thông báo
    const router = useRouter();
    const formik = useFormik({
        initialValues: {
            username: '',
            email: '',
            phone: '',
            address: '',
            password: '',
            rePassword: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Vui lòng nhập họ và tên'),
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
            phone: Yup.string()
                .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ')
                .required('Vui lòng nhập số điện thoại'),
            address: Yup.string().required('Vui lòng nhập địa chỉ'),
            password: Yup.string()
                .matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/, 'Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ và số')
                .required('Vui lòng nhập mật khẩu'),
            rePassword: Yup.string()
                .oneOf([Yup.ref('password'), null], 'Mật khẩu không khớp')
                .required('Vui lòng nhập lại mật khẩu'),
        }),
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const res = await fetch('http://localhost:3000/user/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: values.username,
                        email: values.email,
                        phone: values.phone,
                        address: values.address,
                        password: values.password
                    }),
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    if (res.status === 400 && errorData.message === "Email đã tồn tại") {
                        setFieldError('email', 'Email đã tồn tại');
                    } else {
                        throw new Error(errorData.message || 'Đăng ký thất bại');
                    }
                }
                // Xử lý thành công
                setMessage('Đăng ký thành công');
                setTimeout(() => {
                    setMessage(''); // Ẩn thông báo sau 3 giây
                  }, 3000);
                router.push('/');
            } catch (error) {
                setFieldError('general', error.message);
            } finally {
                setSubmitting(false);
            }
        },
    });
    return (
        <div className="containerdk mt-3">
            <h2>Đăng ký tài khoản</h2>
            <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                    <input
                    placeholder='Tên đăng nhập'
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps('username')}
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div className="text-danger">{formik.errors.username}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <input
                    placeholder='Email'
                        type="email"
                        className="form-control"
                        {...formik.getFieldProps('email')}
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-danger">{formik.errors.email}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <input
                    placeholder='Số điện thoại'
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps('phone')}
                    />
                    {formik.touched.phone && formik.errors.phone ? (
                        <div className="text-danger">{formik.errors.phone}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <input
                    placeholder='Địa chỉ'
                        type="text"
                        className="form-control"
                        {...formik.getFieldProps('address')}
                    />
                    {formik.touched.address && formik.errors.address ? (
                        <div className="text-danger">{formik.errors.address}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <input
                        placeholder='Mật khẩu'
                        type="password"
                        className="form-control"
                        {...formik.getFieldProps('password')}
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-danger">{formik.errors.password}</div>
                    ) : null}
                </div>
                <div className="form-group">
                    <input
                        placeholder='Nhập lại mật khẩu'
                        type="password"
                        className="form-control"
                        {...formik.getFieldProps('rePassword')}
                    />
                    {formik.touched.rePassword && formik.errors.rePassword ? (
                        <div className="text-danger">{formik.errors.rePassword}</div>
                    ) : null}
                </div>
                <button type="submit" className="btn btn-primary my-3" disabled={formik.isSubmitting}>
                    Đăng ký
                </button>
                <div className="login">
                    Bạn đã có tài khoản? <Link href="/dangnhap">Đăng Nhập</Link>
                </div>
                {formik.errors.general && (
                    <p className="my-3 text-danger">{formik.errors.general}</p>
                )}
            </form>
             {/* Hiển thị thông báo ở góc dưới màn hình */}
        {message && (
          <div className="toast-message">
            {message}
          </div>
        )}
        </div>
    );
}
