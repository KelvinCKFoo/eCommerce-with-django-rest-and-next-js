// src/app/products/[id]/page.tsx

// Import the `notFound` function from Next.js to handle missing products.
import { notFound } from 'next/navigation';
import React from 'react';

// Define a TypeScript type for a Product.
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
  // Add any additional product properties if needed.
};

// This function fetches the product details from the Django backend.
async function fetchProduct(id: string): Promise<Product> {
  // Fetch the product using the provided ID.
  // Using `cache: 'no-store'` to ensure fresh data on every request.
  const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
    cache: 'no-store',
  });

  // If the fetch fails (e.g., product not found), throw an error.
  if (!res.ok) {
    throw new Error(`Failed to fetch product with id ${id}`);
  }

  // Parse and return the JSON data as a Product object.
  return res.json();
}

// The default exported component is an async server component.
// It receives the dynamic route parameters via the `params` prop.
export default async function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  let product: Product;

  try {
    // Attempt to fetch the product data using the id from the URL.
    product = await fetchProduct(params.id);
  } catch (error) {
    // If fetching fails, render a 404 Not Found page.
    notFound();
  }

  // Render the product detail page.
  return (
    <main className="container mx-auto p-4">
      {/* Product Name */}
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {/* Product Image */}
      {product.image && (
        <img
          src={`http://127.0.0.1:8000${product.image}`}
          alt={product.name}
          className="w-full h-64 object-cover mb-4"
        />
      )}

      {/* Product Description */}
      {/* The 'whitespace-pre-line' class ensures newline characters (\n) are rendered as line breaks */}
      <p className="text-lg mb-4 whitespace-pre-line">{product.description}</p>

      {/* Product Price */}
      <p className="text-xl font-semibold mb-2">
        Price: ${Number(product.price).toFixed(2)}
      </p>

      {/* Product Stock */}
      <p className="text-md text-gray-600">Stock: {product.stock}</p>

      {/* Add additional product details here if needed */}
    </main>
  );
}
