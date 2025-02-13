import Link from 'next/link';

export default async function ManageProductsPage() {
  const res = await fetch('http://127.0.0.1:8000/api/products/', { cache: 'no-store' });

  if (!res.ok) {
    return <p className="text-red-500">Failed to load products</p>;
  }

  const products = await res.json();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Products</h1>
      <Link href="/create" className="bg-green-500 text-black p-2 rounded mb-4 inline-block">
        Create New Product
      </Link>
      <ul className="mt-4 space-y-2">
        {products.map((product: { id: number; name: string }) => (
          <li key={product.id} className="border p-2 flex justify-between items-center">
            <span>{product.name}</span>
            <Link
              href={`/manage/${product.id}`}
              className="bg-blue-500 text-black px-3 py-1 rounded"
            >
              Edit
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
