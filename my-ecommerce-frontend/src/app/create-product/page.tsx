'use client'; // Marks this file as a Client Component.

import React, { useState, ChangeEvent, FormEvent } from 'react';

// Define a type for our form data.
type ProductFormData = {
  name: string;
  description: string;
  price: string;
  stock: string;
  image: File | null;
};

export default function CreateProductPage() {
  // useState hook to manage form data.
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null,
  });
  // useState hook for setting a success or error message.
  const [message, setMessage] = useState<string>('');

  // Handler for text-based inputs (text, number, textarea).
  const handleTextChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Separate handler for file inputs.
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, image: e.target.files[0] }));
    }
  };

  // Handler for form submission.
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission behavior.

    // Create a FormData object for sending multipart/form-data.
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('stock', formData.stock);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      // Send a POST request to the Django API endpoint.
      const res = await fetch('http://127.0.0.1:8000/api/products/enter/', {
        method: 'POST',
        body: data,
      });

      if (res.ok) {
        const result = await res.json();
        setMessage('Product created successfully!');
        // Optionally clear the form fields.
        setFormData({
          name: '',
          description: '',
          price: '',
          stock: '',
          image: null,
        });
      } else {
        const error = await res.json();
        setMessage('Error creating product: ' + JSON.stringify(error));
      }
    } catch (error) {
      setMessage('Network error: ' + error);
    }
  };

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Create a New Product</h1>
      {message && <p className="mb-4">{message}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleTextChange}
            className="border p-2 w-full text-black"  // text-black ensures the text is black
            required
          />
        </div>
        <div>
          <label className="block font-medium">Description:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleTextChange}
            className="border p-2 w-full text-black"  // Ensures text is black
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
            className="border p-2 w-full text-black" // Adding text-black may not affect file inputs, but ensures consistency
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Create Product
        </button>
      </form>
    </main>
  );
}
