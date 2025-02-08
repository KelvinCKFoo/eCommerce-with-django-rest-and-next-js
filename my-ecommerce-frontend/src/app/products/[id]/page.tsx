'use client'; // This file is a Client Component because it uses React hooks and handles form interactions.

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
// Import useParams and useRouter from Next.js's navigation package for dynamic routing and navigation.
import { useParams, useRouter } from 'next/navigation';

// Define a TypeScript type for a Product.
type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;
};

export default function ProductDetailPage() {
  // Get the dynamic route parameter 'id'.
  const { id } = useParams();
  // Initialize Next.js router for navigation (e.g., after deleting a product).
  const router = useRouter();

  // Local state to store the fetched product.
  const [product, setProduct] = useState<Product | null>(null);
  // Local state to store form data for editing the product.
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null as File | null,
  });
  // State for messages (success or error).
  const [message, setMessage] = useState<string>('');

  // useEffect to fetch the product details once 'id' is available.
  useEffect(() => {
    if (id) {
      // Fetch the product detail from the Django API.
      fetch(`http://127.0.0.1:8000/api/products/${id}/`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch product');
          }
          return res.json();
        })
        .then((data: Product) => {
          // Save the fetched product data in state.
          setProduct(data);
          // Populate the form fields with the fetched data.
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price.toString(),
            stock: data.stock.toString(),
            image: null, // No file is set initially.
          });
        })
        .catch((error) => {
          console.error('Error fetching product:', error);
          setMessage('Error fetching product details.');
        });
    }
  }, [id]);

  // Handler for text-based input changes.
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Separate handler for file input changes.
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  // Handler for form submission (updating the product).
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior.
    // Create a FormData object to send multipart/form-data (necessary for file uploads).
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // Send a PUT request to update the product.
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: 'PUT',
        body: data,
      });

      if (res.ok) {
        const updatedProduct = await res.json();
        setProduct(updatedProduct);
        setMessage('Product updated successfully!');
      } else {
        const errorData = await res.json();
        setMessage('Error updating product: ' + JSON.stringify(errorData));
      }
    } catch (error: any) {
      setMessage('Network error: ' + error.message);
    }
  };

  // Handler for deleting the product.
  const handleDelete = async () => {
    try {
      // Send a DELETE request to remove the product.
      const res = await fetch(`http://127.0.0.1:8000/api/products/${id}/`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage('Product deleted successfully!');
        // Redirect to the product list page (assumed route: /products).
        router.push('/products');
      } else {
        const errorData = await res.json();
        setMessage('Error deleting product: ' + JSON.stringify(errorData));
      }
    } catch (error: any) {
      setMessage('Network error: ' + error.message);
    }
  };

  // While the product data is being fetched, display a loading message.
  if (!product) {
    return <p>Loading product details...</p>;
  }

  // Render the product detail form, pre-filled with the current product data.
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Edit Product</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleTextChange}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTextChange}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Price:</label>
          <input
            type="number"
            step="0.01"
            name="price"
            value={formData.price}
            onChange={handleTextChange}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Stock:</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleTextChange}
            className="border p-2 w-full text-black"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Image:</label>
          <input
            type="file"
            name="image"
            onChange={handleFileChange}
            className="border p-2 w-full"
          />
          {/* Optionally display a preview of the current image */}
          {product.image && (
            <img
              src={`http://127.0.0.1:8000${product.image}`}
              alt={product.name}
              className="mt-2 w-48"
            />
          )}
        </div>
        <div className="flex space-x-4">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Update Product
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded"
          >
            Delete Product
          </button>
        </div>
      </form>
    </main>
  );
}
