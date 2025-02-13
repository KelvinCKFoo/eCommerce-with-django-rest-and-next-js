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
    if (!confirmed) {
      return; // Cancel deletion if user does not confirm.
    }

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
  const handleLogout = async () => {
    router.push('/logout');
  };

  return (
    <div className="p-4">
      <header className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </header>

      {message && <p className="mb-4 text-red-500">{message}</p>}

      <div className="mb-4">
        <Link
          href="/create"
          className="bg-green-500 text-white px-4 py-2 rounded inline-block"
        >
          Create New Product
        </Link>
      </div>

      <ul className="space-y-4">
        {products.map((product) => (
          <li
            key={product.id}
            className="border p-4 flex justify-between items-center"
          >
            <div>
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p>{product.description}</p>
              <p>${Number(product.price).toFixed(2)}</p>
              <p>Stock: {product.stock}</p>
            </div>
            <div className="flex space-x-2">
              <Link
                href={`/manage/${product.id}`}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(product.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
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
