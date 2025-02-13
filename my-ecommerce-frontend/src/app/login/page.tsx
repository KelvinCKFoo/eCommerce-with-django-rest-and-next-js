'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

type LoginFormData = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  const [message, setMessage] = useState<string>('');
  const router = useRouter();

  // Function to get CSRF token from cookies
  const getCSRFToken = () => {
    const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
    return match ? match[2] : '';
  };

  const onSubmit = async (data: LoginFormData) => {
    try {
      const csrfToken = getCSRFToken();
      const res = await fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken, // Include the CSRF token in the header
        },
        body: JSON.stringify(data),
        credentials: 'include', // Ensure cookies are sent/received
      });

      if (res.ok) {
        const result = await res.json();
        if (result.is_staff) {
          router.push('/manage');
        } else {
          setMessage('Access denied: You are not a staff member.');
        }
      } else {
        const errorData = await res.json();
        setMessage('Login failed: ' + JSON.stringify(errorData));
      }
    } catch (error: any) {
      setMessage('Network error: ' + error.message);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Staff Login</h1>
      {message && <p className="mb-4 text-red-500">{message}</p>}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-black">Username</label>
          <input
            type="text"
            {...register('username', { required: 'Username is required' })}
            className="border p-2 w-full text-black bg-white"
          />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium text-black">Password</label>
          <input
            type="password"
            {...register('password', { required: 'Password is required' })}
            className="border p-2 w-full text-black bg-white"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded w-full">
          Login
        </button>
      </form>
    </main>
  );
}
