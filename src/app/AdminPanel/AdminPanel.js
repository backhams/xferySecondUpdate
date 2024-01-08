"use client"

import { useState } from 'react';
import { showErrorToast, showSuccessToast, showWarningToast } from '../components/Toast';

export default function ProductForm() {
    const api = process.env.NEXT_PUBLIC_SERVER_API;
  const [formData, setFormData] = useState({
    productName: '',
    pid: '',
    productImage: '',
    sellPrice: '',
    discountPrice: '',
    categoryName: '',
    description: '',
    productKeyEn: '',
    entryNameEn: '',
    productImageSet: [],
    variants: [
        {
          vid: '',
          pid: '',
          variantName: '',
          variantImage: '',
          variantSellPrice: '',
          variantKey: '',
        }]
  });

  const generateProductId = () => {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < 25; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData({ ...formData, pid: result });
  };


  const generateVariantId = (index) => {
    const characters = '0123456789';
    let result = '';
    for (let i = 0; i < 17; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    const updatedVariants = [...formData.variants];
    updatedVariants[index].vid = result;
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleDeleteImage = (index) => {
    const updatedImages = [...formData.productImageSet];
    updatedImages.splice(index, 1);
    setFormData({ ...formData, productImageSet: updatedImages });
  };
  const handleAddImage = () => {
    // Create a copy of the productImageSet array and add an empty string
    const updatedProductImageSet = [...formData.productImageSet, ''];
    setFormData({ ...formData, productImageSet: updatedProductImageSet });
  };

  const handleAddVariant = () => {
    const updatedVariants = [...formData.variants, {}];
    setFormData({ ...formData, variants: updatedVariants });
  };

  const handleVariantChange = (index, fieldName, value) => {
    const updatedVariants = [...formData.variants];
    updatedVariants[index][fieldName] = value;
    setFormData({ ...formData, variants: updatedVariants });
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
        !formData.productName ||
        !formData.productImage ||
        !formData.sellPrice ||
        !formData.discountPrice ||
        !formData.productKeyEn ||
        !formData.productImageSet.length ||
        !formData.pid ||
        formData.variants.some((variant) => !variant.vid) ||
        formData.variants.some((variant) => !variant.pid) ||
        formData.variants.some((variant) => !variant.variantName) ||
        formData.variants.some((variant) => !variant.variantImage) ||
        formData.variants.some((variant) => !variant.variantSellPrice) ||
        formData.variants.some((variant) => !variant.variantKey)
      ) {
        showWarningToast('Please fill in all required fields.');
        return;
      }

    const variantIds = new Set();
    const productIds = new Set();

    formData.variants.forEach((variant) => {
      if (variantIds.has(variant.vid)) {
        showWarningToast('Variant IDs must be unique.');
        return;
      }
      variantIds.add(variant.vid);

      if (variant.pid !== formData.pid) {
        showWarningToast('Variant product IDs must match the main product ID.');
        return;
      }
      productIds.add(variant.pid);
    });

    // Continue with form submission if all checks pass
    try {
      const response = await fetch(`${api}/importProduct`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        showSuccessToast(data)
        // Reset the form fields after a successful submission
        setFormData({
          productName: '',
          pid: '',
          productImage: '',
          sellPrice: '',
          discountPrice: '',
          categoryName: '',
          description: '',
          productKeyEn: '',
          entryNameEn: '',
          productImageSet: [],
          variants: [
            {
              vid: '',
              pid: '',
              variantName: '',
              variantImage: '',
              variantSellPrice: '',
              variantKey: '',
            }]
        });
      } else {
        showErrorToast(data)
      }
    } catch (error) {
      showErrorToast("Something went wrong.")
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto mt-10 p-4 bg-black rounded shadow-md">
      <label className="block text-white">
        Product Name:
        <input
          type="text"
          name="productName"
          value={formData.productName}
          placeholder='title'
          onChange={handleInputChange}
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
      </label>

      <label className="block text-white mt-4">
        Product Id:
        <input
          type="text"
          name="pid"
          value={formData.pid}
          placeholder='Product Id'
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
        <button
          type="button"
          onClick={generateProductId}
          className="mt-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Generate ID
        </button>
      </label>

      <label className="block text-white mt-4">
        Product First Image:
        <input
          type="text"
          name="productImage"
          value={formData.productImage}
          onChange={handleInputChange}
          placeholder='https://example.com/Image-Url'
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
      </label>

      <label className="block text-white mt-4">
        Sell Price:
        <input
          type="text"
          name="sellPrice"
          value={formData.sellPrice}
          onChange={handleInputChange}
          placeholder='Price'
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
      </label>

      <label className="block text-white mt-4">
        Discount Price:
        <input
          type="text"
          name="discountPrice"
          value={formData.discountPrice}
          onChange={handleInputChange}
          placeholder='Price'
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
      </label>

      <label className="block text-white mt-4">
        Category Name:
        <input
          type="text"
          name="categoryName"
          value={formData.categoryName}
          onChange={handleInputChange}
          placeholder='Category name'
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
      </label>

      <label className="block text-white mt-4">
        Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange} placeholder='Product Description'
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
      </label>

      <label className="block text-white mt-4">
        Product Key (English):
        <input
          type="text"
          name="productKeyEn"
          value={formData.productKeyEn}
          onChange={handleInputChange}
          placeholder='example colour-size'
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
      </label>

      <label className="block text-white mt-4">
        Entry Name (English):
        <input
          type="text"
          name="entryNameEn"
          value={formData.entryNameEn}
          onChange={handleInputChange}
          placeholder='example product nickname'
          className="border border-gray-300 p-2 w-full mt-1 rounded"
        />
      </label>

      <label className="block text-white mt-4">
        Product Images:
        {formData.productImageSet.map((imageUrl, index) => (
          <div key={index} className="mt-4 p-2 bg-gray-100 rounded">
            <label>
              Image URL:
              <input
                type="text"
                value={imageUrl}
                placeholder="More image for user slide image"
                onChange={(e) => {
                  const updatedImages = [...formData.productImageSet];
                  updatedImages[index] = e.target.value;
                  setFormData({ ...formData, productImageSet: updatedImages });
                }}
                className="border border-gray-300 p-2 w-full mt-1 rounded"
              />
            </label>
            {index > 0 && (
              <button
                type="button"
                onClick={() => handleDeleteImage(index)}
                className="mt-2 p-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddImage}
          className="mt-2 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add More Image
        </button>
      </label>

      <label className="block text-white mt-4">
        Variants:
        {formData.variants.map((variant, index) => (
          <div key={index} className="mt-4 p-2 bg-black rounded">
            <div className="mb-4">
              <label>
                Variant ID:
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                value={variant.vid}
                className="border border-gray-300 p-2 w-full rounded"
              />
              <button
                type="button"
                onClick={() => generateVariantId(index)}
                className="ml-2 p-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Generate ID
              </button>
            </div>

            <label>
              productId:
              <input
                type="text"
                value={variant.pid}
                placeholder='Paste here the first productId you genereted'
                onChange={(e) => handleVariantChange(index, 'pid', e.target.value)}
                className="border border-gray-300 p-2 w-full mt-1 rounded"
              />
            </label>
            <label>
              Variant Name:
              <input
                type="text"
                value={variant.variantName}
                onChange={(e) => handleVariantChange(index, 'variantName', e.target.value)}
                className="border border-gray-300 p-2 w-full mt-1 rounded"
              />
            </label>
            <label>
              Variant Image:
              <input
                type="text"
                value={variant.variantImage}
                onChange={(e) => handleVariantChange(index, 'variantImage', e.target.value)}
                className="border border-gray-300 p-2 w-full mt-1 rounded"
              />
            </label>
            <label>
              variantSellPrice:
              <input
                type="text"
                value={variant.variantSellPrice}
                onChange={(e) => handleVariantChange(index, 'variantSellPrice', e.target.value)}
                className="border border-gray-300 p-2 w-full mt-1 rounded"
              />
            </label>
            <label>
              Variant Key:
              <input
                type="text"
                value={variant.variantKey}
                onChange={(e) => handleVariantChange(index, 'variantKey', e.target.value)}
                className="border border-gray-300 p-2 w-full mt-1 rounded"
              />
            </label>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddVariant}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Add Variant
        </button>
      </label>

      <button
        type="submit"
        className="mt-6 p-2 bg-blue-500 text-white rounded hover-bg-blue-600"
      >
        Submit
      </button>
    </form>
  );
}


