'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast } from 'bootstrap';


export default function AddNews() {
  const router = useRouter();
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' hoặc 'danger'

  const validationSchema = Yup.object({
    tiltle: Yup.string().required('Tên bài viết là bắt buộc'),
    description: Yup.string().required('Nội dung là bắt buộc'),
    image: Yup.string().url('URL hình ảnh không hợp lệ').required('Hình ảnh là bắt buộc'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors, setStatus }) => {
          console.log('Submitted values:', values); // Xem giá trị gửi lên
    try {
      const res = await fetch('http://localhost:3000/addnew', {
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
      setToastType('success');
      router.push('/quanlytt');
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
      <h2>Thêm Bài Viết</h2>
      <Formik
        initialValues={{
          tiltle: '',
          description: '',
          image: '',        
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, status }) => (
          <Form>
            {status?.server && <div className="alert alert-danger">{status.server}</div>}
            {status?.success && <div className="alert alert-success">{status.success}</div>}
  
            <div className="form-group my-2">
              <label className="form-label">Tiêu Đề Bài Viết</label>
              <Field type="text" name="tiltle" className="form-control" />
              <ErrorMessage name="tiltle" component="div" className="text-danger" />
            </div>

            <div className="form-group my-2">
              <label className="form-label">Nội Dung Bài Viết</label>
              <Field as="textarea" name="description" className="form-control" />
              <ErrorMessage name="description" component="div" className="text-danger" />
            </div>
  
            <div className="form-group my-2">
              <label className="form-label">Hình ảnh</label>
              <Field type="text" name="image" className="form-control"/>
              <ErrorMessage name="image" component="div" className="text-danger" />
            </div>
  
            <button type="submit" className="btn btn-primary my-3" disabled={isSubmitting}>
              Thêm Bài Viết
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}  