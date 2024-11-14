'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { use } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditCate({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [categories, setCategories] = useState([]);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const res = await fetch('http://localhost:3000/danhmuc');
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    const getProduct = async () => {
      try {
        const res = await fetch(`http://localhost:3000/sanpham/${id}`);
        const data = await res.json();
        setProduct(data);
        setValue('name', data.name);
        setValue('price', data.price);
        setValue('image', data.image);
        setValue('description', data.description);
        setValue('categoryId', data.categoryId);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    if (id) {
      getCategories();
      getProduct();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    try {
      const updatedProduct = {
        name: data.name,
        price: data.price,
        image: data.image,
        description: data.description,
        categoryId: data.categoryId,
      };

      const res = await fetch(`http://localhost:3000/sanpham/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (res.ok) {
        router.push('/quanlysp');
      } else {
        const errorData = await res.json();
        console.error("Cập nhật thất bại:", errorData.error || "Lỗi không xác định");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="centered-form-container-sp">
      
      <form onSubmit={handleSubmit(onSubmit)} className="centered-form">
        <div className="form-group my-2">
          <label className='form-label'>Tên sản phẩm</label>
          <input type="text" className="form-control" {...register('name', { required: 'Tên sản phẩm là bắt buộc' })} />
          {errors.name && <div className="text-danger">{errors.name.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Giá</label>
          <input type="number" className="form-control" {...register('price', { required: 'Giá là bắt buộc', valueAsNumber: true })} />
          {errors.price && <div className="text-danger">{errors.price.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Mô tả</label>
          <textarea className="form-control" {...register('description', { required: 'Mô tả là bắt buộc' })} />
          {errors.description && <div className="text-danger">{errors.description.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Hình ảnh</label>
          <input type="text" className="form-control" {...register('image', { required: 'Hình ảnh là bắt buộc' })} />
          {errors.image && <div className="text-danger">{errors.image.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Danh mục</label>
          <select className='form-control' {...register('categoryId', { required: 'Chọn một danh mục' })}>
            <option value="">Chọn danh mục</option>
            {categories.map((category) => (
              <option key={category._id} value={category._id}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.categoryId && <div className="text-danger">{errors.categoryId.message}</div>}
        </div>
        <button type="submit" className="btn btn-primary my-3">Cập nhật sản phẩm</button>
      </form>
    </div>
  );
}
