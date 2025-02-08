// Import React. In Next.js 13 Server Components, this import is optional if you're only using JSX.
import React from 'react';

// Define a TypeScript type for a Product.
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null; // Image is optional and may be null.
};

// This asynchronous function is a Server Component that fetches products from the API.
export default async function HomePage() {
  // Fetch product data from your Django backend.
  // The 'cache: "no-store"' option ensures fresh data on every request.
  const res = await fetch('http://127.0.0.1:8000/api/products/', {
    cache: 'no-store',
  });

  // If the fetch fails, throw an error (Next.js will show an error page).
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  // Parse the JSON response into a list of Product objects.
  const products: Product[] = await res.json();

  // Return the JSX for the page.
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Product List</h1>
      {/* Iterate over the products array and render each product */}
      {products.map((product) => (
        <div key={product.id} className="border rounded p-4 mb-4">
          <h2 className="text-xl font-semibold">{product.name}</h2>
          <p>{product.description}</p>
          <p className="font-medium">Price: ${product.price}</p>
          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
          {/* If the product has an image, render it */}
          {product.image && (
            <img
              src={`http://127.0.0.1:8000${product.image}`}
              alt={product.name}
              className="mt-2 w-48"
            />
          )}
        </div>
      ))}
    </main>
  );
}
