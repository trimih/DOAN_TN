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
  const [news, setNews] = useState(null);

  useEffect(() => {
    const getCate = async () => {
      const res = await fetch(`http://localhost:3000/news/${id}`);
      const data = await res.json();
      setNews(data);
      setValue('tiltle', data.tiltle); // Đặt giá trị ban đầu cho form
      setValue('description', data.description);
      setValue('image', data.image);
    };
    if (id) {
      getCate();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const updatedNews = {
      tiltle: data.tiltle,
      image: data.image,
      description: data.description,
    };

    const res = await fetch(`http://localhost:3000/new/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedNews),
    });

    const result = await res.json();
    if (!result.error) {
      router.push('/quanlytt');
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="centered-form-container-dm">
      <h2>Chỉnh sửa Bài Viết</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group my-2">
          <label className='form-label'>Tên Bài Viết</label>
          <input type="text" className="form-control" {...register('tiltle', { required: 'Tiêu đề bài viết là bắt buộc' })} />
          {errors.tiltle && <div className="text-danger">{errors.tiltle.message}</div>}
        </div>

        <div className="form-group my-2">
          <label className='form-label'>Mô tả</label>
          <textarea className="form-control" {...register('description', { required: 'Mô tả bài viết là bắt buộc' })} />
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Hình Ảnh</label>
          <textarea className="form-control" {...register('image', { required: 'Hình ảnh là bắt buộc' })} />
          {errors.image && <div className="text-danger">{errors.image.message}</div>}
        </div>
        
        <button type="submit" className="btn btn-primary my-3">Lưu</button>
      </form>
    </div>
  );
}
