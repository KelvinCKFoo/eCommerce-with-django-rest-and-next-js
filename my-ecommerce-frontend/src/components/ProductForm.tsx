'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

type ProductFormData = {
  id?: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image?: FileList | null;
};

export default function ProductForm({ productId }: { productId?: number }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>();

  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (productId) {
      fetch(`http://127.0.0.1:8000/api/products/${productId}/`)
        .then((res) => res.json())
        .then((data) => {
          setValue('name', data.name);
          setValue('description', data.description);
          setValue('price', data.price);
          setValue('stock', data.stock);
        })
        .catch(() => setMessage('Failed to fetch product details'));
    }
  }, [productId, setValue]);

  const onSubmit = async (data: ProductFormData) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('stock', String(data.stock));
    if (data.image && data.image.length > 0) {
      formData.append('image', data.image[0]);
    }

    const method = productId ? 'PUT' : 'POST';
    const url = productId
      ? `http://127.0.0.1:8000/api/products/${productId}/`
      : `http://127.0.0.1:8000/api/products/enter/`;

    try {
      const res = await fetch(url, {
        method,
        body: formData,
      });

      if (res.ok) {
        reset();
        setMessage(`Product ${productId ? 'updated' : 'created'} successfully!`);
        router.push('/manage'); // Redirect to product list after edit
      } else {
        setMessage('Failed to process request.');
      }
    } catch (_) {
      setMessage('Network error.');
    }
  };

  const handleDelete = async () => {
    if (!productId) return;
    const confirmed = confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/products/${productId}/`, {
        method: 'DELETE',
      });

      if (res.ok) {
        reset();
        setMessage('Product deleted successfully!');
        router.push('/manage');
      } else {
        setMessage('Failed to delete product.');
      }
    } catch (_) {
      setMessage('Network error while deleting.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-gray-900 text-white shadow-lg rounded-lg p-6">
      {message && <p className="text-green-400 mb-4" aria-live="polite">{message}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block font-medium text-gray-300">Name</label>
          <input
            {...register('name', { required: 'Product name is required' })}
            className="border p-2 w-full text-black bg-gray-100"
          />
          {errors.name && <p className="text-red-400">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-300">Description</label>
          <textarea
            {...register('description', { required: 'Description is required' })}
            className="border p-2 w-full text-black bg-gray-100"
          />
          {errors.description && <p className="text-red-400">{errors.description.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-300">Price</label>
          <input
            type="number"
            step="0.01"
            {...register('price', { required: 'Price is required' })}
            className="border p-2 w-full text-black bg-gray-100"
          />
          {errors.price && <p className="text-red-400">{errors.price.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-300">Stock</label>
          <input
            type="number"
            {...register('stock', { required: 'Stock is required' })}
            className="border p-2 w-full text-black bg-gray-100"
          />
          {errors.stock && <p className="text-red-400">{errors.stock.message}</p>}
        </div>
        <div>
          <label className="block font-medium text-gray-300">Image</label>
          <input
            type="file"
            {...register('image')}
            className="border p-2 w-full text-gray-400 bg-gray-100"
          />
        </div>
        <button
          type="submit"
          className={`bg-blue-500 text-white p-2 rounded w-full ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={isSubmitting}
        >
          {productId ? 'Update Product' : 'Create Product'}
        </button>
        {productId && (
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white p-2 rounded w-full mt-2 hover:bg-red-600"
          >
            Delete Product
          </button>
        )}
      </form>
    </div>
  );
}
