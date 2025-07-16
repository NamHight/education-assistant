'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

const page = () => {
  const router = useRouter();
  return (
    <div className='text-center p-8 max-w-md mx-auto mt-3'>
      <h2 className='text-xl font-bold mb-4'>Đã gửi yêu cầu</h2>
      <p className='text-gray-600 '>Vui lòng kiểm tra email để đặt lại mật khẩu.</p>
      <button className='mt-4 text-blue-600 hover:underline cursor-pointer' onClick={() => router.push('/dang-nhap')}>
        Quay lại đăng nhập
      </button>
    </div>
  );
};

export default page;
