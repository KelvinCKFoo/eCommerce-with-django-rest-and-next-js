// Import React (optional in Server Components, but useful for JSX types).
import React from 'react';

// Define a TypeScript type for a Product.
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null; // The image field is optional.
};

// The HomePage component is a Server Component that fetches product data
// at request time using Next.js's App Router.
export default async function HomePage() {
  // Fetch product data from the Django REST API.
  // Using `cache: 'no-store'` ensures fresh data on every request.
  const res = await fetch('http://127.0.0.1:8000/api/products/', {
    cache: 'no-store',
  });

  // If the fetch fails, throw an error so that Next.js displays an error page.
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }

  // Parse the JSON response into an array of Product objects.
  const products: Product[] = await res.json();

  // Return the JSX for the page.
  return (
    <main className="bg-gray-100 min-h-screen">
      {/* Header Section: Mimicking eBay's header with logo and navigation */}
      <header className="bg-white shadow p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo or site name */}
          <h1 className="text-2xl font-bold text-blue-600">eBay Clone</h1>
          {/* Simple navigation menu */}
          <nav>
            <ul className="flex space-x-4">
              <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Home</li>
              <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Categories</li>
              <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Deals</li>
              <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Sell</li>
              <li className="text-gray-700 hover:text-blue-600 cursor-pointer">Help</li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content: Product Listing */}
      <div className="container mx-auto py-8">
        {/* Section Title */}
        <h2 className="text-xl font-semibold mb-6">Featured Products</h2>
        {/* Product Grid: Responsive grid using Tailwind CSS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
  <div key={product.id} className="bg-white border rounded shadow hover:shadow-lg transition duration-200">
    {product.image && (
      <img
        src={`http://127.0.0.1:8000${product.image}`}
        alt={product.name}
        className="w-full h-48 object-cover rounded-t"
      />
    )}
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>
      <p className="mt-4 text-blue-600 font-semibold">${Number(product.price).toFixed(2)}</p>
      <p className="text-xs text-gray-500 mt-1">Stock: {product.stock}</p>
    </div>
  </div>
))}

          
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-white border-t p-4">
        <div className="container mx-auto text-center text-gray-600">
          © 2025 eBay Clone. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
