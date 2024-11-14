'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { use } from 'react';
import bcrypt from 'bcryptjs'; // Nhập bcryptjs
import 'bootstrap/dist/css/bootstrap.min.css';

export default function EditProduct({ params }) {
  const router = useRouter();
  const { id } = use(params);

  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`http://localhost:3000/user/${id}`);
      if (!res.ok) {
        console.error('Lỗi khi lấy dữ liệu người dùng');
        return;
      }
      const data = await res.json();
      setUser(data);
      // Đặt giá trị ban đầu cho form
      setValue('username', data.username);
      setValue('email', data.email);
      // Lưu ý: Không đặt giá trị mật khẩu để bảo mật
      setValue('phone', data.phone);
      setValue('address', data.address);
      setValue('role', data.role);
    };
    
    if (id) {
      getUser();
    }
  }, [id, setValue]);

  const onSubmit = async (data) => {
    const hashedPassword = await bcrypt.hash(data.password, 10); // Mã hóa mật khẩu

    const updatedUser = {
      username: data.username, 
      email: data.email, 
      password: hashedPassword, // Sử dụng mật khẩu đã mã hóa
      phone: data.phone, 
      address: data.address,
      role: data.role
    };

    const res = await fetch(`http://localhost:3000/user/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    const result = await res.json();
    if (!result.error) {
      router.push('/quanlyuser'); // Chuyển hướng sau khi cập nhật thành công
    } else {
      console.error(result.error);
    }
  };

  return (
    <div className="centered-form-container-dm">
      <h2>Chỉnh sửa người dùng</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group my-2">
          <label className='form-label'>Họ và Tên</label>
          <input 
            type="text" 
            className="form-control" 
            {...register('username', { required: 'Họ và tên là bắt buộc' })} 
          />
          {errors.username && <div className="text-danger">{errors.username.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Email</label>
          <input 
            type="email" 
            className="form-control" 
            {...register('email', { required: 'Email là bắt buộc', pattern: { value: /^\S+@\S+$/i, message: 'Email không hợp lệ' } })} 
          />
          {errors.email && <div className="text-danger">{errors.email.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Mật khẩu</label>
          <input 
            type="password" 
            className="form-control" 
            {...register('password', { required: 'Mật khẩu là bắt buộc' })} 
          />
          {errors.password && <div className="text-danger">{errors.password.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Số điện thoại</label>
          <input 
            type="text" 
            className="form-control" 
            {...register('phone', { required: 'Số điện thoại là bắt buộc' })} 
          />
          {errors.phone && <div className="text-danger">{errors.phone.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Địa chỉ</label>
          <textarea 
            className="form-control" 
            {...register('address', { required: 'Địa chỉ là bắt buộc' })} 
          />
          {errors.address && <div className="text-danger">{errors.address.message}</div>}
        </div>
        <div className="form-group my-2">
          <label className='form-label'>Vai trò</label>
          <select 
            className="form-control" 
            {...register('role', { required: 'Vai trò là bắt buộc' })}
          >
            <option value="">Chọn vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="user">Người dùng</option>
          </select>
          {errors.role && <div className="text-danger">{errors.role.message}</div>}
        </div>
        <button type="submit" className="btn btn-primary my-3">Cập nhật người dùng</button>
      </form>
    </div>
  );
}
