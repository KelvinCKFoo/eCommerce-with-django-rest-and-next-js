'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Function to get CSRF token from cookies
const getCSRFToken = () => {
  if (typeof document !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
    return match ? match[2] : null;
  }
  return null;
};

export default function LogoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const logout = async () => {
      try {
        const csrfToken = getCSRFToken();
        const res = await fetch('http://localhost:8000/api/logout/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrfToken || '',
          },
          credentials: 'include',
        });

        if (res.ok) {
          console.log('Logout successful, redirecting to /login');
          router.push('/login');
        } else {
          const errText = await res.text();
          console.error('Logout failed:', errText);
        }
      } catch (error) {
        console.error('Network error during logout:', (error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Logging out...</h2>
        {loading && <p className="text-gray-300">Please wait...</p>}
      </div>
    </div>
  );
}
