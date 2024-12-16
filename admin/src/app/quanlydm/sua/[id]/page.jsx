'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditProduct({ params }) {
  const router = useRouter();
  const resolvedParams = use(params); // Sử dụng `use()` để xử lý `params` như là một Promise
  const { id } = resolvedParams; // Lấy `id` từ `resolvedParams`
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [danhmuc, setDanhmuc] = useState(null);

  useEffect(() => {
    const getCate = async () => {
      const res = await fetch(`http://localhost:3000/danhmuc/${id}`);
      const data = await res.json();
      setDanhmuc(data);
      setValue('name', data.name); // Đặt giá trị ban đầu cho form
      setValue('description', data.description);
    };
    if (id) {
      getCate();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const updatedDanhmuc = {
      name: data.name,
      description: data.description,
    };

    const res = await fetch(`http://localhost:3000/danhmuc/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedDanhmuc),
    });

    const result = await res.json();
    if (!result.error) {
      router.push('/quanlydm');
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="centered-form-container-dm">
      <h2>Chỉnh sửa danh mục</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group my-2">
          <label className='form-label'>Tên danh mục</label>
          <input type="text" className="form-control" {...register('name', { required: 'Tên danh mục là bắt buộc' })} />
          {errors.name && <div className="text-danger">{errors.name.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Mô tả</label>
          <textarea className="form-control" {...register('description', { required: 'Mô tả là bắt buộc' })} />
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>
        
        <button type="submit" className="btn btn-primary my-3">Cập nhật danh mục</button>
      </form>
    </div>
  );
}
