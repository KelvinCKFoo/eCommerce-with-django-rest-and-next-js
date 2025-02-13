// src/app/products/[id]/page.tsx

import { notFound } from 'next/navigation';
import React from 'react';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
};

async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch product with id ${id}`);
  }

  return res.json();
}

export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product: Product;

  try {
    product = await fetchProduct(params.id);
  } catch (_) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {product.image && (
        <img
          src={`http://127.0.0.1:8000${product.image}`}
          alt={product.name}
          className="mx-auto w-full max-w-sm h-auto object-contain mb-4"
        />
      )}

      <p className="text-lg mb-4 whitespace-pre-line">{product.description}</p>
      <p className="text-xl font-semibold mb-2">
        Price: ${Number(product.price).toFixed(2)}
      </p>
      <p className="text-md text-gray-600">Stock: {product.stock}</p>
    </main>
  );
}
