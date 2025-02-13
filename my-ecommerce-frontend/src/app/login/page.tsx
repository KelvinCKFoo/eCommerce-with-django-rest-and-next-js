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
    if (typeof document !== 'undefined') {
      const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
      return match ? match[2] : '';
    }
    return '';
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

      if (!res.ok) {
        const errorData = await res.json();
        setMessage('Login failed: ' + (errorData.detail || 'Invalid credentials.'));
        return;
      }

      const result: { is_staff: boolean } = await res.json();
      if (result.is_staff) {
        router.push('/manage');
      } else {
        setMessage('Access denied: You are not a staff member.');
      }
    } catch (error) {
      setMessage('Network error: ' + (error as Error).message);
    }
  };

  return (
    <main className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-lg w-96">
        <h1 className="text-3xl font-bold text-center mb-4">Staff Login</h1>
        {message && <p className="mb-4 text-red-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-medium text-gray-300">Username</label>
            <input
              type="text"
              {...register('username', { required: 'Username is required' })}
              className="border p-2 w-full text-black bg-white rounded"
            />
            {errors.username && (
              <p className="text-red-500">{errors.username.message}</p>
            )}
          </div>
          <div>
            <label className="block font-medium text-gray-300">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="border p-2 w-full text-black bg-white rounded"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded w-full transition duration-200">
            Login
          </button>
        </form>
      </div>
    </main>
  );
}
