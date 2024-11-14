'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast } from 'bootstrap';


export default function AddProduct() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' hoặc 'danger'

  useEffect(() => {
    const getCategories = async () => {
      const res = await fetch('http://localhost:3000/danhmuc');
      const data = await res.json();
      setCategories(data);
    };
    getCategories();
  }, []);

  const validationSchema = Yup.object({
    name: Yup.string().required('Tên sản phẩm là bắt buộc'),
    price: Yup.number().required('Giá là bắt buộc').positive('Giá phải là số dương'),
    quantity: Yup.number().required('Số lượng là bắt buộc').integer('Số lượng phải là số nguyên').min(1, 'Số lượng phải lớn hơn 0'),
    description: Yup.string().required('Mô tả là bắt buộc'),
    image: Yup.string().url('URL hình ảnh không hợp lệ').required('Hình ảnh là bắt buộc'),
    category: Yup.string().required('Danh mục là bắt buộc'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors, setStatus }) => {
          console.log('Submitted values:', values); // Xem giá trị gửi lên
          console.log('id_danhmuc:', values.id_danhmuc); // Xem giá trị id_danhmuc
    try {
      const res = await fetch('http://localhost:3000/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || 'Đã có lỗi xảy ra');
      }

      setToastMessage('Danh mục đã được thêm thành công!');
      setToastType('success');
      router.push('/quanlysp');
    } catch (err) {
      setToastMessage(err.message);
      setToastType('danger');
    } finally {
      // Hiển thị toast
      const toastElement = document.getElementById('liveToast');
      const toast = new Toast(toastElement);
      toast.show();
    }
  };

  return (
    <div className="form-container">
      <h2>Thêm sản phẩm</h2>
      <Formik
        initialValues={{
          name: '',
          price: '',
          quantity: '',
          description: '',
          image: '',
          category: '',
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            {status?.server && <div className="alert alert-danger">{status.server}</div>}
            {status?.success && <div className="alert alert-success">{status.success}</div>}
  
            <div className="form-group my-2">
              <label className="form-label">Tên sản phẩm</label>
              <Field type="text" name="name" className="form-control" />
              <ErrorMessage name="name" component="div" className="text-danger" />
            </div>
  
            <div className="form-group my-2">
              <label className="form-label">Giá</label>
              <Field type="number" name="price" className="form-control" />
              <ErrorMessage name="price" component="div" className="text-danger" />
            </div>
  
            <div className="form-group my-2">
              <label className="form-label">Số Lượng</label>
              <Field type="number" name="quantity" className="form-control" />
              <ErrorMessage name="quantity" component="div" className="text-danger" />
            </div>
  
            <div className="form-group my-2">
              <label className="form-label">Mô tả</label>
              <Field as="textarea" name="description" className="form-control" />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>
  
            <div className="form-group my-2">
              <label className="form-label">Hình ảnh</label>
              <Field type="text" name="image" className="form-control" />
              <ErrorMessage name="image" component="div" className="text-danger" />
            </div>
  
            <div className="form-group my-2">
              <label className="form-label">Danh mục</label>
              <Field as="select" name="category" className="form-control">
                <option value="category">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Field>
              <ErrorMessage name="category" component="div" className="text-danger" />
            </div>

  
            <button type="submit" className="btn btn-primary my-3" disabled={isSubmitting}>
              Thêm sản phẩm
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}  