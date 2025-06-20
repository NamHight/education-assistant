'use client';
import { useAuthStore } from '@/stores/authStore';
import React from 'react';

const page = () => {
  const { user } = useAuthStore();
  return <div>{user ? <h1>Welcome back, {user?.hoTen}!</h1> : <h1>Please log in.</h1>}</div>;
};

export default page;
