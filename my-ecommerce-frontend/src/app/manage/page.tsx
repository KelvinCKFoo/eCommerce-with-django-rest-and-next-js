'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
};

export default function ManageProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [message, setMessage] = useState<string>('');

  // Fetch products on mount.
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/products/', {
          cache: 'no-store',
          credentials: 'include',
        });
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        setMessage('Error fetching products');
        console.error(error);
      }
    };
    fetchProducts();
  }, []);

  // Delete a product with confirmation and update the list.
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://localhost:8000/api/products/${id}/`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (res.ok) {
        setProducts(products.filter((product) => product.id !== id));
      } else {
        setMessage('Error deleting product');
      }
    } catch (error) {
      setMessage('Network error while deleting');
    }
  };

  // Logout function: simply redirect to the logout page.
  const handleLogout = () => {
    router.push('/logout');
  };

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-extrabold text-white drop-shadow-lg">
          Manage Products
        </h1>
        <button
          onClick={handleLogout}
          className="bg-gray-800 text-red-400 px-6 py-2 rounded-full shadow-lg hover:bg-gray-700 transition duration-200"
        >
          Logout
        </button>
      </header>

      {message && <p className="mb-4 text-yellow-200 font-semibold">{message}</p>}

      <div className="mb-6">
        <Link
          href="/create"
          className="bg-gray-800 text-green-400 px-6 py-2 rounded-full shadow-lg hover:bg-gray-700 transition duration-200 inline-block"
        >
          Create New Product
        </Link>
      </div>

      <ul className="space-y-6">
        {products.map((product) => (
          <li
            key={product.id}
            className="bg-gray-800 bg-opacity-90 rounded-lg p-6 shadow-xl flex justify-between items-center transform hover:scale-[1.02] transition duration-200"
          >
            <div>
              <h3 className="text-2xl font-bold text-white">{product.name}</h3>
              <p className="text-gray-300 mt-2">{product.description}</p>
              <p className="text-lg font-medium text-indigo-300 mt-2">
                ${Number(product.price).toFixed(2)}
              </p>
              <p className="text-sm text-gray-400 mt-1">Stock: {product.stock}</p>
            </div>
            <div className="flex flex-col space-y-2">
              <Link
                href={`/manage/${product.id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition duration-200"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
