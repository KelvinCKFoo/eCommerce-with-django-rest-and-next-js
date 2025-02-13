'use client';

import React from 'react';
import ProductForm from '@/components/ProductForm';

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Product</h1>
      <ProductForm productId={Number(params.id)} />
    </div>
  );
}
