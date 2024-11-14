'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Toast } from 'bootstrap';

export default function AddCate() {
  const router = useRouter();
  const name = useRef('');
  const description = useRef('');
  
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState(''); // 'success' hoặc 'danger'

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = {
      name: name.current.value,
      description: description.current.value,
    };

    try {
      const res = await fetch('http://localhost:3000/danhmuc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      });
      
      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.message || 'Đã có lỗi xảy ra');
      }
      
      setToastMessage('Danh mục đã được thêm thành công!');
      setToastType('success');
      router.push('/quanlydm');
    } catch (err) {
      console.error('Error:', err);
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
    <div className="container my-3">
      <h2 className="text-center mb-4">Thêm Danh Mục</h2>
      <form onSubmit={handleSubmit} className="shadow p-4 rounded bg-light">
        <div className="form-group my-3">
          <label className='form-label'>Tên Danh Mục</label>
          <input type="text" className="form-control" ref={name} required />
        </div>
        <div className="form-group my-3">
          <label className='form-label'>Mô Tả</label>
          <textarea className="form-control" ref={description} required></textarea>
        </div>
        <button type="submit" className="btn btn-primary btn-block">Thêm Danh Mục</button>
      </form>

      {/* Toast for notifications */}
      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        <div id="liveToast" className={`toast align-items-center text-bg-${toastType} border-0 ${!toastMessage ? 'd-none' : ''}`} role="alert" aria-live="assertive" aria-atomic="true">
          <div className="d-flex">
            <div className="toast-body">
              {toastMessage}
            </div>
            <button type="button" className="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
        </div>
      </div>
    </div>
  );
}
