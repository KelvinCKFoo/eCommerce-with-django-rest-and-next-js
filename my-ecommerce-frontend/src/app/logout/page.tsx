'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

function getCSRFToken() {
  const match = document.cookie.match(new RegExp('(^| )csrftoken=([^;]+)'));
  return match ? match[2] : null;
}

export default function LogoutPage() {
  const router = useRouter();

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
        console.log('Logout response status:', res.status);
        if (res.ok) {
          console.log('Logout successful, redirecting to /login');
          router.push('/login');
        } else {
          const errText = await res.text();
          console.error('Logout failed:', errText);
        }
      } catch (error: any) {
        console.error('Network error during logout:', error);
      }
    };

    logout();
  }, [router]);

  return (
    <div className="container mx-auto p-4">
      <p>Logging out...</p>
    </div>
  );
}
