// app/products/page.tsx

import Link from 'next/link';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
};

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch('http://127.0.0.1:8000/api/products/');
  if (!res.ok) {
    throw new Error('Failed to fetch products');
  }
  return res.json();
}

export default async function ProductListPage() {
  const products = await fetchProducts();

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Product List</h1>
      {products.map((product) => (
        <div key={product.id} className="border rounded p-4 mb-4">
          <h2 className="text-xl font-semibold">
            <Link href={`/products/${product.id}`}>
              {product.name}
            </Link>
          </h2>
          <p>{product.description}</p>
          <p className="font-medium">Price: ${product.price.toFixed(2)}</p>
          <p className="text-sm text-gray-600">Stock: {product.stock}</p>
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
